// Import necessary Firebase modules
import { getFirestore, doc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

// Helper function to create a button with a given text and event handler
function createButton(text, onClickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClickHandler);
    button.classList.add('btn', 'btn-primary');
    return button;
}

// Function to fetch data and display it in the webpage based on food type
async function fetchDataAndDisplay() {
    try {
        const foodType = document.getElementById('food-type').value;
        const hamsterNrabbitsDocRef = doc(db, 'products', 'hamster&rabbits');
        const subcollectionRef = collection(hamsterNrabbitsDocRef, foodType);
        const querySnapshot = await getDocs(subcollectionRef);

        let documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        documents.sort((a, b) => naturalSort(a.product_id, b.product_id));

        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = '';

        documents.forEach(foodData => {
            const productDiv = createProductDiv(foodData, foodType);
            productContainer.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error fetching documents: ', error);
    }
}

function naturalSort(a, b) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

// Function to create product div
function createProductDiv(foodData, foodType) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    // Image
    if (foodData.product_image) {
        const productImage = document.createElement('img');
        productImage.src = `/image/products/hamster&rabbits/${foodType}/${foodData.product_image}`;
        productImage.alt = 'Product Image';
        productImage.classList.add('product-image','clickable');
        productImage.addEventListener('click', () => showModal(foodData, foodType));
        productDiv.appendChild(productImage);
    }

    // Name
    const productName = document.createElement('h5');
    productName.textContent = foodData.product_name;
    productName.style.height = '60px';
    productName.classList.add('clickable');
    productName.addEventListener('click', () => showModal(foodData, foodType));
    productDiv.appendChild(productName);

    const priceNquantity = document.createElement('div');
    priceNquantity.classList.add('price-quantity');

    // Price
    const productPrice = document.createElement('h5');
    productPrice.textContent = `RM ${foodData.product_price}`;
    priceNquantity.appendChild(productPrice); // Append price to the priceNquantity div

    // Quantity Controls
    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('quantity-container', 'mb-3');

    // - Button
    const decrementButton = createButton('-', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    decrementButton.classList.add('btn', 'btn-sm', 'btn-secondary');
    quantityContainer.appendChild(decrementButton);

    // Quantity Input
    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.min = 1;
    quantityInput.value = 1;
    quantityInput.classList.add('quantity-input');
    quantityContainer.appendChild(quantityInput);

    // + Button
    const incrementButton = createButton('+', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    incrementButton.classList.add('btn', 'btn-sm', 'btn-secondary');
    quantityContainer.appendChild(incrementButton);

    priceNquantity.appendChild(quantityContainer);
    productDiv.appendChild(priceNquantity);

    // Add to Cart Button
    const addToCartButton = createButton('ADD TO CART', () => {
        const quantity = parseInt(quantityInput.value);
        addToCart(foodData.id, foodData.product_name, quantity);
    });
    addToCartButton.classList.add('btn', 'btn-primary', 'add-cart');
    addToCartButton.style.width = '-webkit-fill-available';
    addToCartButton.style.marginTop = '8px';
    productDiv.appendChild(addToCartButton);

    return productDiv;
}

// Function to show product details in a modal
function showModal(foodData, foodType) {
    const modalBody = document.getElementById('modal-body-content');
    modalBody.innerHTML = '';

    // Image
    if (foodData.product_image) {
        const productImage = document.createElement('img');
        productImage.src = `/image/products/hamster&rabbits/${foodType}/${foodData.product_image}`;
        productImage.alt = 'Product Image';
        productImage.classList.add('product-image');
        modalBody.appendChild(productImage);
    }

    // Name
    const productName = document.createElement('h4');
    productName.textContent = foodData.product_name;
    modalBody.appendChild(productName);

    // Description
    const productDescription = document.createElement('p');
    productDescription.textContent = foodData.product_description;
    modalBody.appendChild(productDescription);

    // Price
    const productPrice = document.createElement('h5');
    productPrice.textContent = `RM ${foodData.product_price}`;
    modalBody.appendChild(productPrice);

    // Quantity Controls
    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('quantity-container', 'd-flex', 'justify-content-center', 'align-items-center', 'mb-3');

    // - Button
    const decrementButton = createButton('-', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    decrementButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'mr-2');
    quantityContainer.appendChild(decrementButton);

    // Quantity Input
    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.min = 1;
    quantityInput.value = 1;
    quantityInput.classList.add('quantity-input');
    quantityContainer.appendChild(quantityInput);

    // + Button
    const incrementButton = createButton('+', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    incrementButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'ml-2');
    quantityContainer.appendChild(incrementButton);

    modalBody.appendChild(quantityContainer);

    $('#productModal').modal('show');

    document.getElementById('modal-add-to-cart').onclick = () => {
        $('#productModal').modal('hide');
    };
}

// Event listener for dropdown list change
document.getElementById('food-type').addEventListener('change', fetchDataAndDisplay);

// Initial fetch and display based on the default food type when the page loads
document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndDisplay();
});
