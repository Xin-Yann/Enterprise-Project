// Initialize Firebase Auth and Firestore
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
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
    const hashpass = await hashPassword(password);
    const contact = document.getElementById('Contact').value;
    const address = document.getElementById('Address').value;
    const state = document.getElementById('State').value;
    const city = document.getElementById('City').value;
    const post = document.getElementById('Postcode').value;
    

    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    
    if (password.length < 8 || !uppercase.test(password) || !lowercase.test(password)) {
      throw new Error('Password must be at least 8 characters long and contain at least one uppercase and one lowercase character');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Add a document to the "users" collection
    const docRef = await addDoc(collection(db, 'users'), {
      name: name,
      email: email,
      password: hashpass,
      contact: contact,
      address: address,
      state: state,
      city: city,
      post: post
    });

    console.log('User created with email: ', userCredential.user.email);
    console.log('Document written with ID: ', docRef.id);
    console.log('Password hash:', hashpass);
    window.location.href = "/html/home-1.html";
    //document.getElementById('output').innerText = 'Data added to Firestore!';
  } catch (e) {
    console.error('Error adding document: ', e);
    //document.getElementById('output').innerText = 'Error adding data to Firestore!';
  }

  console.log('Password hash:', password);


});


async function hashPassword(hashpass) {
  return hashpass;
}



