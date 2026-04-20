import { NextResponse } from "next/server";
import { CORPORATE_SESSION_COOKIE } from "@/lib/corporateAuth";

const SESSION_MAX_AGE = 60 * 60 * 12;

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(CORPORATE_SESSION_COOKIE, "active", {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(CORPORATE_SESSION_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
