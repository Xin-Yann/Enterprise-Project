// Initialize Firebase Auth and Firestore
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Get a reference to the Firestore database
const db = getFirestore();

// Get a reference to the Firebase Authentication service
const auth = getAuth();

document.getElementById('signUp').addEventListener('click', async () => {
  event.preventDefault();
  try {

    const name = document.getElementById('Name').value;
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    const contact = document.getElementById('Contact').value;

    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;

    if (!email.endsWith('@staff.com')) {
      window.alert('Only staff members are allowed to register.');
    }
    
    if (password.length < 8 || !uppercase.test(password) || !lowercase.test(password)) {
      window.alert('Password must be at least 8 characters long and contain at least one uppercase and one lowercase character');
    }

    const staffCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    const docRef = await addDoc(collection(db, 'staffs'), {
      name: name,
      email: email,
      contact: contact
    });

    console.log('Staff created with email: ', staffCredential.user.email);
    console.log('Document written with ID: ', docRef.id);
    window.location.href = "../staff/staff-home.html";
    document.getElementById('output').innerText = 'Data added to Firestore!';
  } catch (e) {
    const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error adding document: ', errorCode, errorMessage);
        switch (errorCode) {
            case 'auth/invalid-email':
                window.alert("Invalid email format. Please check your email.");
                break;
            case 'auth/email-already-in-use':
                window.alert("The email address is already in use by another account.");
                break;
            default:
                window.alert("Error: " + errorMessage);
        }
  }

});
