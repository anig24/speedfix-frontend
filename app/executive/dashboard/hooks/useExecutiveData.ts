"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useExecutiveData() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [support, setSupport] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    const unsub: any[] = [];

    unsub.push(
      onSnapshot(collection(db, "employees"), (snap) =>
        setEmployees(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );

    unsub.push(
      onSnapshot(collection(db, "jobs"), (snap) =>
        setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );

    unsub.push(
      onSnapshot(collection(db, "bookings"), (snap) =>
        setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );

    unsub.push(
      onSnapshot(collection(db, "supportTickets"), (snap) =>
        setSupport(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );

    unsub.push(
      onSnapshot(collection(db, "payroll"), (snap) =>
        setPayroll(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );

    unsub.push(
      onSnapshot(collection(db, "departments"), (snap) =>
        setDepartments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );

    unsub.push(
      onSnapshot(collection(db, "auditLogs"), (snap) =>
        setAuditLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );

    return () => unsub.forEach((u) => u());
  }, []);

  /* ===============================
     AGGREGATIONS
  ================================ */

  const totalRevenue = useMemo(
    () => bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0),
    [bookings]
  );

  const totalPayroll = useMemo(
    () => payroll.reduce((acc, p) => acc + (p.amount || 0), 0),
    [payroll]
  );

  const activeJobs = useMemo(
    () => jobs.filter((j) => j.status === "ACTIVE").length,
    [jobs]
  );

  const monthlyRevenue = useMemo(() => {
    const map: Record<string, number> = {};

    bookings.forEach((b) => {
      if (!b.createdAt) return;
      const date = (b.createdAt as Timestamp).toDate();
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      map[key] = (map[key] || 0) + (b.totalAmount || 0);
    });

    return Object.entries(map).map(([month, total]) => ({
      month,
      total,
    }));
  }, [bookings]);

  const cityRevenue = useMemo(() => {
    const map: Record<string, number> = {};

    bookings.forEach((b) => {
      if (!b.city) return;
      map[b.city] = (map[b.city] || 0) + (b.totalAmount || 0);
    });

    return Object.entries(map).map(([city, total]) => ({
      city,
      total,
    }));
  }, [bookings]);

  return {
    employees,
    jobs,
    support,
    payroll,
    bookings,
    departments,
    auditLogs,
    totalRevenue,
    totalPayroll,
    activeJobs,
    monthlyRevenue,
    cityRevenue,
  };
}