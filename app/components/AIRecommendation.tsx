"use client";

import { useEffect, useState } from "react";

export default function AIRecommendation() {
  const [recommendation, setRecommendation] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      setRecommendation("Morning Cleaning Service");
    } else if (hour < 18) {
      setRecommendation("Appliance Repair");
    } else {
      setRecommendation("Deep Cleaning for Tomorrow");
    }
  }, []);

  return (
    <div className="bg-[#0F172A] text-white p-6 rounded-xl mt-10">
      <h4 className="text-[#FF6A00] font-semibold mb-2">
        Recommended For You
      </h4>
      <p>{recommendation}</p>
    </div>
  );
}