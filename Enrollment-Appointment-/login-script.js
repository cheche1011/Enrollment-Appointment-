
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
const db = firebase.database();


function randCaptcha(len=5){
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s="";
  for(let i=0;i<len;i++) s += chars.charAt(Math.floor(Math.random()*chars.length));
  return s;
}

let inCaptchaText = randCaptcha();
let upCaptchaText = randCaptcha();

document.getElementById("inCaptcha").textContent = inCaptchaText;
document.getElementById("upCaptcha").textContent = upCaptchaText;


document.getElementById("signUpForm").addEventListener("submit", e=>{
  e.preventDefault();
  const username = document.getElementById("upUsername").value.trim();
  const email = document.getElementById("upEmail").value.trim();
  const password = document.getElementById("upPassword").value;
  const role = document.getElementById("upRole").value;
  const captchaInput = document.getElementById("upCaptchaInput").value.trim().toUpperCase();

  if(captchaInput !== upCaptchaText){
    document.getElementById("upMsg").textContent = "Invalid captcha";
    upCaptchaText = randCaptcha();
    document.getElementById("upCaptcha").textContent = upCaptchaText;
    return;
  }

  db.ref("users").orderByChild("username").equalTo(username).once("value", snapshot=>{
    if(snapshot.exists()){
      document.getElementById("upMsg").textContent = "Username already taken";
    } else {
      db.ref("users").push({ username, email, password, role });
      document.getElementById("upMsg").textContent = "Account created! You can now sign in.";
      document.getElementById("signUpForm").reset();
      upCaptchaText = randCaptcha();
      document.getElementById("upCaptcha").textContent = upCaptchaText;
    }
  });
});


document.getElementById("signInForm").addEventListener("submit", e=>{
  e.preventDefault();
  const username = document.getElementById("inUsername").value.trim();
  const password = document.getElementById("inPassword").value;
  const selectedRole = document.getElementById("userType").value;
  const captchaInput = document.getElementById("inCaptchaInput").value.trim().toUpperCase();

  if(captchaInput !== inCaptchaText){
    document.getElementById("inMsg").textContent = "Invalid captcha";
    inCaptchaText = randCaptcha();
    document.getElementById("inCaptcha").textContent = inCaptchaText;
    return;
  }

  db.ref("users").orderByChild("username").equalTo(username).once("value", snapshot=>{
    if(!snapshot.exists()){
      document.getElementById("inMsg").textContent = "Wrong username or password";
      return;
    }
    let foundUser;
    snapshot.forEach(child=>{
      const data = child.val();
      if(data.password === password){
        foundUser = data;
      }
    });

    if(!foundUser){
      document.getElementById("inMsg").textContent = "Wrong username or password";
      return;
    }

    if(foundUser.role !== selectedRole){
      document.getElementById("inMsg").textContent = `This user is a ${foundUser.role}`;
      return;
    }

    
    localStorage.setItem("loggedInUser", username);
    if(foundUser.role === "student") window.location.href = "student-dashboard.html";
    else window.location.href = "admin-dashboard.html";
  });
});


document.getElementById("logoutBtn")?.addEventListener("click", ()=>{
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
});
