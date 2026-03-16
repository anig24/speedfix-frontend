"use client";
import { useEffect } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function TechnicianPage() {
  useEffect(() => {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;

      set(ref(db, "technicians/tech1"), {
        lat: latitude,
        lng: longitude,
        updatedAt: Date.now(),
      });
    });
  }, []);

  return <h1>Tracking Enabled</h1>;
}