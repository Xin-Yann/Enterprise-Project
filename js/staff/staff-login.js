// Initialize Firebase Auth and Firestore
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

  // Check if the email ends with "@staff.com"
  if (!email.endsWith('@staff.com')) {
    window.alert('Only staff members are allowed to login.');
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((staffCredential) => {
      const staff = staffCredential.user;
      fetchStaffdata();
      console.log('Signed in user:', staff);
      window.location.href = "staff-home.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error adding document: ', errorCode, errorMessage);
      switch (errorCode) {
        case 'auth/wrong-password':
          window.alert("Invalid password. Please try again.");
          break;
        case 'auth/user-not-found':
          window.alert("No user found with this email. Please sign up.");
          break;
        case 'auth/invalid-email':
          window.alert("Invalid email format. Please check your email.");
          break;
        case 'auth/email-already-in-use':
          window.alert("The email address is already in use by another account.");
          break;
        default:
          window.alert("Error: " + errorMessage);
      }
    });
});

async function fetchStaffdata() {
  try {
      const staffsCollection = collection(db, 'staffs');
      const querySnapshot = await getDocs(staffsCollection);
      // Process staff data as needed
  } catch (error) {
      console.error('Error fetching documents: ', error);
  }
}
