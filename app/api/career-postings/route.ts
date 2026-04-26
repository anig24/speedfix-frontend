import { NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";
import { canPostCareerRole, normalizeRole } from "@/lib/recruiterAccess";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const companyName = normalizeText(payload.companyName);
    const recruiterName = normalizeText(payload.recruiterName);
    const workEmail = normalizeText(payload.workEmail);
    const roleTitle = normalizeText(payload.roleTitle);
    const location = normalizeText(payload.location);
    const employmentType = normalizeText(payload.employmentType);
    const salaryRange = normalizeText(payload.salaryRange);
    const description = normalizeText(payload.description);
    const posterUid = normalizeText(payload.posterUid);
    const posterEmail = normalizeText(payload.posterEmail);
    const posterRole = normalizeRole(payload.posterRole);

    if (
      !companyName ||
      !recruiterName ||
      !workEmail ||
      !roleTitle ||
      !location ||
      !description
    ) {
      return NextResponse.json(
        { error: "Please complete all required job posting fields." },
        { status: 400 }
      );
    }

    if (!canPostCareerRole(posterRole)) {
      return NextResponse.json(
        { error: "Only HR or recruiter accounts can post job openings." },
        { status: 403 }
      );
    }

    const docRef = await addDoc(collection(serverDb, "careerPostings"), {
      companyName,
      recruiterName,
      workEmail,
      roleTitle,
      location,
      employmentType: employmentType || "Full-time",
      salaryRange: salaryRange || "Not specified",
      description,
      source: "careers-posting-page",
      postedByUid: posterUid || null,
      postedByEmail: posterEmail || null,
      postedByRole: posterRole,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      postingId: docRef.id,
    });
  } catch (error) {
    console.error("CAREER_POSTING_ERROR", error);

    return NextResponse.json(
      { error: "Unable to save the job posting right now." },
      { status: 500 }
    );
  }
}
