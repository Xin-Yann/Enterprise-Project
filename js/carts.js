import { getFirestore, collection, getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// Initialize Firestore
const db = getFirestore();
const auth = getAuth(); // Initialize Firebase Authentication

// Function to get the current user ID
function getCurrentUserId() {
    const user = auth.currentUser;
    return user ? user.uid : null;
}

// Listen for authentication state changes
auth.onAuthStateChanged(async (user) => {
    try {
        if (user) {
            const userId = getCurrentUserId(); // Get the current user ID
            if (!userId) {
                console.error("Invalid userId:", userId);
                return;
            }
            // User is signed in, update cart item count and display cart items
            updateCartItemCount(userId);
            await displayCartItems(userId); // Pass the user's ID to fetch their cart data
            await getCartData(userId);
            console.log("User authenticated. User ID:", userId);
        } else {
        }
    } catch (error) {
        console.error("Error in authentication state change:", error);
    }
});


// Function to fetch cart data for a user
async function getCartData(user) {
    try {
        if (user) {
            const userId = getCurrentUserId();
            // Validate userId
            if (!userId) {
                console.error("Invalid userId:", userId);
                return [];
            }

            const cartRef = doc(collection(db, 'carts'), userId); // Reference the user's cart document
            const cartDoc = await getDoc(cartRef);
            if (cartDoc.exists()) {
                return cartDoc.data().cart || []; // Return the cart data if the document exists
            } else {
                console.log("Cart document does not exist for the current user.");

            } return [];
        }
    } catch (error) {
        console.error("Error fetching cart data from Firestore:", error);
        return [];
    }
}

let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const cartTable = document.createElement('table');
cartTable.classList.add('table');
cartTable.innerHTML = `
    <thead>
        <tr>
            <th>No</th>
            <th>Image</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price (RM)</th>
            <th>Type</th>
            <th>Total Price</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody></tbody>
`;
const cartTableBody = cartTable.querySelector('tbody');
const cartContainer = document.getElementById('cartItems');

async function displayCartItems() {
    const userId = getCurrentUserId();
    let cartItems = await getCartData(userId); // Changed from const to let
    if (!cartItems) {
        cartItems = []; // Initialize cartItems to an empty array if it's null
    }

    cartTableBody.innerHTML = '';

    // Check if the cart is empty
    if (cartItems == 0) {
         // Hide total section
         const noSection = document.getElementById('none');
         noSection.style.display = 'block';

         const headSection = document.getElementById('cartItems');
         headSection.style.display = 'none';

        // Hide total section
        const totalSection = document.getElementById('total');
        totalSection.style.display = 'none';
    }else{
        const noSection = document.getElementById('none');
         noSection.style.display = 'none';

        const totalSection = document.getElementById('total');
        totalSection.style.display = 'block';

        const headSection = document.getElementById('cartItems');
        headSection.style.display = 'block';
    }


    let totalPrice = 0; // Declare totalPrice variable outside the loop

    cartItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${index + 1}</td>
        <td><img src="${item.image}" alt="Product Image" style="width: 100px;"></td>
        <td>${item.name}</td>
        <td>
            <button class="btn btn-sm btn-secondary decrease" data-product-name="${item.name}">-</button>
            <input type="text" min="1" value="${item.quantity}" class="quantity">
            <button class="btn btn-sm btn-secondary increase" data-product-name="${item.name}">+</button>
        </td>
        <td>${item.price}</td> 
        <td>${item.type}</td>
        <td class="total-price-cell"></td>
        <td><button class="btn btn-danger delete" data-product-name="${item.name}">Delete</button></td>
    `;
        cartTableBody.appendChild(row);

        calculateTotalPrice(item).then(itemTotalPrice => {
            // Update total price for the current row
            const totalPriceCell = row.querySelector('.total-price-cell');
            totalPriceCell.textContent = `RM ${itemTotalPrice.toFixed(2)}`;

            // Accumulate totalPrice
            totalPrice += itemTotalPrice;

            // Update the subtotal after all items' total prices are calculated
            updateSubtotal(totalPrice);
        });
    });


    cartContainer.innerHTML = '';
    cartContainer.appendChild(cartTable);

    const quantityInputs = document.querySelectorAll('.quantity');
    quantityInputs.forEach(input => {
        input.addEventListener('change', updateCartItemQuantity);
    });

    const increaseButtons = document.querySelectorAll('.increase');
    increaseButtons.forEach(button => {
        button.addEventListener('click', incrementQuantity);
    });

    const decreaseButtons = document.querySelectorAll('.decrease');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', decrementQuantity);
    });

    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', deleteCartItem);
    });

}

function incrementQuantity() {
    const productName = this.getAttribute('data-product-name');
    const input = this.parentElement.querySelector('.quantity');
    const newQuantity = parseInt(input.value) + 1;
    input.value = newQuantity; // Update the input value in the UI

    cartItems.forEach(item => {
        if (item.name === productName) {
            item.quantity = newQuantity;
        }
    });
    updateCartItemCount();
    updateQuantityAndPrice(productName, newQuantity);
}

function decrementQuantity() {
    const productName = this.getAttribute('data-product-name');
    const input = this.parentElement.querySelector('.quantity');
    let newQuantity = parseInt(input.value) - 1;
    if (newQuantity < 1) {
        newQuantity = 1;
    }
    input.value = newQuantity; // Update the input value in the UI

    cartItems.forEach(item => {
        if (item.name === productName) {
            item.quantity = newQuantity;
        }
    });
    updateCartItemCount();
    updateQuantityAndPrice(productName, newQuantity);
}

// Function to update the cart item count in the UI
async function updateCartItemCount(userId) {
    try {
        if (userId) {
            const userCartDocRef = doc(collection(db, 'carts'), userId); // Reference to the user's cart document
            const userCartDocSnap = await getDoc(userCartDocRef); // Get the user's cart document snapshot

            if (userCartDocSnap.exists()) {
                const cartItems = userCartDocSnap.data().cart || []; // Retrieve cart items from Firestore
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

updateCartItemCount();


function updateCartItemQuantity() {
    const productName = this.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    const newQuantity = parseInt(this.value);
    cartItems.forEach(item => {
        if (item.name === productName) {
            item.quantity = newQuantity;
        }
    });
}


async function updateQuantityAndPrice(productName, newQuantity) {
    const userId = getCurrentUserId(); // Get the current user's UID
    try {
        const cartRef = collection(db, 'carts');
        const userCartDocRef = doc(cartRef, userId); // Specify the document ID as the user's UID

        // Get the cart document snapshot
        const cartSnapshot = await getDoc(userCartDocRef);

        // Ensure the cart document exists before attempting to update item
        if (cartSnapshot.exists()) {
            const cartData = cartSnapshot.data(); // Get the cart data
            const updatedCart = cartData.cart.map(item => {
                if (item.name === productName) {
                    // Update quantity
                    item.quantity = newQuantity;
                    // Calculate and update total price asynchronously
                    return calculateTotalPrice(item).then(totalPrice => {
                        item.totalPrice = `RM ${totalPrice.toFixed(2)}`
                        return item;
                    }).catch(error => {
                        console.error("Error calculating total price:", error);
                        return item; // Return the item with unchanged data
                    });
                }
                return item;
            });

            // Resolve all promises in the updatedCart array
            const resolvedCart = await Promise.all(updatedCart);

            // Update the cart in Firestore with the resolved updated cart data
            await setDoc(userCartDocRef, { cart: resolvedCart });

            console.log(`${productName} quantity and price updated in Firestore successfully!`);

            // Update the UI to reflect the changes
            displayCartItems();
        } else {
            console.log(`User's cart document does not exist.`);
        }
    } catch (error) {
        console.error("Error updating item quantity and price in Firestore:", error);
    }
}

