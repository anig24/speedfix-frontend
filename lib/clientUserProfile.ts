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
import { ROLES } from "@/lib/roles";

export type ClientUserProfile = Record<string, unknown> & {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
};

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function inferCompanyRole(email: string) {
  const localPart = email.split("@")[0] || "";

  if (email === "founder@speedfix.co.in" || localPart.includes("founder")) {
    return ROLES.FOUNDER;
  }

  if (localPart.includes("admin")) {
    return "ADMIN";
  }

  if (localPart.includes("hr") || localPart.includes("recruit")) {
    return "HEAD_HR";
  }

  if (localPart.includes("account") || localPart.includes("finance")) {
    return "ACCOUNTS_HEAD";
  }

  if (localPart.includes("audit") || localPart.includes("quality")) {
    return "QUALITY_HEAD";
  }

  if (localPart.includes("agent") || localPart.includes("support")) {
    return "AGENT";
  }

  return ROLES.STAFF;
}

function withAccessDefaults(
  profile: ClientUserProfile,
  emailOverride?: unknown
): ClientUserProfile {
  const email = normalizeEmail(profile.email) || normalizeEmail(emailOverride);

  if (!email.endsWith("@speedfix.co.in")) {
    return {
      ...profile,
      email: email || profile.email || "",
    };
  }

  const role =
    typeof profile.role === "string" && profile.role.trim()
      ? profile.role.trim().toUpperCase()
      : "";
  const shouldInferRole = !role || role === "CUSTOMER" || role === "CONSUMER";
  const nextRole = shouldInferRole ? inferCompanyRole(email) : role;

  return {
    ...profile,
    email,
    role: nextRole,
    employmentStatus: "ACTIVE",
    active: true,
    employeeActive: true,
    employmentActive: true,
  };
}

export function getFallbackUserProfile(user: User): ClientUserProfile {
  return withAccessDefaults({
    id: user.uid,
    name: user.displayName || "SpeedFix User",
    email: user.email || "",
    role: "CUSTOMER",
    employmentStatus: "CUSTOMER",
    active: true,
  }, user.email);
}

export async function getClientUserProfile(user: User) {
  const uidSnapshot = await getDoc(doc(db, "users", user.uid));

  if (uidSnapshot.exists()) {
    return withAccessDefaults({
      id: uidSnapshot.id,
      ...getFallbackUserProfile(user),
      ...uidSnapshot.data(),
      email: normalizeEmail(uidSnapshot.data().email) || user.email || "",
    }, user.email);
  }

  const email = normalizeEmail(user.email);

  if (email) {
    const emailSnapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", email), limit(1))
    ).catch(() => null);
    const emailMatch = emailSnapshot?.docs[0];

    if (emailMatch) {
      return withAccessDefaults({
        id: emailMatch.id,
        ...getFallbackUserProfile(user),
        ...emailMatch.data(),
        email,
      }, user.email);
    }
  }

  return getFallbackUserProfile(user);
}
