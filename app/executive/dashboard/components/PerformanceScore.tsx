"use client";

export default function PerformanceScore({
  revenue,
  payroll,
  activeJobs,
}: any) {
  let score = 0;

  if (revenue > payroll) score += 40;
  if (activeJobs > 10) score += 30;
  if (revenue > 100000) score += 30;

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h3 className="font-semibold mb-4">Company Performance Score</h3>
      <p className="text-4xl font-bold">{score}/100</p>
    </div>
  );
}