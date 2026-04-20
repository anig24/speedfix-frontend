"use client";

export function useForecastEngine(data: { month: string; total: number }[]) {
  if (data.length < 2) return 0;

  const last = data[data.length - 1].total;
  const prev = data[data.length - 2].total;

  const growth = last - prev;

  return last + growth; // next month projection
}