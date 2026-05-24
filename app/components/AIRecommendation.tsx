"use client";

function getRecommendation() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Morning Cleaning Service";
  }

  if (hour < 18) {
    return "Appliance Repair";
  }

  return "Deep Cleaning for Tomorrow";
}

export default function AIRecommendation() {
  const recommendation = getRecommendation();

  return (
    <div className="bg-[#0F172A] text-white p-6 rounded-xl mt-10">
      <h4 className="text-[#FF6A00] font-semibold mb-2">
        Recommended For You
      </h4>
      <p>{recommendation}</p>
    </div>
  );
}
