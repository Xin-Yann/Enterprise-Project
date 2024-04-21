// Initialize Firebase Auth and Firestore
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Get a reference to the Firestore database
const db = getFirestore();

// Get a reference to the Firebase Authentication service
const auth = getAuth();

document.getElementById('signIn').addEventListener('click', () => {
  event.preventDefault();
  // Get email and password from input fields
  const email = document.getElementById('Email').value;
  const password = document.getElementById('Password').value;

  // Sign in with email and password
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      fetchUserdata();
      console.log('Signed in user:', user);
      window.location.href = "/html/home.html";
    })
    .catch((error) => {
      // Handle sign-in errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Sign-in error:', errorCode, errorMessage);
      window.alert("Invalid email or password. Please try again.");
    });
});

async function fetchUserdata() {
  try {
      // Reference to the "users" collection
      const usersCollection = collection(db, 'users');

      // Get all documents in the "users" collection
      const querySnapshot = await getDocs(usersCollection);

  } catch (error) {
      console.error('Error fetching documents: ', error);
  }
}
