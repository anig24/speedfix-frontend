"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ data }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border h-80">
      <h3 className="font-semibold mb-4">Revenue Trend</h3>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#f97316" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}