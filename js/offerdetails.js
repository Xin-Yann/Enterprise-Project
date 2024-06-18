// Import necessary Firebase modules
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

// Function to fetch and display promos
async function fetchPromos() {
    try {
        // Reference to the 'promo' collection and order by 'promo_order' field
        const promoCollection = query(collection(db, 'promo'), orderBy('promo_order'));
        
        // Get all documents from the 'promo' collection
        const promoSnapshot = await getDocs(promoCollection);
        
        // Get the element where promos will be displayed
        const promoContainer = document.getElementById('promoContainer');
        
        // Clear any existing content
        promoContainer.innerHTML = '';
        
        // Loop through each document and create HTML elements
        let isAlternate = true;
        promoSnapshot.forEach(doc => {
            const promoData = doc.data();
            
            const promoElement = document.createElement('div');
            promoElement.className = isAlternate ? 'container1' : 'container2';

            if (promoData.promo_image) {
                const promoImage = document.createElement('img');
                promoImage.src = `/image/${promoData.promo_image}`;
                promoImage.classList.add('offerimg');
                promoElement.appendChild(promoImage);
            }
            
            const promoInfo = document.createElement('div');
            promoInfo.className = 'offerinfo';
            promoInfo.innerHTML = `<p>${promoData.promo_description}</p>`;
            
            promoElement.appendChild(promoInfo);
            promoContainer.appendChild(promoElement);
            
            // Alternate the container class for next promo
            isAlternate = !isAlternate;
        });
        
    } catch (error) {
        console.error("Error fetching promos: ", error);
    }
}

// Call the fetchPromos function when the page loads
window.onload = fetchPromos;
