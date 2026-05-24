import { NextResponse, type NextRequest } from "next/server";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";
import {
  authorizeManagementRequest,
  buildWorkSearchIndex,
  forbiddenManagementResponse,
  normalizeWorkUpdatePayload,
  serializeManagementValue,
} from "@/lib/managementBackend";

type WorkRouteContext = {
  params: Promise<unknown>;
};

export async function GET(request: NextRequest, { params }: WorkRouteContext) {
  const actor = await authorizeManagementRequest(request);

  if (!actor) {
    return forbiddenManagementResponse();
  }

  const workId = getWorkId(await params);
  const workRef = doc(serverDb, "corporateWorkflowItems", workId);
  const snapshot = await getDoc(workRef);

  if (!snapshot.exists()) {
    return NextResponse.json({ error: "Work item not found." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    item: {
      id: snapshot.id,
      ...(serializeManagementValue(snapshot.data()) as Record<string, unknown>),
    },
  });
}

export async function PATCH(request: NextRequest, { params }: WorkRouteContext) {
  const actor = await authorizeManagementRequest(request);

  if (!actor) {
    return forbiddenManagementResponse();
  }

  try {
    const workId = getWorkId(await params);
    const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const workRef = doc(serverDb, "corporateWorkflowItems", workId);
    const snapshot = await getDoc(workRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Work item not found." }, { status: 404 });
    }

    const current = serializeManagementValue(snapshot.data()) as Record<string, unknown>;
    const normalized = normalizeWorkUpdatePayload({
      ...current,
      ...payload,
    });

    if ("error" in normalized) {
      return NextResponse.json({ error: normalized.error }, { status: 400 });
    }

    const nextRecord = {
      ...normalized.record,
      searchIndex: buildWorkSearchIndex({
        ...current,
        ...normalized.record,
      }),
      updatedByUid: actor.uid,
      updatedByEmail: actor.email,
      updatedByRole: actor.role,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(workRef, nextRecord);

    await addDoc(collection(serverDb, "managementAuditLog"), {
      action: "WORK_ITEM_UPDATED",
      entityType: "corporateWorkflowItems",
      entityId: workId,
      actor,
      previous: current,
      next: serializeManagementValue({
        ...current,
        ...normalized.record,
      }),
      createdAt: serverTimestamp(),
    }).catch(() => undefined);

    return NextResponse.json({
      success: true,
      item: {
        id: workId,
        ...current,
        ...normalized.record,
      },
    });
  } catch (error) {
    console.error("MANAGEMENT_WORK_UPDATE_ERROR", error);

    return NextResponse.json(
      { error: "Unable to update management work item right now." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: WorkRouteContext) {
  const actor = await authorizeManagementRequest(request);

  if (!actor) {
    return forbiddenManagementResponse();
  }

  try {
    const workId = getWorkId(await params);
    const workRef = doc(serverDb, "corporateWorkflowItems", workId);
    const snapshot = await getDoc(workRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Work item not found." }, { status: 404 });
    }

    const previous = serializeManagementValue(snapshot.data());
    await deleteDoc(workRef);

    await addDoc(collection(serverDb, "managementAuditLog"), {
      action: "WORK_ITEM_DELETED",
      entityType: "corporateWorkflowItems",
      entityId: workId,
      actor,
      previous,
      createdAt: serverTimestamp(),
    }).catch(() => undefined);

    return NextResponse.json({ success: true, workId });
  } catch (error) {
    console.error("MANAGEMENT_WORK_DELETE_ERROR", error);

    return NextResponse.json(
      { error: "Unable to delete management work item right now." },
      { status: 500 }
    );
  }
}

function getWorkId(params: unknown) {
  return typeof params === "object" && params !== null && "workId" in params
    ? String((params as { workId?: unknown }).workId || "")
    : "";
}
