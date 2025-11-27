
document.addEventListener('DOMContentLoaded', () => {

  const firebaseConfig = {
    apiKey: "AIzaSyCvx4pBrQyzjUGRzaHftYxIfrI5VcW0YtA",
    authDomain: "enrollmentappointment.firebaseapp.com",
    databaseURL: "https://enrollmentappointment-default-rtdb.firebaseio.com",
    projectId: "enrollmentappointment",
    storageBucket: "enrollmentappointment.firebasestorage.app",
    messagingSenderId: "1001070153862",
    appId: "1:1001070153862:web:416c41958c1660a5f54107",
    measurementId: "G-2Q0MRLZV6F"
  };

 
  try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }

  const database = firebase.database();


  const $ = id => document.getElementById(id);


  const contactForm = $("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();

      const nameInput = contactForm.querySelector('input[type="text"]');
      const emailInput = contactForm.querySelector('input[type="email"]');
      const messageInput = contactForm.querySelector('textarea');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      if (!name || !email || !message) {
        $("contactMsg").textContent = "❌ Fill all fields!";
        return;
      }

    
      firebase.database().ref("contacts").push({
        name,
        email,
        message,
        timestamp: Date.now()
      })
      .then((ref) => {
        console.log("Contact saved with key:", ref.key);
        $("contactMsg").textContent = "✅ Message sent successfully!";
        $("contactMsg").style.color = "#4CAF50";
        contactForm.reset();
      })
      .catch(error => {
        console.error("Error sending message:", error);
        $("contactMsg").textContent = "❌ Error: " + error.message;
        $("contactMsg").style.color = "#f44336";
      });
    });
  }

  
  const appointmentForm = $("appointmentForm");
  if (appointmentForm) {
    let lastAppointmentKey = null;
    const bookBtn = $("bookAppointmentBtn");
    const cancelBtn = $("cancelAppointmentBtn");
    const rescheduleBtn = $("rescheduleAppointmentBtn");

   
    appointmentForm.addEventListener("submit", e => {
      e.preventDefault();

      const name = $("appointmentName").value.trim();
      const email = $("appointmentEmail").value.trim();
      const number = $("appointmentNumber").value.trim();
      const date = $("appointmentDate").value;
      const time = $("appointmentTime").value;

      if (!name || !email || !number || !date || !time) {
        $("appointmentMsg").textContent = "❌ Fill all fields!";
        return;
      }

     
      firebase.database().ref("appointments").push({
        name,
        email,
        number,
        date,
        time,
        status: "Pending",
        timestamp: Date.now()
      })
      .then((ref) => {
        if (ref && ref.key) {
          lastAppointmentKey = ref.key;
          console.log("Appointment saved with key:", lastAppointmentKey);
          $("appointmentMsg").textContent = "✅ Appointment booked!";
          appointmentForm.reset();
          
          if (cancelBtn) cancelBtn.disabled = false;
          if (rescheduleBtn) rescheduleBtn.disabled = false;
        } else {
          throw new Error("Failed to get appointment reference key");
        }
      })
      .catch(error => {
        console.error("Error saving appointment:", error);
        $("appointmentMsg").textContent = "❌ Error: " + error.message;
      });
    });

    
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        if (!lastAppointmentKey) {
          $("appointmentMsg").textContent = "❌ No appointment to cancel!";
          return;
        }

   
        firebase.database().ref("appointments").child(lastAppointmentKey).remove()
          .then(() => {
            console.log("Appointment cancelled:", lastAppointmentKey);
            lastAppointmentKey = null;
            $("appointmentMsg").textContent = "✅ Appointment cancelled!";
            
            if (cancelBtn) cancelBtn.disabled = true;
            if (rescheduleBtn) rescheduleBtn.disabled = true;
          })
          .catch(error => {
            console.error("Error cancelling appointment:", error);
            $("appointmentMsg").textContent = "❌ Error: " + error.message;
          });
      });
    }

    
    if (rescheduleBtn) {
      rescheduleBtn.addEventListener("click", () => {
        if (!lastAppointmentKey) {
          $("appointmentMsg").textContent = "❌ No appointment to reschedule!";
          return;
        }

        const date = $("appointmentDate").value;
        const time = $("appointmentTime").value;

        if (!date || !time) {
          $("appointmentMsg").textContent = "❌ Please select new date and time!";
          return;
        }

     
        firebase.database().ref("appointments").child(lastAppointmentKey).update({
          date,
          time,
          timestamp: Date.now(),
          status: "Rescheduled"
        })
        .then(() => {
          console.log("Appointment rescheduled:", lastAppointmentKey);
          $("appointmentMsg").textContent = "✅ Appointment rescheduled!";
        })
        .catch(error => {
          console.error("Error rescheduling appointment:", error);
          $("appointmentMsg").textContent = "❌ Error: " + error.message;
        });
      });
    }
  }


  const profileForm = $("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", e => {
      e.preventDefault();

      const name = $("studentName").value.trim();
      const email = $("studentEmail").value.trim();
      const number = $("studentNumber").value.trim();
      const contact = $("studentContact").value.trim();
      const course = $("studentCourse").value.trim();
      const year = $("studentYear").value.trim();

      if (!name || !email || !number || !contact || !course || !year) {
        $("profileMsg").textContent = "❌ Fill all fields!";
        return;
      }

     
      firebase.database().ref("students").push({
        name,
        email,
        number,
        contact,
        course,
        year,
        timestamp: Date.now()
      })
      .then((ref) => {
        console.log("Profile saved with key:", ref.key);
        $("profileMsg").textContent = "✅ Profile updated!";
        profileForm.reset();
      })
      .catch(error => {
        console.error("Error saving profile:", error);
        $("profileMsg").textContent = "❌ Error: " + error.message;
      });
    });
  }
});