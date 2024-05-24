// Import necessary Firebase modules
import { getFirestore, collection, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

// Add event listener to interact with Firebase services when the "add" button is clicked
document.getElementById("add").addEventListener("click", async () => {
    try {
        const category = document.getElementById('product_category').value;
        const subcategory = document.getElementById('product_type').value;
        const productId = document.getElementById('product_id').value;

        // Validate product details
        const productName = document.getElementById('product_name').value;
        const productDescription = document.getElementById('product_description').value;
        const productPrice = document.getElementById('product_price').value;
        const productStock = document.getElementById('product_stock').value;
        const productWeight = document.getElementById('product_weight').value;

        if (!productName || !productDescription || !productPrice || !productStock || !productWeight) {
            alert('Please fill out all product details.');
            return;
        }

        // Check if the product ID already exists
        const productRef = doc(collection(db, 'products', category, subcategory), productId);
        const productSnapshot = await getDoc(productRef);

        if (productSnapshot.exists()) {
            alert('Product ID already exists. Please choose a different ID.');
            return;
        }

        // Get the full path of the image
        const imagePath = document.getElementById('product_image').value;
        // Extract only the file name
        const imageName = imagePath.split('\\').pop().split('/').pop();

        await setDoc(productRef, {
            product_id: productId,
            product_image: imageName,
            product_name: productName,
            product_description: productDescription,
            product_price: productPrice,
            product_stock: productStock,
            product_weight: productWeight,
        });

        alert('Product added successfully!');
        window.location.reload();

        console.log('Document written with ID: ', productId);
    } catch (e) {
        console.error('Error adding document: ', e);
    }
});

// Add an event listener to the product category select element
document.getElementById("product_category").addEventListener("change", function () {
    updateOptions();
});

function updateOptions() {
    var categorySelect = document.getElementById("product_category");
    var typeSelect = document.getElementById("product_type");
    var selectedCategory = categorySelect.value;

    // Clear existing type options
    typeSelect.innerHTML = '<option disabled selected>Select type</option>';

    // Add type options based on the selected category
    switch (selectedCategory) {
        case "dog":
            addOption("dry food");
            addOption("wet food");
            addOption("essentials");
            addOption("toys");
            addOption("treats");
            break;
        case "cat":
            addOption("dry food");
            addOption("wet food");
            addOption("essentials");
            addOption("toys");
            addOption("treats");
            break;
        case "hamster&rabbits":
            addOption("dry food");
            addOption("essentials");
            addOption("toys");
            addOption("treats");
            break;
        case "birds":
            addOption("dry food");
            addOption("essentials");
            addOption("toys");
            addOption("treats");
            break;
        case "fish&aquatics":
            addOption("dry food");
            addOption("essentials");
            addOption("treats");
            break;
    }
}

function addOption(type) {
    var typeSelect = document.getElementById("product_type");
    var option = document.createElement("option");
    option.text = type;
    option.value = type;
    typeSelect.add(option);
}