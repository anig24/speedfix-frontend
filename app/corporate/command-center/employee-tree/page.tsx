"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getClientUserProfile } from "@/lib/clientUserProfile";
import { normalizeRole } from "@/lib/portalAccess";
import { EmployeeDirectoryContent } from "@/app/components/employee/EmployeeHierarchyPanel";

export default function EmployeeTreePage() {
  const [viewer, setViewer] = useState({
    email: "",
    role: "EMPLOYEE",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const profile = await getClientUserProfile(user);

      setViewer({
        email:
          typeof profile.email === "string" && profile.email.trim()
            ? profile.email
            : user.email || "",
        role: normalizeRole(profile.role) || "EMPLOYEE",
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] min-h-[720px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <EmployeeDirectoryContent
        currentEmail={viewer.email}
        currentRole={viewer.role}
      />
    </div>
  );
}
