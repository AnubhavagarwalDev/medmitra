const COLOR_MAP = {
  green: "border-green-300 bg-green-100 text-green-800",
  yellow: "border-yellow-300 bg-yellow-100 text-yellow-800",
  red: "border-red-300 bg-red-100 text-red-800",
  blue: "border-blue-300 bg-blue-100 text-blue-800",
  slate: "border-slate-300 bg-slate-100 text-slate-700",
};

export default function Badge({ children, color = "green" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
        COLOR_MAP[color] || COLOR_MAP.green
      }`}
    >
      {children}
    </span>
  );
}
