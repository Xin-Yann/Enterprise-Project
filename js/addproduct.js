// Import necessary Firebase modules
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

// Add event listener to interact with Firebase services when the "add" button is clicked
document.getElementById("add").addEventListener("click", async () => {
    try {
        // Add a document to the "products" collection
        const docRef = await addDoc(collection(db, 'products'), {
            category: document.getElementById('product_category').value,
            type: document.getElementById('product_type').value,
            id: document.getElementById('product_id').value,
            image: document.getElementById('product_image').value,
            name: document.getElementById('product_name').value,
            description: document.getElementById('product_description').value,
            price: document.getElementById('product_price').value,
            stock: document.getElementById('product_stock').value,
            weight: document.getElementById('product_weight').value,
        });
        console.log('Document written with ID: ', docRef.id);
        document.getElementById('output').innerText = 'Data added to Firestore!';
    } catch (e) {
        console.error('Error adding document: ', e);
        document.getElementById('output').innerText = 'Error adding data to Firestore!';
    }
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
            addOption("Dry Food");
            addOption("Wet Food");
            addOption("Essentials");
            addOption("Toys");
            addOption("Treats");
            break;
        case "cat":
            addOption("Dry Food");
            addOption("Wet Food");
            addOption("Essentials");
            addOption("Toys");
            addOption("Treats");
            break;
        case "hamster&rabbits":
            addOption("Dry Food");
            addOption("Essentials");
            addOption("Toys");
            addOption("Treats");
            break;
        case "birds":
            addOption("Dry Food");
            addOption("Essentials");
            addOption("Toys");
            addOption("Treats");
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
