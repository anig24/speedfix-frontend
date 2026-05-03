import crypto from "crypto";
import { NextResponse } from "next/server";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value: unknown) {
  return normalizeText(value).replace(/\D/g, "").slice(0, 10);
}

async function postToProvider(url: string, payload: Record<string, unknown>) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.DIGILOCKER_API_KEY
        ? { Authorization: `Bearer ${process.env.DIGILOCKER_API_KEY}` }
        : {}),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const action = normalizeText(payload.action);
  const phone = normalizePhone(payload.phone);
  const sessionId =
    normalizeText(payload.sessionId) ||
    `DL-OTP-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  if (!phone) {
    return NextResponse.json(
      { error: "Enter a valid 10-digit mobile number." },
      { status: 400 }
    );
  }

  if (action === "request") {
    const providerUrl = process.env.DIGILOCKER_OTP_REQUEST_URL;

    if (providerUrl) {
      return postToProvider(providerUrl, {
        phone,
        sessionId,
        purpose: "SPEEDFIX_WORKER_KYC",
      });
    }

    return NextResponse.json({
      configured: false,
      status: "CONFIG_REQUIRED",
      sessionId,
      message:
        "Official DigiLocker OTP provider credentials are not configured. Add the provider endpoint to enable immediate OTP verification.",
      requiredEnvironment: [
        "DIGILOCKER_OTP_REQUEST_URL",
        "DIGILOCKER_OTP_VERIFY_URL",
        "DIGILOCKER_API_KEY",
      ],
    });
  }

  if (action === "verify") {
    const otp = normalizeText(payload.otp);
    const providerUrl = process.env.DIGILOCKER_OTP_VERIFY_URL;

    if (!otp || otp.length < 4) {
      return NextResponse.json(
        { error: "Enter the OTP received from DigiLocker." },
        { status: 400 }
      );
    }

    if (providerUrl) {
      return postToProvider(providerUrl, {
        phone,
        otp,
        sessionId,
        purpose: "SPEEDFIX_WORKER_KYC",
      });
    }

    return NextResponse.json(
      {
        configured: false,
        status: "CONFIG_REQUIRED",
        sessionId,
        message:
          "OTP verification cannot be completed until official DigiLocker/API Setu credentials are configured.",
      },
      { status: 501 }
    );
  }

  return NextResponse.json(
    { error: "Unsupported DigiLocker OTP action." },
    { status: 400 }
  );
}
