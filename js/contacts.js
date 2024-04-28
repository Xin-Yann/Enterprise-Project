import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const db = getFirestore();

function SendMail(){
  var params = {
    from_name: document.getElementById("from_name").value,
    email_id: document.getElementById("email_id").value,
    message: document.getElementById("message").value
  };
  emailjs.send('service_wio03zw', 'template_vbpmxdq', params).then(function(res){
    alert("Success!", res.status);
  });
}

document.getElementById('Submit').addEventListener('click', async (event) => {
  event.preventDefault();
  try {
    const name = document.getElementById('from_name').value;
    const email = document.getElementById('email_id').value;
    const message = document.getElementById('message').value;

    // Add data to Firestore
    const docRef = await addDoc(collection(db, 'contact'), {
      name: name,
      email: email,
      message: message
    });

    SendMail();

    console.log('Document written with ID: ', docRef.id);
    document.getElementById('output').innerText = 'Data added to Firestore!';
  } catch (e) {
    console.error('Error adding document: ', e);
    document.getElementById('output').innerText = 'Error adding data to Firestore!';
  }
});
