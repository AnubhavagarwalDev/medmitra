export default function TopBar({
  lang,
  setLang,
  setScreen,
  isOffline,
}) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-emerald-100 bg-white/90 px-4 py-3 hero-blur">
      <button
        onClick={() => setScreen("home")}
        className="flex items-center gap-2 text-left"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-2xl">
          🏥
        </span>
        <div>
          <p className="font-display text-lg font-extrabold tracking-tight text-green-800">
            MedMitra
          </p>
          <p className="text-xs font-semibold text-slate-500">
            {lang === "en" ? "Emergency assistant" : "आपातकालीन सहायक"}
          </p>
        </div>
      </button>

      <div className="flex items-center gap-2">
        {isOffline ? (
          <div className="rounded-full border border-orange-300 bg-orange-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-orange-700">
            Offline
          </div>
        ) : null}

        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          className="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
        >
          {lang === "en" ? "हिन्दी" : "English"}
        </button>
      </div>
    </div>
  );
}
