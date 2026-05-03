export default function Loading() {
  return (
    <div className="public-shell flex min-h-screen items-center justify-center">
      <div className="surface-panel rounded-[2rem] border border-slate-200 px-8 py-6 text-center">
        <div className="mx-auto h-10 w-10 rounded-full border-2 border-slate-200 border-t-orange-500 animate-spin" />
        <p className="mt-4 text-sm font-medium text-slate-600">
          Loading SpeedFix experience...
        </p>
      </div>
    </div>
  );
}
