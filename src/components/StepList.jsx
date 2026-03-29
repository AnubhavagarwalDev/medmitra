export default function StepList({ steps, tone = "green" }) {
  const toneMap = {
    green: "bg-green-600",
    blue: "bg-blue-600",
    red: "bg-red-600",
  };

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div
          key={`${step}-${index}`}
          className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
        >
          <span
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${
              toneMap[tone] || toneMap.green
            }`}
          >
            {index + 1}
          </span>
          <p className="text-sm font-semibold leading-6 text-slate-700">{step}</p>
        </div>
      ))}
    </div>
  );
}
