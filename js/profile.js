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

            // Query the user's details document using the email
            const q = query(collection(db, 'users'), where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    console.log('User data fetched:', userData);

                    // Populate form fields
                    document.getElementById('Name').value = userData.name || '';
                    document.getElementById('Email').value = userData.email || '';
                    document.getElementById('Contact').value = userData.contact || '';
                    document.getElementById('Address').value = userData.address || '';
                    document.getElementById('State').value = userData.state || '';
                    document.getElementById('City').value = userData.city || '';
                    document.getElementById('Postcode').value = userData.post || '';
                });
            } else {
                console.log('User details document does not exist.');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }

    // Ensure the user is authenticated before fetching details
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userEmail = sessionStorage.getItem('userEmail');
            if (userEmail) {
                fetchAndDisplayPersonalDetails(userEmail);
            } else {
                console.log('No user email found in session storage.');
            }
        } else {
            console.log('No user is authenticated. Redirecting to login page.');
            window.location.href = "/html/login.html";
        }
    });

    // Function to save the edited details
    async function saveEditedDetails(email) {
        try {
            // Query the user's details document using the email
            const q = query(collection(db, 'users'), where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (docSnapshot) => {
                    const docRef = doc(db, 'users', docSnapshot.id);

                    // Get values from form fields
                    const updatedData = {
                        name: document.getElementById('Name').value,
                        email: document.getElementById('Email').value,
                        contact: document.getElementById('Contact').value,
                        address: document.getElementById('Address').value,
                        state: document.getElementById('State').value,
                        city: document.getElementById('City').value,
                        post: document.getElementById('Postcode').value,
                    };

                    // Update the document with the new data
                    await updateDoc(docRef, updatedData);
                    alert('User details updated successfully.');
                });
            } else {
                alert('User details document does not exist.');
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    }

    // Add event listener to the save button
    const saveBtn = document.getElementById('save');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const userEmail = sessionStorage.getItem('userEmail');
            if (userEmail) {
                saveEditedDetails(userEmail);
            } else {
                console.log('No user email found in session storage.');
            }
        });
    }
});
