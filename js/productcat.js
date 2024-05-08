// Import necessary Firebase modules
import { getFirestore, doc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

// Function to fetch data and display in the webpage based on food type
async function fetchDataAndDisplay() {
    try {
        // Get the selected food type from the dropdown
        const foodType = document.getElementById('food-type').value;

        // Reference to the specific document with ID "cat" in the "products" collection
        const catDocRef = doc(db, 'products', 'cat');
        
        // Reference to the subcollection under the "cat" document based on the food type
        const subcollectionRef = collection(catDocRef, foodType);

        // Get all documents in the subcollection
        const querySnapshot = await getDocs(subcollectionRef);

        // Clear existing content in the product container
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = '';

        // Process the retrieved documents
        querySnapshot.forEach(foodDoc => {
            // Access the data in each food document
            const foodData = foodDoc.data();

            // Create product elements and append them to the product container
            const productDiv = createProductDiv(foodData, foodType);
            productContainer.appendChild(productDiv);
        });

    } catch (error) {
        console.error('Error fetching documents: ', error);
    }
}

// Function to create product div
function createProductDiv(foodData, foodType) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    // Image
    if (foodData.product_image) {
        const productImage = document.createElement('img');
        productImage.src = `/image/products/cat/${foodType}/${foodData.product_image}`;
        productImage.alt = 'Product Image';
        productImage.style.width = '300px';
        productImage.style.height = '300px';
        productDiv.appendChild(productImage);
    }

    // Name
    const productName = document.createElement('h4');
    productName.textContent = foodData.product_name;
    productDiv.appendChild(productName);

    // Price
    const productPrice = document.createElement('h5');
    productPrice.textContent = `RM ${foodData.product_price}`;
    productDiv.appendChild(productPrice);

    // Quantity Controls
    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('quantity-container');

    const decrementButton = createButton('-', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    quantityContainer.appendChild(decrementButton);

    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.min = 1;
    quantityInput.value = 1;
    quantityInput.classList.add('quantity-input');
    quantityContainer.appendChild(quantityInput);

    const incrementButton = createButton('+', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    quantityContainer.appendChild(incrementButton);

    productDiv.appendChild(quantityContainer);

    // Add to Cart Button
    const addToCartButton = createButton('Add to Cart', () => {
        // Implement add to cart functionality here
        const quantity = parseInt(quantityInput.value);
        addToCart(foodDoc.id, foodData.product_name, quantity);
    });
    addToCartButton.classList.add('add-to-cart-btn');
    productDiv.appendChild(addToCartButton);

    return productDiv;
}

// Helper function to create a button with a given text and event handler
function createButton(text, onClickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClickHandler);
    button.classList.add('btn', 'btn-primary'); // Add some Bootstrap classes for styling
    return button;
}

// Event listener for dropdown list change
document.getElementById('food-type').addEventListener('change', fetchDataAndDisplay);

// Initial fetch and display based on the default food type when the page loads
document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndDisplay(); // Fetch and display data without waiting for a dropdown change
});
