import { NextResponse, type NextRequest } from "next/server";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";
import {
  authorizeManagementRequest,
  createFirebaseEmployeeAuth,
  forbiddenManagementResponse,
  normalizeEmployeeCreatePayload,
  parseListLimit,
  serializeManagementValue,
} from "@/lib/managementBackend";
import { hasCompanyEmail } from "@/lib/portalAccess";

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
  const actor = await authorizeManagementRequest(request, undefined, "hr");

  if (!actor) {
    return forbiddenManagementResponse();
  }

  const { searchParams } = request.nextUrl;
  const role = normalizeText(searchParams.get("role")).toUpperCase();
  const department = normalizeText(searchParams.get("department")).toLowerCase();
  const city = normalizeText(searchParams.get("city")).toLowerCase();
  const search = normalizeText(searchParams.get("q")).toLowerCase();
  const listLimit = parseListLimit(searchParams.get("limit"));

  const employeesQuery = query(collection(serverDb, "users"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(employeesQuery);
  const employees = snapshot.docs
    .map(
      (item): Record<string, unknown> & { id: string } => ({
      id: item.id,
      ...(serializeManagementValue(item.data()) as Record<string, unknown>),
      })
    )
    .filter((employee) => hasCompanyEmail(employee.email))
    .filter((employee) =>
      role ? normalizeText(employee.role).toUpperCase() === role : true
    )
    .filter((employee) =>
      department
        ? normalizeText(employee.department).toLowerCase() === department
        : true
    )
    .filter((employee) =>
      city ? normalizeText(employee.city).toLowerCase() === city : true
    )
    .filter((employee) => matchesSearch(employee, search))
    .slice(0, listLimit);

  return NextResponse.json({
    success: true,
    count: employees.length,
    employees,
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const normalized = normalizeEmployeeCreatePayload(payload);

    if ("error" in normalized) {
      return NextResponse.json({ error: normalized.error }, { status: 400 });
    }

    const actor = await authorizeManagementRequest(request, payload, "hr");

    if (!actor) {
      return forbiddenManagementResponse();
    }

    const employeeUid =
      normalized.uid ||
      (await createFirebaseEmployeeAuth({
        email: normalized.record.email,
        password: normalized.temporaryPassword,
      }));

    const employeeRecord = {
      ...normalized.record,
      createdByUid: actor.uid,
      createdByEmail: actor.email,
      createdByRole: actor.role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(serverDb, "users", employeeUid), employeeRecord, { merge: true });

    await addDoc(collection(serverDb, "employeeAccessLog"), {
      action: "EMPLOYEE_ACCESS_CREATED",
      employeeUid,
      employeeEmail: employeeRecord.email,
      employeeRole: employeeRecord.role,
      workspaceAccess: employeeRecord.workspaceAccess,
      createdByUid: actor.uid,
      createdByEmail: actor.email,
      createdAt: serverTimestamp(),
    }).catch(() => undefined);

    await addDoc(collection(serverDb, "managementAuditLog"), {
      action: "EMPLOYEE_CREATED",
      entityType: "users",
      entityId: employeeUid,
      actor,
      next: normalized.record,
      createdAt: serverTimestamp(),
    }).catch(() => undefined);

    return NextResponse.json(
      {
        success: true,
        temporaryPassword: normalized.generatedTemporaryPassword
          ? normalized.temporaryPassword
          : undefined,
        employee: {
          id: employeeUid,
          ...normalized.record,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("MANAGEMENT_EMPLOYEE_CREATE_ERROR", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create employee access right now.",
      },
      { status: 500 }
    );
  }
}
