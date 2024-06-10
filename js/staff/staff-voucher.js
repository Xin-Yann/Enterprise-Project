// Import necessary Firebase modules
import { getFirestore, doc, collection, query, orderBy, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

// Function to fetch promo data and display it on the webpage
async function fetchVouchersAndDisplay() {
    try {
        // Reference to the 'promo' collection and order by 'promo_order' field
        const voucherCollection = query(collection(db, 'voucher'), orderBy('voucher_id', 'asc'));
        
        // Get all documents from the 'promo' collection
        const voucherSnapshot = await getDocs(voucherCollection);

        const voucherContainer = document.getElementById('voucher-container');
        voucherContainer.innerHTML = '';

        const table = document.createElement('table');
        table.classList.add('table', 'table-bordered', 'table-hover', 'table-style');
        table.style.backgroundColor = 'white';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Id', 'Name', 'Image', 'Description','Points to Redeem', 'Stock','Edit', 'Delete'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        voucherSnapshot.forEach(doc => {
            const voucherData = doc.data();
            const tr = document.createElement('tr');

            ['voucher_id', 'voucher_name', 'voucher_image', 'voucher_description', 'voucher_points', 'voucher_stock'].forEach(field => {
                const td = document.createElement('td');
                if (field === 'voucher_image' && voucherData[field]) {
                    const voucherImage = document.createElement('img');
                    voucherImage.src = `/image/${voucherData[field]}`;
                    voucherImage.alt = 'Voucher Image';
                    voucherImage.classList.add('table-image');
                    td.appendChild(voucherImage);
                } else {
                    td.textContent = voucherData[field] || 'N/A';
                }
                tr.appendChild(td);
            });

            // Edit button
            const action1 = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('btn', 'btn-primary');
            editButton.addEventListener('click', () => {
                editVoucher(doc.id);
            });
            action1.appendChild(editButton);
            tr.appendChild(action1);

            // Delete button
            const action2 = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.addEventListener('click', async () => {
                await deleteVoucher(doc.id);
            });
            action2.appendChild(deleteButton);
            tr.appendChild(action2);

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        voucherContainer.appendChild(table);
    } catch (error) {
        console.error('Error fetching vouchers:', error);
    }
}

// Function to delete voucher
async function deleteVoucher(voucherId) {
    try {
        const voucherRef = doc(db, `voucher/${voucherId}`);
        await deleteDoc(voucherRef);
        alert('Voucher deleted successfully!');
        fetchVouchersAndDisplay();
    } catch (error) {
        console.error('Error deleting document:', error);
        alert('Error deleting voucher.');
    }
}

// Function to navigate to the edit voucher page
function editVoucher(voucherId) {
    window.location.href = `/html/staff/staff-editvoucher.html?id=${voucherId}`;
}

// Initial fetch and display when the page loads
document.addEventListener('DOMContentLoaded', function() {
    fetchVouchersAndDisplay();
});
