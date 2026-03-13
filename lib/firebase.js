import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0yJ1rKs-Lu8QOJXTUjoUiWrLHWba9j_4",
  authDomain: "speedfix-2003.firebaseapp.com",
  projectId: "speedfix-2003",
  storageBucket: "speedfix-2003.firebasestorage.app",
  messagingSenderId: "856240616364",
  appId: "1:856240616364:web:f5794dcdedf61808b04009"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);