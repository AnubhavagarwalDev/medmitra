export default function LoadingSpinner({
  label,
  sublabel,
  icon = "⚙️",
  tone = "green",
}) {
  const toneMap = {
    green: "text-green-700",
    blue: "text-blue-700",
    amber: "text-amber-700",
  };

  return (
    <div className="med-card flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className={`text-5xl ${toneMap[tone] || toneMap.green} animate-spin`}>
        {icon}
      </div>
      <p className="mt-4 text-lg font-black text-slate-800">{label}</p>
      {sublabel ? <p className="mt-1 text-sm font-medium text-slate-500">{sublabel}</p> : null}
    </div>
  );
}
