import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const db = getFirestore();
    const auth = getAuth();

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
        status.textContent = `Status: ${orderData.status || 'Incomplete'}`;
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
                itemPrice.textContent = `Price: ${item.price}`;
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

        const shippingFees = document.createElement('p');
        shippingFees.textContent = `Shipping Fees: RM ${orderData.shippingFees || 'N/A'}`;
        orderDetails.appendChild(shippingFees);

        const orderTotal = document.createElement('p');
        orderTotal.textContent = `Order Total: RM ${orderData.orderTotal || 'N/A'}`;
        orderDetails.appendChild(orderTotal);

        orderDiv.appendChild(orderDetails);

        // Payment Details
        const paymentDetails = document.createElement('div');
        paymentDetails.classList.add('payment-details');

        const paymentMethod = document.createElement('p');
        paymentMethod.textContent = `Payment Method: ${orderData.paymentMethod || 'N/A'}`;
        paymentDetails.appendChild(paymentMethod);

        const paymentReferenceId = document.createElement('p');
        paymentReferenceId.textContent = `Reference ID: ${orderData.paymentReferenceId || 'N/A'}`;
        paymentDetails.appendChild(paymentReferenceId);

        if (orderData.receipt) {
            const receiptImage = document.createElement('img');
            receiptImage.src = `/image/${orderData.receipt}`;
            receiptImage.alt = 'Receipt Image';
            receiptImage.classList.add('orders-receipt-image');
            paymentDetails.appendChild(receiptImage);
        }

        orderDiv.appendChild(paymentDetails);

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
                orders.push(doc.data());
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
                console.log('No orders found for this user.');
            }
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    }

    // Ensure the user is authenticated before fetching details
    onAuthStateChanged(auth, (user) => {
        if (user) {
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
});
