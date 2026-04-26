"use client";

import { useEffect, useState } from "react";
import { type User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { canPostCareerRole } from "@/lib/recruiterAccess";

export function useCareerPostingAccess() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [role, setRole] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!active) {
        return;
      }

      setUser(nextUser);

      if (!nextUser) {
        setRole("");
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, "users", nextUser.uid));
        const nextRole =
          typeof snapshot.data()?.role === "string" ? snapshot.data()?.role : "";

        if (!active) {
          return;
        }

        setRole(nextRole);
        setIsAuthorized(canPostCareerRole(nextRole));
      } catch {
        if (!active) {
          return;
        }

        setRole("");
        setIsAuthorized(false);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return {
    user,
    role,
    isAuthorized,
    isLoading,
  };
}
