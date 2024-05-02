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
            <th>Action</th>
        </tr>
    </thead>
    <tbody></tbody>
`;
const cartTableBody = cartTable.querySelector('tbody');
const cartContainer = document.getElementById('cartItems');


function updateCartItemCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemCount = document.getElementById('cartItemCount');
    let totalCount = 0;
    cartItems.forEach(item => {
        totalCount += item.quantity;
    });
    cartItemCount.textContent = totalCount;
}
updateCartItemCount();

function displayCartItems() {
    cartTableBody.innerHTML = '';

    // Check if the cart is empty
    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-message text-center pb-5">
                <img src="/image/cart.png" alt="Empty Cart" style="width: 300px;">
                <h2 class="pb-3">Your cart is empty.</h2>
                <button class="btn btn-primary continue-shopping-btn"><a href="/html/product.html">Continue Shopping</a></button>
            </div>
        `;

        const subtotalSection = document.getElementById('Subtotal');
        const totalSection = document.querySelector('.pt-3.pb-4');
        subtotalSection.style.display = 'none';
        totalSection.style.display = 'none';

        const continueShoppingButton = document.getElementById('shopping');
        const checkoutButton = document.getElementById('checkout');
        continueShoppingButton.style.display = 'none';
        checkoutButton.style.display = 'none';
        return;
    }

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
            <td><button class="btn btn-danger delete" data-product-name="${item.name}">Delete</button></td>
        `;
        cartTableBody.appendChild(row);
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

    updateSubtotal();
}


function updateLocalStorageAndDisplay() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCartItems();
}

function updateCartItemQuantity() {
    const productName = this.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    const newQuantity = parseInt(this.value);
    cartItems.forEach(item => {
        if (item.name === productName) {
            item.quantity = newQuantity;
        }
    });
    updateLocalStorageAndDisplay();
}

function incrementQuantity() {
    const productName = this.getAttribute('data-product-name');
    const input = this.parentElement.querySelector('.quantity');
    const newQuantity = parseInt(input.value) + 1;
    cartItems.forEach(item => {
        if (item.name === productName) {
            item.quantity = newQuantity;
        }
    });
    updateLocalStorageAndDisplay();
    updateCartItemCount();
}

function decrementQuantity() {
    const productName = this.getAttribute('data-product-name');
    const input = this.parentElement.querySelector('.quantity');
    let newQuantity = parseInt(input.value) - 1;
    if (newQuantity < 1) {
        newQuantity = 1;
    }
    cartItems.forEach(product => {
        if (product.name === productName) {
            product.quantity = newQuantity;
        }
    });
    updateLocalStorageAndDisplay();
    updateCartItemCount();
}

function deleteCartItem() {
    const productName = this.getAttribute('data-product-name');
    cartItems = cartItems.filter(item => item.name !== productName);
    updateLocalStorageAndDisplay();
    alert(`${productName} has been deleted successfully!`);
    updateCartItemCount();
}

function calculateSubtotal() {
    return cartItems.reduce((total, product) => {
        const price = parseFloat(product.price.replace('RM', ''));
        const quantity = parseInt(product.quantity);
        if (!isNaN(price) && !isNaN(quantity)) {
            return total + (price * quantity);
        } else {
            console.error(`Invalid price or quantity for product: ${product.name}`);
            return total;
        }

    }, 0);
}

function updateSubtotal() {
    const SubtotalDisplay = document.getElementById('Subtotal');
    SubtotalDisplay.textContent = `Subtotal: RM ${calculateSubtotal().toFixed(2)}`;
}

displayCartItems();
