"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserData } from "@/lib/getUserData";

export function useCurrentUser() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const data = await getUserData(user.uid);
      setUserData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { userData, loading };
}