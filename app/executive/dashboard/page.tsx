"use client";

import { useExecutiveData } from "./hooks/useExecutiveData";
import { useForecastEngine } from "./hooks/useForecastEngine";
import RevenueChart from "./components/RevenueChart";
import PerformanceScore from "./components/PerformanceScore";

export default function FounderDashboard() {
  const {
    employees,
    totalRevenue,
    totalPayroll,
    activeJobs,
    monthlyRevenue,
    cityRevenue,
  } = useExecutiveData();

  const forecast = useForecastEngine(monthlyRevenue);

  return (
    <div className="space-y-10">

      <div className="grid grid-cols-4 gap-6">
        <Card title="Employees" value={employees.length} />
        <Card title="Revenue" value={`₹${totalRevenue}`} />
        <Card title="Payroll" value={`₹${totalPayroll}`} />
        <Card title="Forecast Next Month" value={`₹${forecast}`} />
      </div>

      <RevenueChart data={monthlyRevenue} />

      <PerformanceScore
        revenue={totalRevenue}
        payroll={totalPayroll}
        activeJobs={activeJobs}
      />

      <div className="bg-black p-6 rounded-xl shadow border">
        <h3 className="font-semibold mb-4">City Revenue</h3>
        {cityRevenue.map((c: any) => (
          <div key={c.city} className="flex justify-between border-b py-2">
            <span>{c.city}</span>
            <span>₹{c.total}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-black p-6 rounded-xl shadow border">
      <p className="text-sm text-black-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}