"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OperationsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);

  // 🔥 REAL-TIME JOBS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
      const data: any[] = [];
      snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setJobs(data);
    });

    return () => unsub();
  }, []);

  // 🔥 LOAD WORKERS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "employees"), (snap) => {
      const data: any[] = [];
      snap.forEach((doc) => {
        const d = doc.data();
        if (d.role === "STAFF") data.push({ id: doc.id, ...d });
      });
      setWorkers(data);
    });

    return () => unsub();
  }, []);

  // 🚀 ASSIGN JOB
  const assignWorker = async (jobId: string, workerId: string) => {
    await updateDoc(doc(db, "jobs", jobId), {
      workerId,
      status: "assigned",
    });
  };

  return (
    <div>
      <h2 className="text-2xl mb-6">Live Job Assignment</h2>

      {jobs.map((job) => (
        <div
          key={job.id}
          className="p-4 border-b border-white/10 flex justify-between"
        >
          <div>
            <p>{job.service}</p>
            <p className="text-sm text-gray-400">{job.city}</p>
            <p>Status: {job.status}</p>
          </div>

          <select
            onChange={(e) =>
              assignWorker(job.id, e.target.value)
            }
            className="bg-black p-2"
          >
            <option>Select Worker</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}