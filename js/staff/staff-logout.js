// Initialize Firebase Auth and Firestore
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Get a reference to the Firestore database
const db = getFirestore();

// Get a reference to the Firebase Authentication service
const auth = getAuth();

document.getElementById('signOut').addEventListener('click', () => {
    // Sign out the current user
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            console.log('User signed out');
            window.location.href = "/html/staff/staff-login.html";
            window.alert("You have been successfully signed out.");
            history.replaceState(null, null, '/html/staff/staff-login.html');
        })
        .catch((error) => {
            // An error happened.
            console.error('Sign-out error:', error);
        });
});



