import { playBeep } from "../utils/helpers";

function ActionCard({ icon, title, desc, colorClass, onClick, pulse = false }) {
  return (
    <button
      onClick={() => {
        playBeep();
        onClick();
      }}
      className={`relative w-full overflow-hidden rounded-[1.9rem] px-5 py-5 text-left text-white shadow-soft transition active:scale-[0.98] ${colorClass}`}
    >
      <div className="absolute right-0 top-0 h-28 w-28 -translate-y-6 translate-x-6 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-4">
        <div className="text-5xl">{icon}</div>
        <div className="flex-1">
          <h2 className="font-display text-2xl font-black tracking-tight">{title}</h2>
          <p className="mt-1 text-sm font-medium text-white/80">{desc}</p>
        </div>
        {pulse ? (
          <span className="relative flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/90 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-white" />
          </span>
        ) : (
          <span className="text-2xl">→</span>
        )}
      </div>
    </button>
  );
}

export default function HomeScreen({
  lang,
  setScreen,
  isOffline,
  toggleOffline,
}) {
  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-50">
      <section className="relative overflow-hidden bg-med-hero px-5 pb-8 pt-5 text-white">
        <div className="absolute bottom-0 left-0 h-32 w-32 translate-y-7 -translate-x-7 rounded-full bg-white/8" />
        <div className="absolute right-0 top-0 h-40 w-40 -translate-y-10 translate-x-10 rounded-full bg-white/8" />
        <div className="relative">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-green-100">
                {lang === "en" ? "Rural emergency care" : "ग्रामीण आपातकालीन सहायता"}
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight">MedMitra</h1>
              <p className="mt-2 max-w-xs text-sm font-medium leading-6 text-green-100">
                {lang === "en"
                  ? "Fast help for emergencies, first aid, and nearby care."
                  : "आपात स्थिति, प्राथमिक उपचार और पास की मदद के लिए तेज़ सहायता।"}
              </p>
            </div>

            <button
              onClick={toggleOffline}
              className={`rounded-full px-3 py-2 text-xs font-black uppercase tracking-wide ${
                isOffline ? "bg-orange-400 text-white" : "bg-white/15 text-white"
              }`}
            >
              {isOffline ? "Offline" : "Online"}
            </button>
          </div>

          <div className="rounded-[1.6rem] border border-white/15 bg-white/10 px-4 py-4 hero-blur">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-green-100">
              {lang === "en" ? "Emergency first" : "पहले आपातकाल"}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/85">
              {lang === "en"
                ? "Use the red card if the person is unconscious, bleeding heavily, or struggling to breathe."
                : "यदि व्यक्ति बेहोश है, बहुत खून बह रहा है, या सांस लेने में कठिनाई है, तो लाल कार्ड चुनें।"}
            </p>
          </div>
        </div>
      </section>

      <div className="-mt-5 space-y-3 px-4 pb-6">
        <ActionCard
          icon="🚨"
          title={lang === "en" ? "Start Emergency" : "आपातकाल शुरू करें"}
          desc={lang === "en" ? "Immediate triage and first-aid steps" : "तुरंत ट्रायाज और प्राथमिक उपचार कदम"}
          colorClass="bg-gradient-to-r from-red-500 to-red-600"
          pulse
          onClick={() => setScreen("triage")}
        />
        <ActionCard
          icon="🖼️"
          title={lang === "en" ? "Upload Injury" : "चोट की तस्वीर"}
          desc={lang === "en" ? "Analyze a photo with AI and offline backup" : "AI और ऑफलाइन बैकअप के साथ फोटो विश्लेषण"}
          colorClass="bg-gradient-to-r from-blue-500 to-sky-600"
          onClick={() => setScreen("imageUpload")}
        />
        <ActionCard
          icon="👨‍⚕️"
          title={lang === "en" ? "Health Worker" : "स्वास्थ्य कार्यकर्ता"}
          desc={lang === "en" ? "Create and export a patient report" : "मरीज रिपोर्ट बनाएं और निर्यात करें"}
          colorClass="bg-gradient-to-r from-green-600 to-emerald-700"
          onClick={() => setScreen("healthWorker")}
        />
        <ActionCard
          icon="🎤"
          title={lang === "en" ? "Voice Help" : "आवाज़ से मदद"}
          desc={lang === "en" ? "Speak your emergency in your own words" : "अपनी भाषा में आपात स्थिति बोलें"}
          colorClass="bg-gradient-to-r from-teal-600 to-cyan-700"
          onClick={() => setScreen("voice")}
        />
      </div>

      <div className="px-4 pb-8">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
          {lang === "en" ? "Quick Help" : "त्वरित सहायता"}
        </p>
        <div className="grid grid-cols-3 gap-3">
          <a
            href="tel:108"
            className="med-card flex flex-col items-center justify-center px-3 py-4 text-center text-red-600"
          >
            <span className="text-3xl">📞</span>
            <span className="mt-2 text-xs font-black uppercase tracking-wide">
              {lang === "en" ? "Call 108" : "108 कॉल"}
            </span>
          </a>
          <button
            onClick={() => setScreen("nearby")}
            className="med-card flex flex-col items-center justify-center px-3 py-4 text-center text-blue-600"
          >
            <span className="text-3xl">📍</span>
            <span className="mt-2 text-xs font-black uppercase tracking-wide">
              {lang === "en" ? "Find Help" : "मदद खोजें"}
            </span>
          </button>
          <button
            onClick={() => setScreen("onboarding")}
            className="med-card flex flex-col items-center justify-center px-3 py-4 text-center text-green-700"
          >
            <span className="text-3xl">❓</span>
            <span className="mt-2 text-xs font-black uppercase tracking-wide">
              {lang === "en" ? "How to Use" : "कैसे करें"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
