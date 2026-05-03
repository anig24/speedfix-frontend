import crypto from "crypto";
import { NextResponse } from "next/server";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value: unknown) {
  return normalizeText(value).replace(/\D/g, "").slice(0, 10);
}

function normalizeArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => normalizeText(item)).filter(Boolean);
}

function hashSensitive(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function maskLast4(value: string) {
  const last4 = value.slice(-4);
  return last4 ? `****${last4}` : "";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const profile = payload.profile || {};
    const bank = payload.bank || {};
    const kyc = payload.kyc || {};
    const location = payload.location || {};

    const fullName = normalizeText(profile.fullName);
    const phone = normalizePhone(profile.phone);
    const city = normalizeText(profile.city);
    const primaryService = normalizeText(profile.primaryService);
    const services = normalizeArray(profile.services);
    const aadhaarConsent = Boolean(kyc.aadhaarConsent);
    const panConsent = Boolean(kyc.panConsent);
    const payoutConsent = Boolean(bank.payoutConsent);
    const bankName = normalizeText(bank.bankName);
    const accountNumber = normalizeText(bank.accountNumber).replace(/\s/g, "");
    const accountHolderName = normalizeText(bank.accountHolderName);
    const ifsc = normalizeText(bank.ifsc).toUpperCase();
    const photoDataUrl = normalizeText(payload.photoDataUrl);

    if (!fullName || !phone || !city || !primaryService) {
      return NextResponse.json(
        { error: "Complete worker name, phone, city, and primary service." },
        { status: 400 }
      );
    }

    if (!aadhaarConsent || !panConsent) {
      return NextResponse.json(
        { error: "Aadhaar and PAN consent are required for worker KYC." },
        { status: 400 }
      );
    }

    if (!bankName || !accountHolderName || !accountNumber || !ifsc || !payoutConsent) {
      return NextResponse.json(
        { error: "Complete bank details and payout consent." },
        { status: 400 }
      );
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      return NextResponse.json(
        { error: "Enter a valid IFSC before submitting." },
        { status: 400 }
      );
    }

    const applicationRef = doc(collection(serverDb, "workerApplications"));
    const workerRef = doc(collection(serverDb, "workers"));
    const workerCode = `SFX-WKR-${applicationRef.id.slice(0, 8).toUpperCase()}`;
    const referenceNumber = `SFX-WREF-${applicationRef.id
      .slice(-8)
      .toUpperCase()}`;
    const coordinates =
      typeof location.latitude === "number" && typeof location.longitude === "number"
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
          }
        : null;

    const safePhotoDataUrl =
      photoDataUrl && photoDataUrl.length <= 450000 ? photoDataUrl : "";
    const digilockerStatus = normalizeText(kyc.digilockerStatus).toUpperCase();
    const otpVerified = Boolean(kyc.otpVerified);
    const kycVerified =
      otpVerified &&
      aadhaarConsent &&
      panConsent &&
      (digilockerStatus === "VERIFIED" || digilockerStatus === "READY");
    const bankRecord = {
      bankName,
      accountHolderName,
      accountNumberMasked: maskLast4(accountNumber),
      accountNumberHash: hashSensitive(accountNumber),
      ifsc,
      branch: normalizeText(bank.branch) || null,
      city: normalizeText(bank.city) || null,
      state: normalizeText(bank.state) || null,
      payoutConsent,
      verificationStatus: "IFSC_VALIDATED_PENDING_ACCOUNT_VERIFICATION",
    };

    const applicationRecord = {
      applicationId: applicationRef.id,
      workerId: workerRef.id,
      workerCode,
      referenceNumber,
      fullName,
      phone,
      email: normalizeText(profile.email) || null,
      city,
      service: primaryService,
      services: services.length ? services : [primaryService],
      experienceYears: normalizeText(profile.experienceYears) || null,
      languages: normalizeText(profile.languages) || null,
      verificationStatus: kycVerified ? "VERIFIED" : "PENDING_REVIEW",
      onboardingStatus: kycVerified ? "VERIFIED_READY" : "SUBMITTED",
      kyc: {
        provider: "DIGILOCKER",
        status: kycVerified ? "VERIFIED" : "PENDING_PROVIDER_VERIFICATION",
        verificationSessionId: normalizeText(kyc.verificationSessionId) || null,
        aadhaarConsent,
        panConsent,
        otpVerified,
        maskedAadhaar: normalizeText(kyc.maskedAadhaar) || null,
        panHash: normalizeText(kyc.panNumber)
          ? hashSensitive(normalizeText(kyc.panNumber).toUpperCase())
          : null,
        panLast4: normalizeText(kyc.panNumber).slice(-4).toUpperCase() || null,
      },
      bank: bankRecord,
      salaryPayout: {
        ...bankRecord,
        payoutPurpose: "WORKER_SALARY_RELEASE",
        payoutStatus: "READY_FOR_FINANCE_REVIEW",
        releaseMethod: "BANK_TRANSFER",
      },
      photo: {
        captured: Boolean(safePhotoDataUrl),
        dataUrl: safePhotoDataUrl || null,
        oversized: Boolean(photoDataUrl && !safePhotoDataUrl),
      },
      liveCoordinates: coordinates,
      liveLocationLabel:
        normalizeText(location.label) || normalizeText(location.city) || city,
      currentArea: normalizeText(location.label) || city,
      available: kycVerified,
      active: kycVerified,
      verified: kycVerified,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await Promise.all([
      setDoc(applicationRef, applicationRecord),
      setDoc(workerRef, {
        ...applicationRecord,
        applicationId: applicationRef.id,
        id: workerRef.id,
        uid: null,
        rating: null,
        currentBookingId: null,
      }),
    ]);

    return NextResponse.json({
      success: true,
      applicationId: applicationRef.id,
      workerId: workerRef.id,
      workerCode,
      referenceNumber,
      verificationStatus: kycVerified ? "VERIFIED" : "PENDING_REVIEW",
    });
  } catch (error) {
    console.error("WORKER_APPLICATION_ERROR", error);

    return NextResponse.json(
      { error: "Unable to submit worker application right now." },
      { status: 500 }
    );
  }
}
