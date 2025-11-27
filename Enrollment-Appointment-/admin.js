
const firebaseConfig = {
  apiKey: "AIzaSyCvx4pBrQyzjUGRzaHftYxIfrI5VcW0YtA",
  authDomain: "enrollmentappointment.firebaseapp.com",
  databaseURL: "https://enrollmentappointment-default-rtdb.firebaseio.com",
  projectId: "enrollmentappointment",
  storageBucket: "enrollmentappointment.firebasestorage.app",
  messagingSenderId: "1001070153862",
  appId: "1:1001070153862:web:416c41958c1660a5f54107"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();


function loadAppointments() {
  const tbody = document.querySelector("#appointmentsTable tbody");

  database.ref("appointments").on("value", snapshot => {
    tbody.innerHTML = "";

    snapshot.forEach(child => {
      const key = child.key;
      const app = child.val();

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${app.name}</td>
        <td>${app.email}</td>
        <td>${app.number}</td>
        <td>${app.date}</td>
        <td>${app.time}</td>
        <td class="status">${app.status}</td>
        <td>
          <button class="approve">Approve</button>
          <button class="cancel">Cancel</button>
        </td>
      `;
      tbody.appendChild(row);

      row.querySelector(".approve").onclick = () => {
        database.ref("appointments/" + key).update({ status: "Approved" });
      };

      row.querySelector(".cancel").onclick = () => {
        database.ref("appointments/" + key).update({ status: "Cancelled" });
      };
    });
  });
}



function loadUsers() {
  const tbody = document.querySelector("#usersTable tbody");

  database.ref("students").on("value", snapshot => {
    tbody.innerHTML = "";

    snapshot.forEach(child => {
      const user = child.val();

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.student_number || "-"}</td>
        <td>${user.contact}</td>
        <td>${user.year}</td>
      `;
      tbody.appendChild(row);
    });
  });
}

loadAppointments();
loadUsers();
