// Import necessary Firebase modules
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js";

// Initialize Firestore and Storage
const db = getFirestore();
const storage = getStorage();

// Function to get query parameter by name
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to fetch and display product details
async function fetchAndDisplayProductDetails() {
    try {
        const productCategory = getQueryParam('category');
        const productId = getQueryParam('id');
        const productType = decodeURIComponent(getQueryParam('type'));

        if (!productId || !productType || !productCategory) {
            alert('No product category, id or type found in URL');
            return;
        }

        const productDocRef = doc(db, 'products', productCategory, productType, productId);
        const productSnapshot = await getDoc(productDocRef);

        if (productSnapshot.exists()) {
            const productData = productSnapshot.data();
            document.getElementById('product_category').value = productCategory;
            document.getElementById('product_type').value = productType;
            document.getElementById('product_id').value = productId;
            document.getElementById('product_name').value = productData.product_name || '';
            document.getElementById('product_description').value = productData.product_description || '';
            document.getElementById('product_price').value = productData.product_price || '';
            document.getElementById('product_stock').value = productData.product_stock || '';
            document.getElementById('product_weight').value = productData.product_weight || '';
        } else {
            alert('No such document!');
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Function to handle image upload
async function uploadImage(file, productCategory, productType) {
    if (!file) return null;  // Return null if no file is given (handled outside)

    const storageRef = ref(storage, `products/${productCategory}/${productType}/${file.name}`);
    await uploadBytes(storageRef, file);
    return file.name;
}

// Function to save edited product details
async function saveProductDetails() {
    try {
        const productCategory = document.getElementById('product_category').value;
        const productId = document.getElementById('product_id').value;
        const productType = document.getElementById('product_type').value;
        const productDocRef = doc(db, 'products', productCategory, productType, productId);

        // Fetch the existing data to potentially get the existing image
        const currentSnapshot = await getDoc(productDocRef);
        const currentData = currentSnapshot.exists() ? currentSnapshot.data() : {};

        // Check if the file input actually has a file
        const imageFile = document.getElementById('product_image').files[0];

        let imageName; // Declare imageName variable without initializing it here.

        if (imageFile) {
            // If there's a new image file, upload it and update the imageName.
            imageName = await uploadImage(imageFile, productCategory, productType);
        } else {
            // If no new file is uploaded, retain the existing image name from the database.
            imageName = currentData.product_image;
        }

        const updatedData = {
            product_image: imageName,
            product_name: document.getElementById('product_name').value,
            product_description: document.getElementById('product_description').value,
            product_price: document.getElementById('product_price').value,
            product_stock: parseInt(document.getElementById('product_stock').value),
            product_weight: document.getElementById('product_weight').value,
        };

        await updateDoc(productDocRef, updatedData);
        alert('Product updated successfully!');
        window.location.href = '/html/staff/staff-productcat.html';
    } catch (error) {
        alert('Error saving product details');
    }
}

// Event listener for "EDIT" button
document.getElementById('edit').addEventListener('click', saveProductDetails);

// Fetch and display product details on page load
document.addEventListener('DOMContentLoaded', fetchAndDisplayProductDetails);