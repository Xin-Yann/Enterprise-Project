import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firebase Auth and Firestore
const auth = getAuth();
const db = getFirestore();

document.getElementById('signUpButton').addEventListener('click', async () => {
  event.preventDefault();
    try {
        const name = document.getElementById('Name').value;
        const email = document.getElementById('Email').value;
        const password = document.getElementById('Password').value;
        const contact = document.getElementById('Contact').value;
        const address = document.getElementById('Address').value;
        const state = document.getElementById('State').value;
        const city = document.getElementById('City').value;
        const post = document.getElementById('Postcode').value;

        const uppercase = /[A-Z]/;
        const lowercase = /[a-z]/;

        if (password.length < 8 || !uppercase.test(password) || !lowercase.test(password)) {
            window.alert("Password must be at least 8 characters long and contain at least one uppercase and one lowercase character");
            return; // prevent further execution
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Add a document to the "users" collection
        const docRef = await addDoc(collection(db, 'users'), {
            name: name,
            email: email,
            contact: contact,
            address: address,
            state: state,
            city: city,
            post: post
        });
        window.location.href = "../html/home.html";

        console.log('User created with email: ', userCredential.user.email);
        console.log('Document written with ID: ', docRef.id);
    } catch (e) {
        console.error('Error adding document: ', e);
    }
});

