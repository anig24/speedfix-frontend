export default function StatsCard({ title, value }: any) {
  return (
    <div className="bg-[#020617] p-5 rounded-xl border border-white/10">
      <h3 className="text-sm text-gray-400">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}