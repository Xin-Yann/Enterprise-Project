// Initialize Firebase Auth and Firestore
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Get a reference to the Firestore database
const db = getFirestore();

// Get a reference to the Firebase Authentication service
const auth = getAuth();

function handleProfileClick() {
    if (auth.currentUser) {
      // User is signed in, redirect to profile page
      window.location.href = "/html/staff/staff-profile.html";
    } else {
      // No user is signed in, redirect to login page
      alert('Please Login to view your profile details.');
      window.location.href = "/html/staff/staff-login.html";
    }
  }
  
  const profile = document.getElementById('profile');
  if (profile) {
    profile.addEventListener('click', handleProfileClick);
  }

document.getElementById('signOut').addEventListener('click', () => {
    // Sign out the current user
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            sessionStorage.clear();
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