import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKwXBXYxVTf7_TYme110ao6w0wwBu0DTI",
  authDomain: "naipe-37fe8.firebaseapp.com",
  projectId: "naipe-37fe8",
  storageBucket: "naipe-37fe8.firebasestorage.app",
  messagingSenderId: "40109343455",
  appId: "1:40109343455:web:1e374115369924d2231f6a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function entrarComGoogle() {
  signInWithPopup(auth, provider).catch((err) => console.error("Erro no login:", err));
}

export function observarLogin(callback) {
  onAuthStateChanged(auth, callback);
}
