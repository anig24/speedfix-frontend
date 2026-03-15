export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6 animate-fadeIn">

        {/* Floating Circle */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-4 border-orange-300 animate-ping opacity-30"></div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
          Loading...
        </h2>

      </div>
    </div>
  );
}
