import { getFirestore, collection, query, where, getDocs, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const db = getFirestore();
    const auth = getAuth();

    function getCurrentUserId() {
        const user = auth.currentUser;
        return user ? user.uid : null;
    }

    // Function to create an order div
    function createOrderDiv(orderData) {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('orders');  // Apply 'orders' class to each order div

        // Order ID
        const orderId = document.createElement('h4');
        orderId.textContent = `Order ID: ${orderData.orderID}`;
        orderDiv.appendChild(orderId);

        // Status
        const status = document.createElement('p');
        status.textContent = `Status: ${orderData.status || 'Incomplete'}`; // Ensure this defaults to 'Incomplete'
        orderDiv.appendChild(status);

        // Order Date
        const orderDate = document.createElement('p');
        orderDate.textContent = `Order Date: ${new Date(orderData.orderDate).toLocaleString()}`;
        orderDiv.appendChild(orderDate);

        // Items
        if (orderData.cartItems && Array.isArray(orderData.cartItems)) {
            orderData.cartItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item-details');

                if (item.image) {
                    const itemImage = document.createElement('img');
                    itemImage.src = item.image;
                    itemImage.alt = item.name;
                    itemImage.classList.add('orders-image');
                    itemDiv.appendChild(itemImage);
                }

                const itemName = document.createElement('p');
                itemName.textContent = `Name: ${item.name}`;
                itemDiv.appendChild(itemName);

                const itemPrice = document.createElement('p');
                itemPrice.textContent = `Price: RM ${item.price}`;
                itemDiv.appendChild(itemPrice);

                const itemQuantity = document.createElement('p');
                itemQuantity.textContent = `Quantity: ${item.quantity}`;
                itemDiv.appendChild(itemQuantity);

                orderDiv.appendChild(itemDiv);
            });
        }

        // Order Details
        const orderDetails = document.createElement('div');
        orderDetails.classList.add('order-details');

        const br = document.createElement('br');
        orderDetails.appendChild(br);

        const totalPrice = document.createElement('p');
        totalPrice.textContent = `Total Price: RM ${orderData.totalPrice || 'N/A'}`;
        orderDetails.appendChild(totalPrice);

        const discountAmount = document.createElement('p');
        discountAmount.textContent = `Discount Amount: RM ${orderData.discountAmount || 'N/A'}`;
        orderDetails.appendChild(discountAmount);

        const pointAmount = document.createElement('p');
        pointAmount.textContent = `Point Amount: RM ${orderData.pointAmount || 'N/A'}`;
        orderDetails.appendChild(pointAmount);


        const shippingFees = document.createElement('p');
        shippingFees.textContent = `Shipping Fees: RM ${orderData.shippingFees || 'N/A'}`;
        orderDetails.appendChild(shippingFees);

        const orderTotal = document.createElement('p');
        orderTotal.textContent = `Order Total: RM ${orderData.orderTotal || 'N/A'}`;
        orderDetails.appendChild(orderTotal);

        orderDiv.appendChild(orderDetails);

        // Append status to orderDetails if not already done
        orderDetails.appendChild(status);

        // Complete Button
        if (orderData.status !== 'Complete') {
            const completeButton = document.createElement('button');
            completeButton.classList.add('btn');
            completeButton.textContent = 'Complete';
            completeButton.addEventListener('click', async () => {
                try {
                    const q = query(collection(db, 'orders'), where('orderID', '==', orderData.orderID));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const orderDoc = querySnapshot.docs[0];
                        const orderRef = doc(db, 'orders', orderDoc.id);
                        await updateDoc(orderRef, { status: 'Complete' });
                        status.textContent = 'Status: Complete';
                        completeButton.disabled = true;  // Disable the button after clicking
                    }
                    window.location.reload();
                } catch (error) {
                    console.error('Error updating order status:', error);
                }
            });
            orderDiv.appendChild(completeButton);
        }

        return orderDiv;
    }


    // Function to fetch and display order history
    async function fetchAndDisplayOrderHistory(email) {
        try {
            console.log(`Fetching order history for user email: ${email}`);

            // Query the orders collection for orders associated with the user email
            const q = query(collection(db, 'orders'), where('userDetails.email', '==', email));
            const querySnapshot = await getDocs(q);

            let orders = [];
            querySnapshot.forEach(doc => {
                orders.push({ ...doc.data(), id: doc.id });
            });

            // Sort orders first by status (Incomplete first) and then by orderDate in descending order
            orders.sort((a, b) => {
                if (a.status === 'Incomplete' && b.status !== 'Incomplete') {
                    return -1;
                }
                if (a.status !== 'Incomplete' && b.status === 'Incomplete') {
                    return 1;
                }
                return new Date(b.orderDate) - new Date(a.orderDate);
            });

            const ordersContainer = document.getElementById('orders-container');
            ordersContainer.innerHTML = '';

            if (orders.length > 0) {
                orders.forEach(orderData => {
                    const orderDiv = createOrderDiv(orderData);
                    ordersContainer.appendChild(orderDiv);
                });
            } else {
                ordersContainer.innerHTML = '<p class="pt-3" style="padding-left: 39rem;">No orders found.</p>';
            }
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    }

    // Ensure the user is authenticated before fetching details
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = getCurrentUserId();
            // User is signed in, update cart item count
            updateCartItemCount(userId);
            const userEmail = user.email;
            if (userEmail) {
                fetchAndDisplayOrderHistory(userEmail); // Fetch order history based on user email
            } else {
                console.log('No user email found.');
            }
        } else {
            console.log('No user is authenticated. Redirecting to login page.');
            window.location.href = "/html/login.html";
        }
    });

    const cart = document.getElementById('cart');
    if (cart) {
        // Add event listener to the cart button
        cart.addEventListener('click', handleCartClick);
    }

    function handleCartClick() {
        if (auth.currentUser) {
            // User is signed in, redirect to cart page
            window.location.href = "../html/cart.html";
        } else {
            // User is not logged in, display alert message
            window.alert('Please Login to view your cart.');
            // Optionally, redirect to the login page
            window.location.href = "../html/login.html";
        }
    }

    // Function to update the cart item count in the UI
    async function updateCartItemCount(userId) {
        try {
            if (userId) {
                const userCartDocRef = doc(collection(db, 'carts'), userId);
                const userCartDocSnap = await getDoc(userCartDocRef);

                if (userCartDocSnap.exists()) {
                    const cartItems = userCartDocSnap.data().cart || [];
                    const cartItemCount = document.getElementById('cartItemCount');
                    let totalCount = 0;
                    cartItems.forEach(item => {
                        totalCount += item.quantity;
                    });
                    cartItemCount.textContent = totalCount;
                }
            }
        } catch (error) {
            console.error("Error updating cart item count:", error);
        }
    }
});
