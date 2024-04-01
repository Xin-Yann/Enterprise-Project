// Import necessary Firebase modules
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

// Function to fetch data and display in the webpage
async function fetchDataAndDisplay() {
    try {
        // Reference to the "users" collection
        const usersCollection = collection(db, 'users');

        // Get all documents in the "users" collection
        const querySnapshot = await getDocs(usersCollection);

        // Get a reference to the container where data will be displayed
        const container = document.getElementById('user');
        container.innerHTML = ''; // Clear existing content

        // Iterate through each document in the collection
        querySnapshot.forEach(doc => {
            // Create elements to display document data
            const userDiv = document.createElement('div');
            userDiv.classList.add('user');

            const userIdHeading = document.createElement('h2');
            userIdHeading.textContent = `User ID: ${doc.id}`;
            userDiv.appendChild(userIdHeading);

            const userDataParagraph = document.createElement('p');
            userDataParagraph.textContent = `Name: ${doc.data().name}, Email: ${doc.data().email}, Age: ${doc.data().age}`;
            userDiv.appendChild(userDataParagraph);

            // Append the created elements to the container
            container.appendChild(userDiv);
        });

    } catch (error) {
        console.error('Error fetching documents: ', error);
    }
}

// Call fetchDataAndDisplay function to fetch data and display in the webpage
fetchDataAndDisplay();
