
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  get,
  child
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyCvx4pBrQyzjUGRzaHftYxIfrI5VcW0YtA",
  authDomain: "enrollmentappointment.firebaseapp.com",
  databaseURL: "https://enrollmentappointment-default-rtdb.firebaseio.com",
  projectId: "enrollmentappointment",
  storageBucket: "enrollmentappointment.firebasestorage.app",
  messagingSenderId: "1001070153862",
  appId: "1:1001070153862:web:416c41958c1660a5f54107"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


const $ = id => document.getElementById(id);

function randCaptcha(len = 5){
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({length: len}, () => chars[Math.floor(Math.random()*chars.length)]).join("");
}


const showSignIn = $('showSignIn');
const showSignUp = $('showSignUp');
const signInForm = $('signInForm');
const signUpForm = $('signUpForm');
const inCaptchaBox = $('inCaptcha');
const upCaptchaBox = $('upCaptcha');
const inRefresh = $('inRefresh');
const upRefresh = $('upRefresh');
const inMsg = $('inMsg');
const upMsg = $('upMsg');


let inCaptchaText = randCaptcha();
let upCaptchaText = randCaptcha();
inCaptchaBox.textContent = inCaptchaText;
upCaptchaBox.textContent = upCaptchaText;


function showPanel(which){
  if(which === "in"){
    showSignIn.classList.add("active");
    showSignUp.classList.remove("active");
    signInForm.classList.add("active");
    signUpForm.classList.remove("active");
  } else {
    showSignUp.classList.add("active");
    showSignIn.classList.remove("active");
    signUpForm.classList.add("active");
    signInForm.classList.remove("active");
  }
  inMsg.textContent = "";
  upMsg.textContent = "";
}

showSignIn.onclick = () => showPanel("in");
showSignUp.onclick = () => showPanel("up");


inRefresh.onclick = () => {
  inCaptchaText = randCaptcha();
  inCaptchaBox.textContent = inCaptchaText;
};
upRefresh.onclick = () => {
  upCaptchaText = randCaptcha();
  upCaptchaBox.textContent = upCaptchaText;
};


signUpForm.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const username = $('upUsername').value.trim();
  const email = $('upEmail').value.trim();
  const password = $('upPassword').value;
  const captchaInput = $('upCaptchaInput').value.trim().toUpperCase();

  if(captchaInput !== upCaptchaText){
    upMsg.textContent = "Invalid captcha.";
    upMsg.style.color = "red";
    upCaptchaText = randCaptcha();
    upCaptchaBox.textContent = upCaptchaText;
    return;
  }

  try {

    const dbRef = ref(db);
    const usernameSnap = await get(child(dbRef, `usernames/${username}`));

    if(usernameSnap.exists()){
      upMsg.textContent = "Username already taken!";
      upMsg.style.color = "red";
      return;
    }

    
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    
    await set(ref(db, "users/" + user.uid), {
      username: username,
      email: email,
      role: "student"
    });

    
    await set(ref(db, `usernames/${username}`), user.uid);

    upMsg.textContent = "Account created successfully!";
    upMsg.style.color = "#7CFC7C";

    signUpForm.reset();
    upCaptchaText = randCaptcha();
    upCaptchaBox.textContent = upCaptchaText;

    setTimeout(()=> showPanel("in"), 800);

  } catch(err){
    upMsg.textContent = err.message;
    upMsg.style.color = "red";
  }
});


signInForm.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const email = $('inEmail').value.trim();
  const password = $('inPassword').value;
  const captchaInput = $('inCaptchaInput').value.trim().toUpperCase();
  const selectedRole = $('userType').value;

  if(captchaInput !== inCaptchaText){
    inMsg.textContent = "Invalid captcha.";
    inMsg.style.color = "red";
    inCaptchaText = randCaptcha();
    inCaptchaBox.textContent = inCaptchaText;
    return;
  }

  if(!selectedRole){
    inMsg.textContent = "Please select user type.";
    inMsg.style.color = "red";
    return;
  }

  try {
    
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = cred.user;

  
    const userSnap = await get(ref(db, "users/" + user.uid));

    if(!userSnap.exists()){
      inMsg.textContent = "User data missing in database.";
      inMsg.style.color = "red";
      return;
    }

    const data = userSnap.val();

    if(data.role !== selectedRole){
      inMsg.textContent = "Role does not match!";
      inMsg.style.color = "red";
      return;
    }

    
    localStorage.setItem("loggedInUser", JSON.stringify({
      uid: user.uid,
      role: data.role
    }));

    
    if(data.role === "admin") window.location.href = "admin-dashboard.html";
    else window.location.href = "student-dashboard.html";

  } catch(err){
    inMsg.textContent = err.message;
    inMsg.style.color = "red";
  }
});
