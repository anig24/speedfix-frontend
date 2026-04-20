import { NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";
import { getServiceBySlug, resolveServiceSlug } from "@/lib/serviceCatalog";

const phonePattern = /^[6-9]\d{9}$/;
const pincodePattern = /^\d{6}$/;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCity(city: string) {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildLeadScore({
  preferredDate,
  address,
  issueSummary,
}: {
  preferredDate: string;
  address: string;
  issueSummary: string;
}) {
  let score = 52;

  if (address.length >= 18) {
    score += 10;
  }

  if (issueSummary.length >= 20) {
    score += 8;
  }

  if (preferredDate) {
    const requestedDate = new Date(`${preferredDate}T00:00:00`);
    const currentDate = new Date();
    const daysUntilVisit = Math.ceil(
      (requestedDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (daysUntilVisit <= 1) {
      score += 15;
    } else if (daysUntilVisit <= 3) {
      score += 7;
    }
  }

  return Math.min(score, 95);
}

function derivePriority(preferredDate: string) {
  if (!preferredDate) {
    return "STANDARD";
  }

  const requestedDate = new Date(`${preferredDate}T00:00:00`);
  const currentDate = new Date();
  const daysUntilVisit = Math.ceil(
    (requestedDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000)
  );

  return daysUntilVisit <= 1 ? "HIGH" : "STANDARD";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const serviceSlug = resolveServiceSlug(normalizeText(payload.service));
    const name = normalizeText(payload.name);
    const phone = normalizeText(payload.phone);
    const city = normalizeText(payload.city);
    const pincode = normalizeText(payload.pincode);
    const address = normalizeText(payload.address);
    const preferredDate = normalizeText(payload.preferredDate);
    const preferredSlot = normalizeText(payload.preferredSlot);
    const propertyType = normalizeText(payload.propertyType) || "Apartment";
    const issueSummary = normalizeText(payload.issueSummary);

    const service = getServiceBySlug(serviceSlug);

    if (!service) {
      return NextResponse.json(
        { error: "Please choose a valid service." },
        { status: 400 }
      );
    }

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!phonePattern.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10 digit mobile number." },
        { status: 400 }
      );
    }

    if (!city || city.length < 2) {
      return NextResponse.json(
        { error: "Please enter your city." },
        { status: 400 }
      );
    }

    if (!pincodePattern.test(pincode)) {
      return NextResponse.json(
        { error: "Please enter a valid 6 digit pincode." },
        { status: 400 }
      );
    }

    if (!address || address.length < 12) {
      return NextResponse.json(
        { error: "Please add a complete service address." },
        { status: 400 }
      );
    }

    const leadScore = buildLeadScore({
      preferredDate,
      address,
      issueSummary,
    });

    const bookingRecord = {
      customerId: `guest-${phone}`,
      customerName: name,
      customerPhone: phone,
      serviceId: service.slug,
      serviceName: service.name,
      cityId: normalizeCity(city),
      cityLabel: city,
      pincode,
      address,
      propertyType,
      issueSummary: issueSummary || service.tagline,
      preferredDate: preferredDate || null,
      preferredSlot: preferredSlot || "Flexible",
      status: "PENDING",
      leadStage: "NEW",
      priority: derivePriority(preferredDate),
      leadScore,
      source: "homepage",
      channel: "web",
      amount: service.basePrice,
      estimatedAmount: service.basePrice,
      responseTime: service.responseTime,
      searchIndex: `${service.name} ${city} ${pincode} ${name}`.toLowerCase(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(serverDb, "bookings"), bookingRecord);

    return NextResponse.json({
      success: true,
      bookingId: docRef.id,
      status: bookingRecord.status,
      serviceName: service.name,
    });
  } catch (error) {
    console.error("SERVICE_REQUEST_ERROR", error);

    return NextResponse.json(
      { error: "Unable to create your request right now." },
      { status: 500 }
    );
  }
}
