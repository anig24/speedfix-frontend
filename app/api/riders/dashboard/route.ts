import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";
import { getRideDispatch } from "@/lib/server/rideDispatch";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value: unknown) {
  return normalizeText(value).replace(/\D/g, "").slice(0, 10);
}

function normalizeTimestamp(value: unknown) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return "";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const riderCode = normalizeText(payload.riderCode).toUpperCase();
    const phone = normalizePhone(payload.phone);

    if (!riderCode || !phone) {
      return NextResponse.json(
        { error: "Rider code and phone are required." },
        { status: 400 }
      );
    }

    const snapshot = await getDocs(
      query(
        collection(serverDb, "rideDispatches"),
        where("assignedRiderCode", "==", riderCode)
      )
    );
    const rideIds = snapshot.docs
      .filter((item) => normalizePhone(item.data().assignedRiderPhone) === phone)
      .sort((left, right) => {
        const leftTime =
          normalizeTimestamp(left.data().updatedAt) ||
          normalizeTimestamp(left.data().createdAt);
        const rightTime =
          normalizeTimestamp(right.data().updatedAt) ||
          normalizeTimestamp(right.data().createdAt);

        return new Date(rightTime).getTime() - new Date(leftTime).getTime();
      })
      .map((item) => item.id);

    const rides = (
      await Promise.all(rideIds.map((rideId) => getRideDispatch(rideId, true)))
    ).filter(Boolean);

    return NextResponse.json({
      success: true,
      rider: {
        riderCode,
        phone,
      },
      rides,
    });
  } catch (error) {
    console.error("RIDER_DASHBOARD_ERROR", error);

    return NextResponse.json(
      { error: "Unable to load rider dashboard right now." },
      { status: 500 }
    );
  }
}
