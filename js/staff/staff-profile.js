import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firestore and Authentication
    const db = getFirestore();
    const auth = getAuth();

    // Function to fetch and display personal details
    async function fetchAndDisplayPersonalDetails(email) {
        try {
            console.log(`Fetching details for email: ${email}`);

            // Query the staff's details document using the email
            const q = query(collection(db, 'staffs'), where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const staffData = doc.data();
                    console.log('Staff data fetched:', staffData);

                    // Populate form fields
                    document.getElementById('Name').value = staffData.name || '';
                    document.getElementById('Email').value = staffData.email || '';
                    document.getElementById('Contact').value = staffData.contact || '';
                });
            } else {
                console.log('Staff details document does not exist.');
            }
        } catch (error) {
            console.error('Error fetching staff details:', error);
        }
    }

    // Ensure the staff is authenticated before fetching details
    onAuthStateChanged(auth, (staff) => {
        if (staff) {
            const staffEmail = sessionStorage.getItem('staffEmail');
            if (Email) {
                fetchAndDisplayPersonalDetails(staffEmail);
            } else {
                console.log('No staff email found in session storage.');
            }
        } else {
            console.log('No staff is authenticated. Redirecting to login page.');
            window.location.href = "/html/staff/staff-login.html";
        }
    });

    // Function to save the edited details
    async function saveEditedDetails(email) {
        try {
            // Query the staff's details document using the email
            const q = query(collection(db, 'staffs'), where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (docSnapshot) => {
                    const docRef = doc(db, 'staffs', docSnapshot.id);

                    // Get values from form fields
                    const updatedData = {
                        name: document.getElementById('Name').value,
                        email: document.getElementById('Email').value,
                        contact: document.getElementById('Contact').value,
                    };

                    // Update the document with the new data
                    await updateDoc(docRef, updatedData);
                    alert('Staff details updated successfully.');
                });
            } else {
                alert('Staff details document does not exist.');
            }
        } catch (error) {
            console.error('Error updating staff details:', error);
        }
    }

    // Add event listener to the save button
    const saveBtn = document.getElementById('save');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const staffEmail = sessionStorage.getItem('staffEmail');
            if (staffEmail) {
                saveEditedDetails(staffEmail);
            } else {
                console.log('No staff email found in session storage.');
            }
        });
    }
});
