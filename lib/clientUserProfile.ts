"use client";

import { type User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ClientUserProfile = Record<string, unknown> & {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
};

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function getFallbackUserProfile(user: User): ClientUserProfile {
  return {
    id: user.uid,
    name: user.displayName || "SpeedFix User",
    email: user.email || "",
    role: "CUSTOMER",
    employmentStatus: "CUSTOMER",
    active: true,
  };
}

export async function getClientUserProfile(user: User) {
  const uidSnapshot = await getDoc(doc(db, "users", user.uid));

  if (uidSnapshot.exists()) {
    return {
      id: uidSnapshot.id,
      ...getFallbackUserProfile(user),
      ...uidSnapshot.data(),
      email: normalizeEmail(uidSnapshot.data().email) || user.email || "",
    };
  }

  const email = normalizeEmail(user.email);

  if (email) {
    const emailSnapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", email), limit(1))
    ).catch(() => null);
    const emailMatch = emailSnapshot?.docs[0];

    if (emailMatch) {
      return {
        id: emailMatch.id,
        ...getFallbackUserProfile(user),
        ...emailMatch.data(),
        email,
      };
    }
  }

  return getFallbackUserProfile(user);
}
