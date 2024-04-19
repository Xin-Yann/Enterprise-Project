// Initialize Firebase Auth and Firestore
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Get a reference to the Firestore database
const db = getFirestore();

// Get a reference to the Firebase Authentication service
const auth = getAuth();

document.getElementById('signUp').addEventListener('click', async () => {
  try {

    const name = document.getElementById('Name').value;
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    const contact = document.getElementById('Contact').value;

    // Add a document to the "users" collection
    const docRef = await addDoc(collection(db, 'users'), {
        name: name,
        email: email,
        password: password,
        contact: contact
    });
    console.log('Document written with ID: ', docRef.id);
    document.getElementById('output').innerText = 'Data added to Firestore!';
  } catch (e) {
    console.error('Error adding document: ', e);
    document.getElementById('output').innerText = 'Error adding data to Firestore!';
  }
});



