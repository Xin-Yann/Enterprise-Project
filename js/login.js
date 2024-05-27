// Initialize Firebase Auth and Firestore
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Get a reference to the Firestore database
const db = getFirestore();

// Get a reference to the Firebase Authentication service
const auth = getAuth();

document.getElementById('signIn').addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('Email').value;
  const password = document.getElementById('Password').value;

  if (!email || !password) {
    window.alert('Email and password must be filled out.');
    return; 
  }

  if (email.endsWith('@staff.com')) {
    window.alert('Invalid Email');
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('Signed in user:', user);

      // Store user email in session storage
      sessionStorage.setItem('userEmail', user.email);

      // Redirect to home page
      window.location.href = "../html/home.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Sign-in error:', errorCode, errorMessage);
      window.alert("Invalid email or password. Please try again.");
    });
});
