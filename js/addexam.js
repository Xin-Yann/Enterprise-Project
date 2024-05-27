// Initialize Firebase Auth and Firestore
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Get a reference to the Firestore database
const db = getFirestore();

// Get a reference to the Firebase Authentication service
const auth = getAuth();

// Add event listeners to interact with Firebase services
document.getElementById('addDataButton').addEventListener('click', async () => {
  try {
    // Add a document to the "users" collection
    const docRef = await addDoc(collection(db, 'users'), {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    });
    console.log('Document written with ID: ', docRef.id);
    document.getElementById('output').innerText = 'Data added to Firestore!';
  } catch (e) {
    console.error('Error adding document: ', e);
    document.getElementById('output').innerText = 'Error adding data to Firestore!';
  }
});

