// lib/firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔥 Your Firebase config (from console)
const firebaseConfig = {
  apiKey: "AIzaSyC0yJ1rKs-Lu8QOJXTUjoUiWrLHWba9j_4",
  authDomain: "speedfix-2003.firebaseapp.com",
  projectId: "speedfix-2003",
  storageBucket: "speedfix-2003.firebasestorage.app",
  messagingSenderId: "856240616364",
  appId: "1:856240616364:web:f5794dcdedf61808b04009",
};

// ✅ Prevent re-initialization in Next.js
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };