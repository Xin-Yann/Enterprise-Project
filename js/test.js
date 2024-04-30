import { getFirestore, collection, getDocs, doc, query, limit } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();


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
                <img src="${doc.data().product_image}" alt="${doc.data().product_name}">
                <h2>${doc.data().product_name}</h2>
                <p class="product-desc">${doc.data().product_description}</p>
                <p><a href="">Read More</a></p>
                <p>Price: RM${doc.data().product_price}</p>
                <p>Available Stock: ${doc.data().product_stock}</p>
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

    } catch (error) {
        console.error("Error fetching and displaying data:", error);
    }

}

// Call the function to fetch and display data
fetchDataAndDisplay();