async function deleteCartItem() {
    const productName = this.getAttribute('data-product-name');
    cartItems = cartItems.filter(item => item.name !== productName);
    //await updateLocalStorageAndDisplay(); // Update local storage and display
    await deleteItemFromFirestore(productName); // Delete the item from Firestore
    alert(`${productName} has been deleted successfully!`);
    updateCartItemCount();
}

async function deleteItemFromFirestore(productName) {
    const userId = getCurrentUserId(); // Get the current user's UID
    try {
        const cartRef = collection(db, 'carts');
        const userCartDocRef = doc(cartRef, userId); // Specify the document ID as the user's UID

        // Get the cart document snapshot
        const cartSnapshot = await getDoc(userCartDocRef);

        // Ensure the cart document exists before attempting to delete an item
        if (cartSnapshot.exists()) {
            const cartData = cartSnapshot.data(); // Get the cart data
            const updatedCart = cartData.cart.filter(item => item.name !== productName); // Remove the item from the cart

            // Update the cart in Firestore with the updated cart data
            await setDoc(userCartDocRef, { cart: updatedCart });

            console.log(`${productName} removed from Firestore successfully!`);

            // Update the UI to reflect the changes
            displayCartItems();
        } else {
            console.log(`User's cart document does not exist.`);
        }
    } catch (error) {
        console.error("Error deleting item from Firestore:", error);
    }
}


async function calculateTotalPrice(item) {
    const price = item.price ? parseFloat(item.price) : 0;
    const quantity = parseInt(item.quantity);
    if (!isNaN(price) && !isNaN(quantity)) {
        return (price * quantity); // Return the total price as a number
    } else {
        console.error(`Invalid price or quantity for product: ${item.name}`);
        return 0;
    }
}

async function updateSubtotal(totalPrice) {
    const formattedTotalPrice = totalPrice.toFixed(2); // Format totalPrice to have exactly two decimal places
    const TotalPriceDisplay = document.getElementById('Subtotal');
    TotalPriceDisplay.textContent = `Subtotal: RM ${formattedTotalPrice}`;
}


displayCartItems();