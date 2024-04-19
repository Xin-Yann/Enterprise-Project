// // Initialize Firebase Auth and Firestore
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
// import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";

// // Get a reference to the Firestore database
// const db = getFirestore();

// // Get a reference to the Firebase Authentication service
// const auth = getAuth();

// document.getElementById('signIn').addEventListener('click', () => {
//     // Get email and password from input fields
//     const email = document.getElementById('Email').value;
//     const password = document.getElementById('Password').value;
  
//     // Sign in with email and password
//     firebase.auth().signInWithEmailAndPassword(email, password)
//       .then((userCredential) => {
//         // Signed in successfully
//         const user = userCredential.user;
//         console.log('Signed in user:', user);
//         // Redirect to dashboard or perform other actions
//       })
//       .catch((error) => {
//         // Handle sign-in errors
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.error('Sign-in error:', errorCode, errorMessage);
//         // Display error message to the user
//       });
//   });
  

// // document.getElementById('signOutButton').addEventListener('click', () => {
// //   // Sign out from Firebase Authentication (you need to implement your own authentication logic)
// // });
