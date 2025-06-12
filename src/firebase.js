import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { apiRequest } from "./utils/api";

let app, auth, provider;

export const initializeFirebase = async () => {
  if (!app) {
    try {
      // const response = await fetch(
      //   "http://localhost:5000/api/v1/firebase/config"
      // );
      // const firebaseConfig = await response.json();

      const res = await apiRequest.get("/firebase/config");

      const firebaseConfig = res?.data;
      app = initializeApp(firebaseConfig);

      auth = getAuth(app);
      provider = new GoogleAuthProvider();
    } catch (error) {
      console.error(
        "Failed to fetch Firebase config:",
        error.response?.data || error.message
      );
    }
  }
};

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const firebaseSignOut = () => signOut(auth);
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
export { auth, provider };
