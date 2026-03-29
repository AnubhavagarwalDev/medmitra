import { useEffect, useRef, useState } from "react";
import Badge from "../components/Badge";
import { MOCK_VOICE_TRANSCRIPTS } from "../data/mockData";
import { pickRandom, playBeep } from "../utils/helpers";

export default function VoiceScreen({ lang, setScreen }) {
  const [state, setState] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [modeLabel, setModeLabel] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
    };
  }, []);

  function simulateTranscript() {
    setState("listening");
    setModeLabel(lang === "en" ? "Using demo voice mode" : "डेमो आवाज़ मोड उपयोग हो रहा है");

    window.setTimeout(() => {
      setState("processing");

      window.setTimeout(() => {
        setTranscript(pickRandom(MOCK_VOICE_TRANSCRIPTS[lang]));
        setState("done");
      }, 1400);
    }, 2200);
  }

  function startListening() {
    playBeep();
    setTranscript("");

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      simulateTranscript();
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognitionRef.current = recognition;
    recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setState("listening");
    setModeLabel(
      lang === "en"
        ? "Using browser speech recognition"
        : "ब्राउज़र स्पीच रिकग्निशन उपयोग हो रहा है",
    );

    recognition.onresult = (event) => {
      setState("processing");

      const nextTranscript = event.results?.[0]?.[0]?.transcript || "";
      window.setTimeout(() => {
        setTranscript(nextTranscript);
        setState("done");
      }, 600);
    };

    recognition.onerror = () => {
      recognition.stop();
      simulateTranscript();
    };

    recognition.onend = () => {
      if (state === "listening") {
        setState("idle");
      }
    };

    recognition.start();
  }

  const labels = {
    idle: lang === "en" ? "Tap to Speak" : "बोलने के लिए टैप करें",
    listening: lang === "en" ? "Listening..." : "सुन रहे हैं...",
    processing: lang === "en" ? "Processing..." : "प्रक्रिया हो रही है...",
    done: lang === "en" ? "Tap Again" : "फिर से बोलें",
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-50 p-4">
      <div className="space-y-4">
        <section className="med-card px-6 py-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {lang === "en" ? "Voice Help" : "आवाज़ से मदद"}
            </h1>
            <span className="text-3xl">🎤</span>
          </div>
          <p className="mx-auto mt-3 max-w-xs text-sm font-medium leading-6 text-slate-500">
            {lang === "en"
              ? "Speak naturally. MedMitra can use browser speech recognition or a demo fallback."
              : "सामान्य रूप से बोलें। MedMitra ब्राउज़र स्पीच रिकग्निशन या डेमो बैकअप उपयोग करेगा।"}
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={state === "listening" || state === "processing" ? undefined : startListening}
              className={`relative flex h-40 w-40 items-center justify-center rounded-full text-white shadow-soft transition active:scale-95 ${
                state === "listening"
                  ? "bg-red-500"
                  : state === "processing"
                    ? "bg-amber-500"
                    : "bg-gradient-to-br from-teal-600 to-cyan-700"
              }`}
            >
              {state === "listening" ? (
                <span className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
              ) : null}
              <div className="relative">
                <div className="text-5xl">{state === "processing" ? "⚙️" : "🎙️"}</div>
                <div className="mt-2 text-sm font-black uppercase tracking-wide">
                  {labels[state]}
                </div>
              </div>
            </button>
          </div>

          {modeLabel ? (
            <div className="mt-5 flex justify-center">
              <Badge color="blue">{modeLabel}</Badge>
            </div>
          ) : null}
        </section>

        {transcript ? (
          <section className="med-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
              {lang === "en" ? "Recognized speech" : "पहचानी गई आवाज़"}
            </p>
            <p className="mt-3 text-lg font-semibold leading-8 text-slate-800">
              "{transcript}"
            </p>
          </section>
        ) : null}

        {state === "done" ? (
          <button
            onClick={() => setScreen("triage")}
            className="w-full rounded-[1.4rem] bg-green-600 px-4 py-4 text-lg font-black text-white shadow-soft"
          >
            {lang === "en" ? "Start Triage Now" : "अभी ट्रायाज शुरू करें"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
