import { NextResponse, type NextRequest } from "next/server";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";
import {
  authorizeManagementRequest,
  forbiddenManagementResponse,
  normalizeWorkCreatePayload,
  parseListLimit,
  serializeManagementValue,
} from "@/lib/managementBackend";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function matchesSearch(item: Record<string, unknown>, search: string) {
  if (!search) {
    return true;
  }

  return normalizeText(item.searchIndex).toLowerCase().includes(search);
}

export async function GET(request: NextRequest) {
  const actor = await authorizeManagementRequest(request);

  if (!actor) {
    return forbiddenManagementResponse();
  }

  const { searchParams } = request.nextUrl;
  const sectionSlug = normalizeText(searchParams.get("sectionSlug"));
  const subSlug = normalizeText(searchParams.get("subSlug"));
  const status = normalizeText(searchParams.get("status")).toUpperCase();
  const ownerEmail = normalizeText(searchParams.get("ownerEmail")).toLowerCase();
  const search = normalizeText(searchParams.get("q")).toLowerCase();
  const listLimit = parseListLimit(searchParams.get("limit"));

  const constraints = [];

  if (sectionSlug) {
    constraints.push(where("sectionSlug", "==", sectionSlug));
  }

  if (subSlug) {
    constraints.push(where("subSlug", "==", subSlug));
  }

  const workQuery = query(
    collection(serverDb, "corporateWorkflowItems"),
    ...constraints,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(workQuery);
  const items = snapshot.docs
    .map(
      (item): Record<string, unknown> & { id: string } => ({
      id: item.id,
      ...(serializeManagementValue(item.data()) as Record<string, unknown>),
      })
    )
    .filter((item) => (status ? normalizeText(item.status).toUpperCase() === status : true))
    .filter((item) =>
      ownerEmail ? normalizeText(item.ownerEmail).toLowerCase() === ownerEmail : true
    )
    .filter((item) => matchesSearch(item, search))
    .slice(0, listLimit);

  return NextResponse.json({
    success: true,
    count: items.length,
    items,
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const normalized = normalizeWorkCreatePayload(payload);

    if ("error" in normalized) {
      return NextResponse.json({ error: normalized.error }, { status: 400 });
    }

    const actor = await authorizeManagementRequest(request, payload);

    if (!actor) {
      return forbiddenManagementResponse();
    }

    const docRef = await addDoc(collection(serverDb, "corporateWorkflowItems"), {
      ...normalized.record,
      createdByUid: actor.uid,
      createdByEmail: actor.email,
      createdByRole: actor.role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await addDoc(collection(serverDb, "managementAuditLog"), {
      action: "WORK_ITEM_CREATED",
      entityType: "corporateWorkflowItems",
      entityId: docRef.id,
      actor,
      next: normalized.record,
      createdAt: serverTimestamp(),
    }).catch(() => undefined);

    return NextResponse.json(
      {
        success: true,
        item: {
          id: docRef.id,
          ...normalized.record,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("MANAGEMENT_WORK_CREATE_ERROR", error);

    return NextResponse.json(
      { error: "Unable to create management work item right now." },
      { status: 500 }
    );
  }
}
