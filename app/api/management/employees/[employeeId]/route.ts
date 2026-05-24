import { NextResponse, type NextRequest } from "next/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";
import {
  authorizeManagementRequest,
  forbiddenManagementResponse,
  normalizeEmployeeUpdatePayload,
  serializeManagementValue,
} from "@/lib/managementBackend";

type EmployeeRouteContext = {
  params: Promise<unknown>;
};

export async function GET(
  request: NextRequest,
  { params }: EmployeeRouteContext
) {
  const actor = await authorizeManagementRequest(request, undefined, "hr");

  if (!actor) {
    return forbiddenManagementResponse();
  }

  const employeeId = getEmployeeId(await params);
  const employeeRef = doc(serverDb, "users", employeeId);
  const snapshot = await getDoc(employeeRef);

  if (!snapshot.exists()) {
    return NextResponse.json({ error: "Employee not found." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    employee: {
      id: snapshot.id,
      ...(serializeManagementValue(snapshot.data()) as Record<string, unknown>),
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: EmployeeRouteContext
) {
  const actor = await authorizeManagementRequest(request, undefined, "hr");

  if (!actor) {
    return forbiddenManagementResponse();
  }

  try {
    const employeeId = getEmployeeId(await params);
    const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const employeeRef = doc(serverDb, "users", employeeId);
    const snapshot = await getDoc(employeeRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Employee not found." }, { status: 404 });
    }

    const current = serializeManagementValue(snapshot.data()) as Record<string, unknown>;
    const normalized = normalizeEmployeeUpdatePayload({
      ...current,
      ...payload,
    });

    if ("error" in normalized) {
      return NextResponse.json({ error: normalized.error }, { status: 400 });
    }

    const nextRecord = {
      ...normalized.record,
      updatedByUid: actor.uid,
      updatedByEmail: actor.email,
      updatedByRole: actor.role,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(employeeRef, nextRecord);

    await addDoc(collection(serverDb, "managementAuditLog"), {
      action: "EMPLOYEE_UPDATED",
      entityType: "users",
      entityId: employeeId,
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
      employee: {
        id: employeeId,
        ...current,
        ...normalized.record,
      },
    });
  } catch (error) {
    console.error("MANAGEMENT_EMPLOYEE_UPDATE_ERROR", error);

    return NextResponse.json(
      { error: "Unable to update employee right now." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: EmployeeRouteContext
) {
  const actor = await authorizeManagementRequest(request, undefined, "hr");

  if (!actor) {
    return forbiddenManagementResponse();
  }

  try {
    const employeeId = getEmployeeId(await params);
    const employeeRef = doc(serverDb, "users", employeeId);
    const snapshot = await getDoc(employeeRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Employee not found." }, { status: 404 });
    }

    const current = serializeManagementValue(snapshot.data()) as Record<string, unknown>;
    await updateDoc(employeeRef, {
      active: false,
      isActive: false,
      employeeActive: false,
      employmentActive: false,
      employmentStatus: "INACTIVE",
      updatedByUid: actor.uid,
      updatedByEmail: actor.email,
      updatedByRole: actor.role,
      updatedAt: serverTimestamp(),
    });

    await addDoc(collection(serverDb, "managementAuditLog"), {
      action: "EMPLOYEE_DEACTIVATED",
      entityType: "users",
      entityId: employeeId,
      actor,
      previous: current,
      createdAt: serverTimestamp(),
    }).catch(() => undefined);

    return NextResponse.json({ success: true, employeeId, status: "INACTIVE" });
  } catch (error) {
    console.error("MANAGEMENT_EMPLOYEE_DELETE_ERROR", error);

    return NextResponse.json(
      { error: "Unable to deactivate employee right now." },
      { status: 500 }
    );
  }
}

function getEmployeeId(params: unknown) {
  return typeof params === "object" && params !== null && "employeeId" in params
    ? String((params as { employeeId?: unknown }).employeeId || "")
    : "";
}
