// Function to update cart item count
function updateCartItemCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemCount = document.getElementById('cartItemCount');
    let totalCount = 0;
    cartItems.forEach(item => {
        totalCount += item.quantity;
    });
    cartItemCount.textContent = totalCount;
}

// Call the function initially to display cart item count
updateCartItemCount();
