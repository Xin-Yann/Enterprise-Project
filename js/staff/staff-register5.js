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

    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    
    if (password.length < 8 || !uppercase.test(password) || !lowercase.test(password)) {
      throw new Error('Password must be at least 8 characters long and contain at least one uppercase and one lowercase character');
    }

    const staffCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    const docRef = await addDoc(collection(db, 'staffs'), {
      name: name,
      email: email,
      password: hashpass,
      contact: contact
    });

    console.log('Staff created with email: ', staffCredential.user.email);
    console.log('Document written with ID: ', docRef.id);
    console.log('Password hash:', hashpass);
    window.location.href = "/html/staff/staff-home.html";
    document.getElementById('output').innerText = 'Data added to Firestore!';
  } catch (e) {
    console.error('Error adding document: ', e);
    document.getElementById('output').innerText = 'Error adding data to Firestore!';
  }

  

  console.log('Password hash:', password);

});

async function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; 
  }
  return hash.toString();
}



