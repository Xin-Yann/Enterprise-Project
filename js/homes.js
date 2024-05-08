import { getFirestore, collection, getDocs, doc, query, limit } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

function addToCart(productId, productImages, productName, productPrice, productType) {
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
                image: productImages,
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
        const birdDocRef = doc(collection(db, 'products'), 'birds');


        // Reference to the "dry food" subcollection under the "cat" document
        //CAT
        const catDryFoodCollectionRef = collection(catDocRef, 'dry food');
        const catWetFoodCollectionRef = collection(catDocRef, 'wet food');
        const catToyFoodCollectionRef = collection(catDocRef, 'toys');
        const catTreatFoodCollectionRef = collection(catDocRef, 'essentials');
        const catEssentialFoodCollectionRef = collection(catDocRef, 'treats');
        //DOG
        const dogDryFoodCollectionRef = collection(dogDocRef, 'dry food');
        const dogWetFoodCollectionRef = collection(dogDocRef, 'wet food');
        const dogToyFoodCollectionRef = collection(dogDocRef, 'toys');
        const dogTreatFoodCollectionRef = collection(dogDocRef, 'treats');
        const dogEssentialFoodCollectionRef = collection(dogDocRef, 'essentials');
        //Bird
        const birdDryFoodCollectionRef = collection(birdDocRef, 'dry food');
        const birdToyFoodCollectionRef = collection(birdDocRef, 'toys');
        const birdTreatFoodCollectionRef = collection(birdDocRef, 'treats');
        const birdEssentialFoodCollectionRef = collection(birdDocRef, 'essentials');
        

        const limitCount = 2;

        // Get the limited number of documents in the "dry food" subcollection
        //cat
        const catDryQuerySnapshot = await getDocs(query(catDryFoodCollectionRef, limit(limitCount)));
        const catWetQuerySnapshot = await getDocs(query(catWetFoodCollectionRef, limit(limitCount)));
        const catToyQuerySnapshot = await getDocs(query(catToyFoodCollectionRef, limit(limitCount)));
        const catTreatQuerySnapshot = await getDocs(query(catTreatFoodCollectionRef, limit(limitCount)));
        const catEssentialQuerySnapshot = await getDocs(query(catEssentialFoodCollectionRef, limit(limitCount)));
        // Get the limited number of documents in the "dog" subcollection
        //dog
        const dogDryQuerySnapshot = await getDocs(query(dogDryFoodCollectionRef, limit(limitCount)));
        const dogWetQuerySnapshot = await getDocs(query(dogWetFoodCollectionRef, limit(limitCount)));
        const dogToyQuerySnapshot = await getDocs(query(dogToyFoodCollectionRef, limit(limitCount)));
        const dogTreatQuerySnapshot = await getDocs(query(dogTreatFoodCollectionRef, limit(limitCount)));
        const dogEssentialQuerySnapshot = await getDocs(query(dogEssentialFoodCollectionRef, limit(limitCount)));
        //bird
        const birdDryQuerySnapshot = await getDocs(query(birdDryFoodCollectionRef, limit(limitCount)));
        //const birdToyQuerySnapshot = await getDocs(query(birdToyFoodCollectionRef, limit(limitCount)));
        //const birdTreatQuerySnapshot = await getDocs(query(birdTreatFoodCollectionRef, limit(limitCount)));
        const birdEssentialQuerySnapshot = await getDocs(query(birdEssentialFoodCollectionRef, limit(limitCount)));

        const combinedQuerySnapshot = catDryQuerySnapshot.docs
            .concat(catWetQuerySnapshot.docs)
            .concat(catToyQuerySnapshot.docs)
            .concat(catTreatQuerySnapshot.docs)
            .concat(catEssentialQuerySnapshot.docs)
            //dog
            .concat(dogDryQuerySnapshot.docs)
            .concat(dogWetQuerySnapshot.docs)
            .concat(dogToyQuerySnapshot.docs)
            .concat(dogTreatQuerySnapshot.docs)
            .concat(dogEssentialQuerySnapshot.docs)
            //bird
            .concat(birdDryQuerySnapshot.docs)
            //.concat(birdToyQuerySnapshot.docs)
            //.concat(birdTreatQuerySnapshot.docs) 
            .concat(birdEssentialQuerySnapshot.docs);

        // Get a reference to the container where data will be displayed
        const owlCarousel = document.getElementById('owl-demo');
        owlCarousel.innerHTML = ''; // Clear existing content

        combinedQuerySnapshot.forEach(doc => {
            const foodType = doc.ref.parent.parent.id; // Retrieves the parent collection name (either 'cat' or 'dog')
            const productType = doc.ref.parent.id; // Retrieves the subcollection name (either 'dry food' or 'wet food')

            // Determine the image URL based on product type, food type, and product image
            const imageUrl = `/image/products/${foodType}/${productType}/${doc.data().product_image}`;

            // Create HTML string for the current product
            const productHTML = `
                <div class="card">
                    <span class="product-id" style="display: none;">${doc.data().product_id}</span>
                    <img class="card-img-top" src="${imageUrl}" alt="${doc.data().product_name}">
                    <div class="card-body">
                        <h5 class="card-title">${doc.data().product_name}</h5>
                        <p class="card-desc">${doc.data().product_description}</p>
                        <p><a href="">Read More</a></p>
                        <p class="card-text"><small class="text-muted">Available Stock: ${doc.data().product_stock}</small></p>
                        <p class="product-price pt-3">Price: RM${doc.data().product_price}</p>
                        <a href="" class="btn btn-primary add-cart">Add To Cart</a>
                    </div>
                </div>
            `;

            // Append the HTML string to the container
            owlCarousel.innerHTML += productHTML;
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
                const item = this.closest('.card');

                // Retrieve product information from the DOM
                const productId = item.querySelector('.product-id').textContent;
                const productImageElement = item.querySelector('.card-img-top');
                const productImages = productImageElement ? productImageElement.src : '/image/dog1.jpg';
                console.log("Product Image:", productImages);

                const productName = item.querySelector('h5').textContent;
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
                addToCart(productId, productImages, productName, productPrice, productType);
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