import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
    }

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const role = docSnap.data().role;

        if (window.location.pathname.includes("admin") && role !== "admin") {
            alert("Access Denied: Admins only.");
            window.location.href = "studentDashboard.html";
        }

    
        if (window.location.pathname.includes("student") && role !== "student") {
            alert("Access Denied: Students only.");
            window.location.href = "adminDashboard.html";
        }
    }
});
