// Import necessary Firebase modules
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

// Function to fetch data and display in the webpage based on food type
async function fetchDataAndDisplay(foodType) {
    try {
        // Reference to the "products" collection
        const productsCollection = collection(db, 'products');

        // Get all documents in the collection
        const querySnapshot = await getDocs(productsCollection);

        // Filter the documents to find the "cat" document
        const catDoc = querySnapshot.docs.find(doc => doc.id === 'cat');

        if (catDoc) {
            // Reference to the "cat" document
            const catData = catDoc.data();

            // Get a reference to the container where products will be displayed
            const productContainer = document.getElementById('product-container');
            productContainer.innerHTML = ''; // Clear existing content

            // Iterate through subcollections of the "cat" document
            catDoc.collections.forEach(async subcollection => {
                // Get all documents in the subcollection
                const foodQuerySnapshot = await getDocs(subcollection);

                // Iterate through each document in the subcollection
                foodQuerySnapshot.forEach(foodDoc => {
                    // Access the data in each food document
                    const foodData = foodDoc.data();

                    // Check if the document matches the selected food type or show all products
                    if ((foodType === 'dry' && foodData.dry_food) || (foodType === 'wet' && foodData.wet_food) || (foodType === 'all')) {
                        // Create a div to display each product's details
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

                        const decrementButton = document.createElement('button');
                        decrementButton.textContent = '-';
                        decrementButton.classList.add('decrement-btn');
                        decrementButton.addEventListener('click', () => {
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

                        const incrementButton = document.createElement('button');
                        incrementButton.textContent = '+';
                        incrementButton.classList.add('increment-btn');
                        incrementButton.addEventListener('click', () => {
                            quantityInput.value = parseInt(quantityInput.value) + 1;
                        });
                        quantityContainer.appendChild(incrementButton);

                        productDiv.appendChild(quantityContainer);

                        // Add to Cart Button
                        const addToCartButton = document.createElement('button');
                        addToCartButton.textContent = 'Add to Cart';
                        addToCartButton.classList.add('add-to-cart-btn');
                        addToCartButton.addEventListener('click', () => {
                            // Implement add to cart functionality here
                            const quantity = parseInt(quantityInput.value);
                            addToCart(foodDoc.id, foodData.product_name, quantity);
                        });
                        productDiv.appendChild(addToCartButton);

                        // Append the product div to the container
                        productContainer.appendChild(productDiv);
                    }
                });
            });
        } else {
            console.log("No 'cat' document found in the 'products' collection.");
        }

    } catch (error) {
        console.error('Error fetching documents: ', error);
    }
}

// Event listener for dropdown list change
document.getElementById('food-type').addEventListener('change', function () {
    const selectedFoodType = this.value;
    fetchDataAndDisplay(selectedFoodType);
});

// Initial fetch and display based on default food type (all)
const defaultFoodType = 'all';
fetchDataAndDisplay(defaultFoodType);
