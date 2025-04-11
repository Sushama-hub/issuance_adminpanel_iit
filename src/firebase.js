import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

//  Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_lSOmn4e-520Soz3HUtmIlfuOyMsKBqY",
  authDomain: "iitbhilai-inventory.firebaseapp.com",
  projectId: "iitbhilai-inventory",
  storageBucket: "iitbhilai-inventory.firebasestorage.app",
  messagingSenderId: "263775373432",
  appId: "1:263775373432:web:a61bc5f06b6e4edef2c58d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export { auth, provider };
