// Import necessary Firebase modules
import { getFirestore, collection, setDoc, doc, getDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

// Add event listener to interact with Firebase services when the "add" button is clicked
document.getElementById("add").addEventListener("click", async () => {
    try {
        const voucherId = document.getElementById('voucher_id').value;

        // Validate required fields
        const voucherName = document.getElementById('voucher_name').value;
        const voucherDescription = document.getElementById('voucher_description').value;
        const voucherPoints = document.getElementById('voucher_points').value;
        const voucherStock = document.getElementById('voucher_stock').value;

        if (!voucherId || !voucherName || !voucherPoints || !voucherStock || !voucherDescription) {
            alert('Please fill out all required fields: description, type, ID, name, price, stock.');
            return;
        }

        
        // Check if the product ID already exists
        const voucherRef = doc(collection(db, 'voucher'), voucherId);
        const voucherSnapshot = await getDoc(voucherRef);

        if (voucherSnapshot.exists()) {
            alert('Voucher ID already exists. Please choose a different ID.');
            return;
        }

        // Check if the product name already exists
        const voucherQuery = query(collection(db, 'voucher'), where("voucher_name", "==", voucherName));
        const querySnapshot = await getDocs(voucherQuery);

        if (!querySnapshot.empty) {
            alert('Voucher name already exists. Please choose a different name.');
            return;
        }

        // Get the full path of the image
        const imagePath = document.getElementById('voucher_image').value;
        // Extract only the file name
        const imageName = imagePath.split('\\').pop().split('/').pop();

        // Set the document in Firestore
        await setDoc(voucherRef, {
            voucher_id: voucherId,
            voucher_image: imageName,
            voucher_name: voucherName,
            voucher_description: voucherDescription,
            voucher_points: voucherPoints,
            voucher_stock: voucherStock,
        });

        alert('Voucher added successfully!');
        window.location.reload();

        console.log('Document written with ID: ', voucherId);
    } catch (e) {
        console.error('Error adding document: ', e);
        alert('Error adding document: ' + e.message);
    }
});
