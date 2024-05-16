import { getFirestore, collection, getDocs, doc, query, limit } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

const categorySelect = document.getElementById('selection');

categorySelect.addEventListener('change', function () {
    const selectedCategory = categorySelect.value; // Get the selected value directly from the dropdown
    fetchDataAndDisplay(selectedCategory);
});

async function fetchDataAndDisplay(selectedCategory) {
    try {
        // Reference to the specific document with ID "cat" in the "product" collection
        const catDocRef = doc(collection(db, 'products'), 'cat');
        const dogDocRef = doc(collection(db, 'products'), 'dog');

        // Reference to the "dry food" and "wet food" subcollections under the document
        const dryFoodCollectionRefCat = collection(catDocRef, 'dry food');
        const wetFoodCollectionRefCat = collection(catDocRef, 'wet food');
        const dryFoodCollectionRefDog = collection(dogDocRef, 'dry food');
        const wetFoodCollectionRefDog = collection(dogDocRef, 'wet food');

        const limitCount = 2;

        // Get a reference to the container where data will be displayed
        const products = document.getElementById('product');
        products.innerHTML = ''; // Clear existing content

        let categoryTitle;

        if (selectedCategory === "cat") {
            categoryTitle = "Cat";
            await fetchAndRenderCategory(dryFoodCollectionRefCat, 'Dry Food', categoryTitle, limitCount);
            await fetchAndRenderCategory(wetFoodCollectionRefCat, 'Wet Food', categoryTitle, limitCount);
        } else if (selectedCategory === "dog") {
            categoryTitle = "Dog";
            await fetchAndRenderCategory(dryFoodCollectionRefDog, 'Dog Dry Food', categoryTitle, limitCount);
            await fetchAndRenderCategory(wetFoodCollectionRefDog, 'Dog Wet Food', categoryTitle, limitCount);
        } else {
            categoryTitle = "Cat";
            await fetchAndRenderCategory(dryFoodCollectionRefCat, 'Dry Food', categoryTitle, limitCount);
            await fetchAndRenderCategory(wetFoodCollectionRefCat, 'Wet Food', categoryTitle, limitCount);
            categoryTitle = "Dog";
            await fetchAndRenderCategory(dryFoodCollectionRefDog, 'Dog Dry Food', categoryTitle, limitCount);
            await fetchAndRenderCategory(wetFoodCollectionRefDog, 'Dog Wet Food', categoryTitle, limitCount);
        }

    } catch (error) {
        console.error("Error fetching and displaying data:", error);
    }
}

async function fetchAndRenderCategory(collectionRef, categoryLabel, categoryTitle, limitCount) {
    try {
        const querySnapshot = await getDocs(query(collectionRef, limit(limitCount)));

        const product = document.getElementById('product');

        if (!product.querySelector(`h2[data-category="${categoryTitle}"]`)) {
            product.innerHTML += `<h2 data-category="${categoryTitle}">${categoryTitle}</h2>`;
        }
        
        if (!product.querySelector(`h3[data-subcategory="${categoryLabel}"]`)) {
            product.innerHTML += `<h3  data-subcategory="${categoryLabel}">${categoryLabel}</h3>`;
        }
        querySnapshot.forEach(doc => {
            // Create HTML string for the current food product
            const foodHTML = `
                <div class="item">
                    <img src="${doc.data().product_image}" alt="${doc.data().product_name}">
                    <h3>${doc.data().product_name}</h3>
                    <p class="product-desc">${doc.data().product_description}</p>
                    <p><a href="">Read More</a></p>
                    <p>Price: RM${doc.data().product_price}</p>
                    <p>Available Stock: ${doc.data().product_stock}</p>
                </div>`;
            // Append the HTML string to the container
            product.innerHTML += foodHTML;
        });
    } catch (error) {
        console.error("Error fetching and rendering category:", error);
    }
}

// Call the function to fetch and display data
fetchDataAndDisplay();