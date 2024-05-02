// Initialize Firebase Auth and Firestore
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Get a reference to the Firestore database
const db = getFirestore();

// Get a reference to the Firebase Authentication service
const auth = getAuth();

document.getElementById('signIn').addEventListener('click', () => {
  event.preventDefault();
  const email = document.getElementById('Email').value;
  const password = document.getElementById('Password').value;

  if (!email || !password) {
    window.alert('Email and password must be filled out.');
    return; 
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((staffCredential) => {
      const staff = staffCredential.user;
      fetchStaffdata();
      console.log('Signed in user:', staff);
      window.location.href = "../html/staff/staff-home.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Sign-in error:', errorCode, errorMessage);
      window.alert("Invalid email or password. Please try again.");
    });
});

async function fetchStaffdata() {
  try {
      const staffsCollection = collection(db, 'staffs');

      const querySnapshot = await getDocs(staffsCollection);

  } catch (error) {
      console.error('Error fetching documents: ', error);
  }
}
