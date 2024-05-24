import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firebase Firestore
const db = getFirestore();

// Initialize Firebase Authentication
const auth = getAuth();

function getCurrentUserId() {
  const user = auth.currentUser;
  return user ? user.uid : null;
}

auth.onAuthStateChanged(async (user) => {
  try {
      if (user) {
          const userId = getCurrentUserId();
          if (!userId) {
              console.error("Invalid userId:", userId);
              return;
          }
          // User is signed in, update cart item count
          fetchUserDataFromFirestore(userId);
          console.log("User authenticated. User ID:", userId);
      } else {
          console.log("User is not authenticated.");
      }
  } catch (error) {
      console.error("Error in authentication state change:", error);
  }
});


async function fetchUserDataFromFirestore(userId) {
  try {
    if (userId) {
      const usersCollectionRef = collection(db, 'users');
      const querySnapshot = await getDocs(query(usersCollectionRef, where('userId', '==', userId)));

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // Populate the input fields with the fetched user data
        document.getElementById('from_name').value = userData.name || '';
        document.getElementById('email_id').value = userData.email || '';
      });
    }
  } catch (e) {
    console.error('Error fetching user data: ', e);
    // You can handle errors here, such as displaying an error message
  }
}

// Function to send email using EmailJS
function SendMail() {
    var params = {
        from_name: document.getElementById("from_name").value,
        email_id: document.getElementById("email_id").value,
        title: document.getElementById("title").value,
        message: document.getElementById("message").value
    };
    emailjs.send('service_wio03zw', 'template_vbpmxdq', params).then(function(res) {
        alert("Success!", res.status);
    });
}

document.getElementById('Submit').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const name = document.getElementById('from_name').value;
        const email = document.getElementById('email_id').value;
        const title = document.getElementById('title').value;
        const message = document.getElementById('message').value;

        // Add data to Firestore
        const docRef = await addDoc(collection(db, 'contact'), {
            name: name,
            email: email,
            title: title,
            message: message
        });

        SendMail();

        console.log('Document written with ID: ', docRef.id);        
    } catch (e) {
        console.error('Error adding document: ', e);
    }
});





