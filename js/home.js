import { getFirestore, collection, getDocs, doc, query, limit } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

function addToCart(productId, productImage, productName, productPrice, productType) {
    // Check if localStorage is supported
    if (typeof (Storage) !== "undefined") {
        // Check if cart exists in localStorage, if not, initialize an empty array
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProductIndex = cart.findIndex(item => item.id === productId);

        // If the product exists, update its quantity
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity++;
        } else {
            // Construct the product object
            let product = {
                id: productId,
                image: productImage,
                name: productName,
                price: productPrice,
                type: productType,
                quantity: 1
            };

        // Add the product to the cart
        cart.push(product);
        }

        // Save the updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Optionally, you can display a message to the user
        alert(`${productName} has been added to your cart!`);
    } else {
        // If localStorage is not supported, display an error message
        alert("Item added unsuccessfully. Please try again.");
    }
}

async function fetchDataAndDisplay() {
    try {
        // Reference to the specific document with ID "cat" in the "product" collection
        const catDocRef = doc(collection(db, 'products'), 'cat');
        const dogDocRef = doc(collection(db, 'products'), 'dog');

        // Reference to the "dry food" subcollection under the "cat" document
        const dryFoodCollectionRef = collection(catDocRef, 'dry food');
        const dogFoodCollectionRef = collection(dogDocRef, 'dry food');

        const limitCount = 2;

        // Get the limited number of documents in the "dry food" subcollection
        const catQuerySnapshot = await getDocs(query(dryFoodCollectionRef, limit(limitCount)));
        // Get the limited number of documents in the "dog" subcollection
        const dogQuerySnapshot = await getDocs(query(dogFoodCollectionRef, limit(limitCount)));

        const combinedQuerySnapshot = catQuerySnapshot.docs
            .concat(dogQuerySnapshot.docs);

        // Get a reference to the container where data will be displayed
        const owlCarousel = document.getElementById('owl-demo');
        owlCarousel.innerHTML = ''; // Clear existing content

        // Iterate through each document in the subcollection
        combinedQuerySnapshot.forEach(doc => {
            // Create HTML string for the current dry food product
            const dryFoodHTML = `
            <div class="item">
                <span class="product-id" style="display: none;">${doc.data().product_id}</span>
                <img src="${doc.data().product_image}" alt="${doc.data().product_name}">
                <h2>${doc.data().product_name}</h2>
                <p>${doc.data().product_description}</p>
                <p><a href="">Read More</a></p>
                <p class="product-price">Price: RM${doc.data().product_price}</p>
                <p>Available Stock: ${doc.data().product_stock}</p>
                <a href="" class="btn btn-primary">Add To Cart</a>
            </div>
                
            `;

            // Append the HTML string to the container
            owlCarousel.innerHTML += dryFoodHTML;
        });

        // Initialize the Owl Carousel
        $(owlCarousel).owlCarousel({
            loop: true,
            margin: 10,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    nav: true
                },
                600: {
                    items: 3,
                    nav: false
                },
                1000: {
                    items: 5,
                    nav: true,
                    loop: false
                }
            },
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true
        });

        // Get all the "Add to Cart" buttons
        const addToCartButtons = document.querySelectorAll('.btn.btn-primary');

        /// Add event listener to each button
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault();

                // Get the parent div which holds the product information
                const item = this.closest('.item');

                // Retrieve product information from the DOM
                const productId = item.querySelector('.product-id').textContent;
                const productImageElement = item.querySelector('img');
                const productImage = productImageElement ? productImageElement.src : '/image/dog1.jpg';

                const productName = item.querySelector('h2').textContent;
                const productPriceText = item.querySelector('.product-price').textContent;
                const productPrice = productPriceText.split(':')[1].trim();


                let productType = "";
                if (productId.includes("DF")) {
                    productType = "Dry Food";
                } else if (productId.includes("WF")) {
                    productType = "Wet Food";
                } else {
                    productType = "Unknown";
                }

                // Call the addToCart function with the product information
                addToCart(productId, productImage, productName, productPrice, productType);
                window.location.href = "../html/cart.html";

            });
        });


    } catch (error) {
        console.error("Error fetching and displaying data:", error);
    }

}

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

// Call the function to fetch and display data
fetchDataAndDisplay();
