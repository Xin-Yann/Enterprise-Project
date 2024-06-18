import { getFirestore, collection, getDocs, getDoc, query, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Firestore and Authentication
    const db = getFirestore();
    const auth = getAuth();

    function getCurrentUserId() {
        const user = auth.currentUser;
        return user ? user.uid : null;
    }

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
                    document.getElementById('Points').value = userData.points || '';
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
            const userId = getCurrentUserId();
            // User is signed in, update cart item count
            updateCartItemCount(userId);
            const email = user.email;
            console.log('User is logged in:', user.email);
            fetchAndDisplayPersonalDetails(email);
            // const userEmail = sessionStorage.getItem('userEmail');
            // if (userEmail) {
            //     fetchAndDisplayPersonalDetails(userEmail);
            // } else {
            //     console.log('No user email found in session storage.');
            // }

        } else {
            console.log('No user is authenticated. Redirecting to login page.');
            window.location.href = "/html/login.html";
        }
    });

    function validateProfileDetails() {
        const name = document.getElementById('Name').value;
        const email = document.getElementById('Email').value;
        const contact = document.getElementById('Contact').value;
        const address = document.getElementById('Address').value;
        const state = document.getElementById('State').value;
        const city = document.getElementById('City').value;
        const postcode = document.getElementById('Postcode').value;

        const namePattern = /^[A-Za-z\s]+$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const contactPattern = /^\d{10,11}$/;
        const postcodePattern = /^\d{5}$/;

        if (!name || !email || !contact || !address || !state || !city || !postcode) {
            alert('Please fill out all required fields: name, email, contact, address, state, city and postcode.');
            return false;
        }

        if (!namePattern.test(name)) {
            alert('Name should contain only letters and spaces.');
            return false;
        }

        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        if (!contactPattern.test(contact)) {
            alert('Please enter a valid 10 or 11-digit contact number.');
            return false;
        }

        if (!postcodePattern.test(postcode)) {
            alert('Please enter a valid 5-digit postcode.');
            return false;
        }

        return true;
    }


    // Function to save the edited details
    async function saveEditedDetails(email) {
        if (!validateProfileDetails()) {
            return;
        }
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
                        points: document.getElementById('Points').value,
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

    // Function to update the cart item count in the UI
    async function updateCartItemCount(userId) {
        try {
            if (userId) {
                const userCartDocRef = doc(collection(db, 'carts'), userId);
                const userCartDocSnap = await getDoc(userCartDocRef);

                if (userCartDocSnap.exists()) {
                    const cartItems = userCartDocSnap.data().cart || [];
                    const cartItemCount = document.getElementById('cartItemCount');
                    let totalCount = 0;
                    cartItems.forEach(item => {
                        totalCount += item.quantity;
                    });
                    cartItemCount.textContent = totalCount;
                }
            }
        } catch (error) {
            console.error("Error updating cart item count:", error);
        }
    }


});