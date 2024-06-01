// Initialize Firebase Auth and Firestore
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Get a reference to the Firestore database
const db = getFirestore();

// Get a reference to the Firebase Authentication service
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    document.getElementById('signOut').style.display = 'block'; 
  } else {
    // No user is signed in
    document.getElementById('signOut').style.display = 'none'; 
  }
});


function handleProfileClick() {
  if (auth.currentUser) {
    // User is signed in, redirect to profile page
    window.location.href = "/html/profile.html";
  } else {
    // No user is signed in, redirect to login page
    window.location.href = "/html/login.html";
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
      // Sign-out successful, clear session storage
      sessionStorage.clear();
      console.log('User signed out');
      window.location.href = "../html/home.html";
      window.alert("You have been successfully signed out.");
    })
    .catch((error) => {
      // An error happened.
      console.error('Sign-out error:', error);
    });
});

// window.addEventListener('beforeunload', (event) => {
//   // Attempt to sign out the user
//   signOut(auth)
//     .then(() => {
//       // Sign-out successful, clear session storage
//       sessionStorage.clear();
//       console.log('User signed out on page close');
//     })
//     .catch((error) => {
//       // An error happened.
//       console.error('Sign-out error on page close:', error);
//     });
// });