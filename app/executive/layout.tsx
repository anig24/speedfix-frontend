"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ================================
   TYPES
================================ */

interface Employee {
  id: string;
  departmentId?: string;
  status?: string;
  salary?: number;
}

interface Job {
  id: string;
  status?: string;
  revenue?: number;
  createdAt?: Timestamp;
}

interface SupportTicket {
  id: string;
  status?: string;
  priority?: string;
  createdAt?: Timestamp;
}

interface Payroll {
  id: string;
  amount?: number;
  month?: string;
  year?: number;
}

interface Booking {
  id: string;
  totalAmount?: number;
  createdAt?: Timestamp;
}

interface AuditLog {
  id: string;
  action?: string;
  performedBy?: string;
  timestamp?: Timestamp;
}

interface Department {
  id: string;
  departmentName?: string;
}

/* ================================
   COMPONENT
================================ */

export default function FounderExecutiveControl() {
  /* ================================
     STATE
  ================================= */

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [support, setSupport] = useState<SupportTicket[]>([]);
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [auditFilter, setAuditFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("ALL");

  /* ================================
     REAL-TIME FIRESTORE LISTENERS
  ================================= */

  useEffect(() => {
    const unsubscribers: any[] = [];

    unsubscribers.push(
      onSnapshot(collection(db, "employees"), (snap) => {
        setEmployees(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
    );

    unsubscribers.push(
      onSnapshot(collection(db, "jobs"), (snap) => {
        setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
    );

    unsubscribers.push(
      onSnapshot(collection(db, "supportTickets"), (snap) => {
        setSupport(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
    );

    unsubscribers.push(
      onSnapshot(collection(db, "payroll"), (snap) => {
        setPayroll(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
    );

    unsubscribers.push(
      onSnapshot(collection(db, "bookings"), (snap) => {
        setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
    );

    unsubscribers.push(
      onSnapshot(
        query(collection(db, "auditLogs"), orderBy("timestamp", "desc"), limit(50)),
        (snap) => {
          setAudits(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      )
    );

    unsubscribers.push(
      onSnapshot(collection(db, "departments"), (snap) => {
        setDepartments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
    );

    setLoading(false);

    return () => unsubscribers.forEach((u) => u());
  }, []);

  /* ================================
     AGGREGATIONS
  ================================= */

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (e) => e.status === "active"
  ).length;

  const activeJobs = jobs.filter((j) => j.status === "ACTIVE").length;

  const completedJobs = jobs.filter(
    (j) => j.status === "COMPLETED"
  ).length;

  const totalRevenue = useMemo(() => {
    return bookings.reduce(
      (acc, b) => acc + (b.totalAmount || 0),
      0
    );
  }, [bookings]);

  const totalPayroll = useMemo(() => {
    return payroll.reduce(
      (acc, p) => acc + (p.amount || 0),
      0
    );
  }, [payroll]);

  const departmentSummary = useMemo(() => {
    return departments.map((dept) => {
      const count = employees.filter(
        (e) => e.departmentId === dept.id
      ).length;
      return {
        name: dept.departmentName,
        count,
      };
    });
  }, [employees, departments]);

  const monthlyRevenue = useMemo(() => {
    const map: Record<string, number> = {};

    bookings.forEach((b) => {
      if (!b.createdAt) return;
      const date = b.createdAt.toDate();
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      map[key] = (map[key] || 0) + (b.totalAmount || 0);
    });

    return Object.entries(map).map(([month, total]) => ({
      month,
      total,
    }));
  }, [bookings]);

  const filteredAudits = useMemo(() => {
    return audits.filter((a) =>
      a.action?.toLowerCase().includes(auditFilter.toLowerCase())
    );
  }, [audits, auditFilter]);

  /* ================================
     ALERT ENGINE
  ================================= */

  const alerts = useMemo(() => {
    const list: string[] = [];

    if (activeJobs > 100) {
      list.push("High operational load detected.");
    }

    if (support.filter((s) => s.status !== "CLOSED").length > 20) {
      list.push("Support backlog growing.");
    }

    if (totalPayroll > totalRevenue) {
      list.push("Payroll exceeding revenue.");
    }

    return list;
  }, [activeJobs, support, totalPayroll, totalRevenue]);

  /* ================================
     UI
  ================================= */

  if (loading) return <div className="p-10">Loading Executive Control...</div>;

  return (
    <div className="space-y-14">

      {/* KPI SECTION */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          Executive KPIs
        </h2>

        <div className="grid grid-cols-4 gap-6">
          <Card title="Total Employees" value={totalEmployees} />
          <Card title="Active Employees" value={activeEmployees} />
          <Card title="Active Jobs" value={activeJobs} />
          <Card title="Completed Jobs" value={completedJobs} />
          <Card title="Total Revenue" value={`₹${totalRevenue}`} />
          <Card title="Payroll Expense" value={`₹${totalPayroll}`} />
        </div>
      </section>

      {/* REVENUE BREAKDOWN */}
      <section className="bg-white p-8 rounded-xl shadow border">
        <h3 className="text-xl font-semibold mb-4">
          Monthly Revenue Breakdown
        </h3>

        {monthlyRevenue.map((item) => (
          <div
            key={item.month}
            className="flex justify-between border-b py-2"
          >
            <span>{item.month}</span>
            <span className="font-semibold">
              ₹{item.total}
            </span>
          </div>
        ))}
      </section>

      {/* DEPARTMENT ANALYTICS */}
      <section className="bg-white p-8 rounded-xl shadow border">
        <h3 className="text-xl font-semibold mb-6">
          Department Analytics
        </h3>

        <div className="grid grid-cols-2 gap-6">
          {departmentSummary.map((d, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg"
            >
              <p className="font-semibold">{d.name}</p>
              <p className="text-gray-500 text-sm">
                Employees: {d.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AUDIT LOGS */}
      <section className="bg-white p-8 rounded-xl shadow border">
        <h3 className="text-xl font-semibold mb-6">
          Audit Logs
        </h3>

        <input
          type="text"
          placeholder="Filter logs..."
          className="border p-2 rounded mb-4 w-full"
          value={auditFilter}
          onChange={(e) =>
            setAuditFilter(e.target.value)
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">
                  Action
                </th>
                <th className="p-3 text-left">
                  Performed By
                </th>
                <th className="p-3 text-left">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.map((a) => (
                <tr
                  key={a.id}
                  className="border-b"
                >
                  <td className="p-3">
                    {a.action}
                  </td>
                  <td className="p-3">
                    {a.performedBy || "-"}
                  </td>
                  <td className="p-3">
                    {a.timestamp
                      ? new Date(
                          a.timestamp.seconds *
                            1000
                        ).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ALERTS */}
      <section className="bg-white p-8 rounded-xl shadow border">
        <h3 className="text-xl font-semibold mb-4">
          System Alerts
        </h3>

        {alerts.length === 0 && (
          <p className="text-gray-500">
            No critical alerts.
          </p>
        )}

        {alerts.map((alert, i) => (
          <div
            key={i}
            className="bg-red-100 text-red-600 p-3 rounded mb-3"
          >
            {alert}
          </div>
        ))}
      </section>

    </div>
  );
}

/* ================================
   REUSABLE CARD COMPONENT
================================ */

function Card({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <p className="text-sm text-gray-500">
        {title}
      </p>
      <p className="text-2xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}