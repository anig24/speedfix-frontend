import crypto from "crypto";
import { NextResponse } from "next/server";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const phone = normalizeText(payload.phone);
  const fullName = normalizeText(payload.fullName);

  if (!phone || !fullName) {
    return NextResponse.json(
      { error: "Worker name and phone are required before DigiLocker KYC." },
      { status: 400 }
    );
  }

  const authUrl = process.env.DIGILOCKER_AUTH_URL;
  const clientId = process.env.DIGILOCKER_CLIENT_ID;
  const redirectUri = process.env.DIGILOCKER_REDIRECT_URI;
  const scope = process.env.DIGILOCKER_SCOPE || "aadhaar pan";
  const state = crypto.randomBytes(18).toString("hex");

  if (!authUrl || !clientId || !redirectUri) {
    return NextResponse.json({
      configured: false,
      status: "CONFIG_REQUIRED",
      verificationSessionId: `DL-${Date.now()}-${state.slice(0, 6).toUpperCase()}`,
      message:
        "DigiLocker/API Setu credentials are not configured yet. The worker can submit consent and the application will stay pending official verification.",
      requiredEnvironment: [
        "DIGILOCKER_AUTH_URL",
        "DIGILOCKER_CLIENT_ID",
        "DIGILOCKER_REDIRECT_URI",
      ],
    });
  }

  const url = new URL(authUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", state);

  return NextResponse.json({
    configured: true,
    status: "LOGIN_STARTED",
    verificationSessionId: `DL-${Date.now()}-${state.slice(0, 6).toUpperCase()}`,
    redirectUrl: url.toString(),
  });
}
