// Import necessary Firebase modules
import { getFirestore, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

// Add event listener to interact with Firebase services when the "add" button is clicked
document.getElementById("add").addEventListener("click", async () => {
    try {
        const category = document.getElementById('product_category').value;
        const subcategory = document.getElementById('product_type').value;
        const productId = document.getElementById('product_id').value;

        // Get the full path of the image
        const imagePath = document.getElementById('product_image').value;
        // Extract only the file name
        const imageName = imagePath.split('\\').pop().split('/').pop(); 

        await setDoc(doc(collection(db, 'products', category, subcategory), productId), {
            product_id: productId,
            product_image: imageName,
            product_name: document.getElementById('product_name').value,
            product_description: document.getElementById('product_description').value,
            product_price: document.getElementById('product_price').value,
            product_stock: document.getElementById('product_stock').value,
            product_weight: document.getElementById('product_weight').value,
        });

        window.location.reload();

        console.log('Document written with ID: ', productId);
        //document.getElementById('output').innerText = 'Data added to Firestore!';
    } catch (e) {
        console.error('Error adding document: ', e);
        //document.getElementById('output').innerText = 'Error adding data to Firestore!';
    }
});

// Add an event listener to the product category select element
document.getElementById("product_category").addEventListener("change", function () {
    // Call updateOptions() when the value of the product category changes
    updateOptions();
});

function updateOptions() {
    var categorySelect = document.getElementById("product_category");
    var typeSelect = document.getElementById("product_type");
    var selectedCategory = categorySelect.value;

    // Clear existing type options
    typeSelect.innerHTML = '<option disabled selected>Select Type</option>';

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
            addOption("Dry Food");
            addOption("Essentials");
            addOption("Toys");
            addOption("Treats");
            break;
        case "birds":
            addOption("dry food");
            addOption("essentials");
            addOption("toys");
            addOption("treats");
            break;
        case "fish&aquatics":
            addOption("Dry Food");
            addOption("Essentials");
            addOption("Treats");
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
