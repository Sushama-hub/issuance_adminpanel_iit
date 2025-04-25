import { initializeApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"

let app, auth, provider

export const initializeFirebase = async () => {
  if (!app) {
    const response = await fetch("http://localhost:5000/api/v1/firebase/config")
    const firebaseConfig = await response.json()
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    provider = new GoogleAuthProvider()
  }
}

export const signInWithGoogle = () => signInWithPopup(auth, provider)
export const firebaseSignOut = () => signOut(auth)
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback)
export { auth, provider }
