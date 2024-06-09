import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// Initialize Firestore and Auth
const db = getFirestore();
const auth = getAuth();

// Function to get the current user ID
function getCurrentUserId() {
    const user = auth.currentUser;
    return user ? user.uid : null;
}

// Function to fetch and display delivery status
async function fetchAndDisplayDeliveryStatus() {
    try {
        const q = query(collection(db, 'orders'));
        const querySnapshot = await getDocs(q);

        const statusContainer = document.getElementById('statusContainer');
        statusContainer.innerHTML = ''; // Clear any existing content

        if (!querySnapshot.empty) {
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Tracking Number</th>
                        <th>Status</th>
                        <th>Update Status</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;

            querySnapshot.forEach((doc) => {
                const orderData = doc.data();
                const trackingNumber = orderData.trackingNumber || 'N/A';
                const deliveryStatus = orderData.status || 'Pending';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${doc.id}</td>
                    <td>${trackingNumber}</td>
                    <td>${deliveryStatus}</td>
                    <td>
                        ${deliveryStatus !== 'Complete' ? `
                            <form onsubmit="event.preventDefault(); updateOrderStatus('${doc.id}');">
                                <select id="newStatus-${doc.id}">
                                    <option value="Pending" ${deliveryStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                                    <option value="Shipped" ${deliveryStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
                                    <option value="Delivered" ${deliveryStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                </select>
                                &nbsp;
                                <button class="btn" type="submit">Update</button>
                            </form>
                        ` : '<p style="margin-top: 1rem;">Complete</p>'}
                    </td>
                `;

                table.querySelector('tbody').appendChild(row);
            });

            statusContainer.appendChild(table);
        } else {
            statusContainer.innerHTML = '<p>No orders found.</p>';
        }
    } catch (error) {
        console.error('Error fetching delivery status:', error);
    }
}

// Function to update order status
async function updateOrderStatus(orderId) {
    const newStatus = document.getElementById(`newStatus-${orderId}`).value;

    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
            status: newStatus
        });

        // Refresh the status display
        fetchAndDisplayDeliveryStatus(); // Updated to fetch and display status without passing userId
    } catch (error) {
        console.error('Error updating order status:', error);
    }
}

// Make updateOrderStatus function globally accessible
window.updateOrderStatus = updateOrderStatus;

// Authenticate user and display delivery status
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchAndDisplayDeliveryStatus(); // Fetch and display status directly
    } else {
        console.log('No user is authenticated. Redirecting to login page.');
        window.location.href = "/html/login.html";
    }
});
