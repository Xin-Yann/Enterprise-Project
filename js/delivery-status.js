import { getFirestore, collection, query, getDocs, getDoc, doc, where } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// Initialize Firestore and Auth
const db = getFirestore();
const auth = getAuth();

function getCurrentUserId() {
    const user = auth.currentUser;
    return user ? user.uid : null;
}

// Function to fetch and display delivery status for the logged-in user based on email
async function fetchAndDisplayDeliveryStatus() {
    const user = auth.currentUser;

    if (!user) {
        console.log('User is not authenticated.');
        return;
    }

    const userEmail = user.email;

    if (!userEmail) {
        console.log('User email is not available.');
        return;
    }

    try {
        const ordersQuery = query(collection(db, 'orders'), where('userDetails.email', '==', userEmail));
        const querySnapshot = await getDocs(ordersQuery);

        const statusContainer = document.getElementById('statusContainer');
        statusContainer.innerHTML = ''; // Clear any existing content

        if (!querySnapshot.empty) {
            const table = document.createElement('table');
            table.setAttribute('border', '1');
            table.setAttribute('width', '100%');

            // Create table headers
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Order ID</th>
                    <th>Tracking Number</th>
                    <th>Status</th>
                </tr>
            `;
            table.appendChild(thead);

            // Create table body
            const tbody = document.createElement('tbody');
            querySnapshot.forEach((doc) => {
                const orderData = doc.data();
                const trackingNumber = orderData.trackingNumber || 'N/A';
                const deliveryStatus = orderData.status || 'Pending';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${doc.id}</td>
                    <td>${trackingNumber}</td>
                    <td>${deliveryStatus}</td>                 
                `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            // Append the table to the container
            statusContainer.appendChild(table);
        } else {
            statusContainer.innerHTML = '<p class="pt-3">No orders found.</p>';
        }
    } catch (error) {
        console.error('Error fetching delivery status:', error);
    }
}

// Authenticate user and display delivery status
onAuthStateChanged(auth, (user) => {

    if (user) {
        const userId = getCurrentUserId();
        // User is signed in, update cart item count
        updateCartItemCount(userId);
        fetchAndDisplayDeliveryStatus();
    } else {
        console.log('No user is authenticated. Redirecting to login page.');
        window.location.href = "/html/login.html";
    }
});

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