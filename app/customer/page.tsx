export default function CustomerPage() {
  return (
    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-2">Active Bookings</h3>
        <p className="text-3xl font-bold text-[#FF6A00]">0</p>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-2">Completed Jobs</h3>
        <p className="text-3xl font-bold text-[#FF6A00]">0</p>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
        <p className="text-3xl font-bold text-[#FF6A00]">₹0</p>
      </div>

    </div>
  );
}