import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * 🔥 Get full employee data using Firebase UID
 */
export async function getUserData(uid) {
  try {
    const q = query(
      collection(db, "employees"),
      where("uid", "==", uid)
    );

    const snap = await getDocs(q);

    if (snap.empty) return null;

    const userDoc = snap.docs[0];

    return {
      id: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error) {
    console.error("getUserData error:", error);
    return null;
  }
}