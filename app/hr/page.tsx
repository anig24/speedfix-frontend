export default function HRDashboard() {
  const cards = [
    { title: "Total Employees", value: "248" },
    { title: "New Joiners (This Month)", value: "12" },
    { title: "Pending Applications", value: "35" },
    { title: "Pending Leave Requests", value: "8" },
    { title: "Salary Pending", value: "15 Employees" },
    { title: "Attendance Today", value: "210 Present" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        HR Dashboard Overview
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-5"
          >
            <h3 className="text-sm text-gray-500 mb-2">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">
          Quick Actions
        </h3>

        <div className="flex gap-4 flex-wrap">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Add Employee
          </button>

          <button className="bg-green-600 text-white px-4 py-2 rounded-md">
            Post Job
          </button>

          <button className="bg-purple-600 text-white px-4 py-2 rounded-md">
            Process Salary
          </button>
        </div>
      </div>
    </div>
  );
}