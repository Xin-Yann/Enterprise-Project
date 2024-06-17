import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc,doc, getDocs, getDoc, query, where } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firebase Firestore
const db = getFirestore();
const auth = getAuth();

(function () {
    emailjs.init("86kjxi3kBUTZUUwYJ");
})();

// Function to get the current user ID
function getCurrentUserId() {
    const user = auth.currentUser;
    return user ? user.uid : null;
}

// Listen for authentication state changes
auth.onAuthStateChanged(async (user) => {
    try {
        if (user) {
            const userId = getCurrentUserId();
            if (!userId) {
                console.error("Invalid userId:", userId);
                return;
            }
            // User is signed in, update cart item count
            updateCartItemCount(userId);
            fetchUserDataFromFirestore(userId);
            console.log("User authenticated. User ID:", userId);
        } else {
            console.log("User is not authenticated.");
        }
    } catch (error) {
        console.error("Error in authentication state change:", error);
    }
});

const cart = document.getElementById('cart');
if (cart) {
    // Add event listener to the cart button
    cart.addEventListener('click', handleCartClick);
}

function handleCartClick() {
    if (auth.currentUser) {
        // User is signed in, redirect to cart page
        window.location.href = "../html/cart.html";
    } else {
        // User is not logged in, display alert message
        window.alert('Please Login to view your cart.');
        // Optionally, redirect to the login page
        window.location.href = "../html/login.html";
    }
}

// Function to update the cart item count in the UI
async function updateCartItemCount(userId) {
    try {
        if (userId) {
            const userCartDocRef = doc(collection(db, 'carts'), userId);
            const userCartDocSnap = await getDoc(userCartDocRef);

            if (userCartDocSnap.exists()) {
                const cartItems = userCartDocSnap.data().cart || [];
                const cartItemCount = document.getElementById('cartItemCount');
                let totalCount = 0;
                cartItems.forEach(item => {
                    totalCount += item.quantity;
                });
                cartItemCount.textContent = totalCount;
            }
        }
    } catch (error) {
        console.error("Error updating cart item count:", error);
    }
}

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
        location.reload();
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





