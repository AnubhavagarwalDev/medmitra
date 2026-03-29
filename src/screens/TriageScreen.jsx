import { useState } from "react";
import { getTriageAdvice, isGeminiConfigured } from "../api/gemini";
import Badge from "../components/Badge";
import LoadingSpinner from "../components/LoadingSpinner";
import StepList from "../components/StepList";
import { SEVERITY_MAP, TRIAGE_QUESTIONS } from "../data/mockData";
import { calcSeverity, playBeep } from "../utils/helpers";

function formatPrompt(answers, lang) {
  const readableAnswers = TRIAGE_QUESTIONS.map((question) => {
    const chosen = question.options.find((option) => option.value === answers[question.id]);
    return `${question.text[lang]}: ${chosen?.label[lang] || answers[question.id]}`;
  }).join("\n");

  return lang === "en"
    ? `You are MedMitra, an emergency assistant for rural users. Review the answers below and provide simple first-aid guidance.

${readableAnswers}

Return the guidance in plain English. Severity must be one of: critical, medium, low.`
    : `आप MedMitra हैं, ग्रामीण उपयोगकर्ताओं के लिए आपातकालीन सहायक। नीचे दिए गए जवाब देखकर सरल प्राथमिक उपचार सलाह दें।

${readableAnswers}

जवाब आसान हिंदी में दें। Severity केवल critical, medium, low में से एक हो।`;
}

function buildFallbackResult(answers, lang, reason) {
  const severityKey = calcSeverity(answers);
  const mapped = SEVERITY_MAP[severityKey];

  return {
    ...mapped,
    displaySteps: mapped.steps[lang],
    summary:
      lang === "en"
        ? "Local triage rules were used because AI advice was unavailable."
        : "AI उपलब्ध न होने पर स्थानीय ट्रायाज नियमों का उपयोग किया गया।",
    escalation:
      severityKey === "critical"
        ? lang === "en"
          ? "Call 108 immediately."
          : "तुरंत 108 पर कॉल करें।"
        : lang === "en"
          ? "Visit the nearest clinic if symptoms worsen."
          : "लक्षण बढ़ें तो नजदीकी क्लिनिक जाएं।",
    warning: reason,
    source: lang === "en" ? "Local rules" : "स्थानीय नियम",
  };
}

export default function TriageScreen({ lang, isOffline }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const question = TRIAGE_QUESTIONS[step];
  const progress = (step / TRIAGE_QUESTIONS.length) * 100;

  async function finalizeTriage(nextAnswers) {
    setLoading(true);

    try {
      if (isOffline || !isGeminiConfigured()) {
        const reason =
          isOffline
            ? lang === "en"
              ? "Offline mode is active."
              : "ऑफलाइन मोड चालू है।"
            : lang === "en"
              ? "Gemini API key is not configured."
              : "Gemini API key कॉन्फ़िगर नहीं है।";
        setResult(buildFallbackResult(nextAnswers, lang, reason));
        return;
      }

      const aiResponse = await getTriageAdvice(formatPrompt(nextAnswers, lang));
      const severityKey = ["critical", "medium", "low"].includes(aiResponse.severityKey?.toLowerCase())
        ? aiResponse.severityKey.toLowerCase()
        : calcSeverity(nextAnswers);
      const severityMeta = SEVERITY_MAP[severityKey];

      setResult({
        ...severityMeta,
        displaySteps:
          Array.isArray(aiResponse.advice) && aiResponse.advice.length > 0
            ? aiResponse.advice.slice(0, 5)
            : severityMeta.steps[lang],
        summary: aiResponse.summary,
        escalation: aiResponse.escalation,
        warning: aiResponse.warning,
        source: "Gemini AI",
      });
    } catch (error) {
      setResult(
        buildFallbackResult(
          nextAnswers,
          lang,
          error.message ||
            (lang === "en" ? "AI response failed." : "AI प्रतिक्रिया असफल रही।"),
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(value) {
    playBeep();
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);

    if (step < TRIAGE_QUESTIONS.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    finalizeTriage(nextAnswers);
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-70px)] bg-slate-50 p-4">
        <LoadingSpinner
          label={lang === "en" ? "Analyzing emergency" : "आपातस्थिति का विश्लेषण हो रहा है"}
          sublabel={
            isOffline
              ? lang === "en"
                ? "Offline mode will use local rules."
                : "ऑफलाइन मोड में स्थानीय नियम उपयोग होंगे।"
              : lang === "en"
                ? "Checking answers with Gemini."
                : "Gemini के साथ जवाबों की जांच हो रही है।"
          }
        />
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-[calc(100vh-70px)] bg-slate-50 p-4">
        <div className="space-y-4">
          <section
            className="rounded-[2rem] border-2 px-5 py-6 text-center shadow-soft"
            style={{ backgroundColor: result.bg, borderColor: result.border }}
          >
            <div className="text-6xl">{result.icon}</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              {result.label[lang]}
            </h2>
            <div className="mt-3 flex justify-center gap-2">
              <Badge color={result.color}>
                {lang === "en" ? "Severity level" : "गंभीरता स्तर"}
              </Badge>
              <Badge color="blue">{result.source}</Badge>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">
              {result.summary}
            </p>
          </section>

          <section className="med-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-slate-800">
                {lang === "en" ? "First Aid Steps" : "प्राथमिक उपचार कदम"}
              </h3>
              <span className="text-2xl">📋</span>
            </div>
            <StepList steps={result.displaySteps} tone={result.color === "yellow" ? "blue" : result.color} />
          </section>

          <section className="med-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
              {lang === "en" ? "Escalation" : "आगे की कार्रवाई"}
            </p>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
              {result.escalation}
            </p>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
              {result.warning}
            </p>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:108"
              className="rounded-[1.35rem] bg-red-500 px-4 py-4 text-center text-base font-black text-white shadow-soft"
            >
              {lang === "en" ? "Call 108" : "108 कॉल"}
            </a>
            <button
              onClick={() => {
                setStep(0);
                setAnswers({});
                setResult(null);
              }}
              className="rounded-[1.35rem] bg-green-600 px-4 py-4 text-base font-black text-white shadow-soft"
            >
              {lang === "en" ? "Restart" : "दोबारा"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-50 p-4">
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-500">
          <span>
            {lang === "en"
              ? `Question ${step + 1} of ${TRIAGE_QUESTIONS.length}`
              : `प्रश्न ${step + 1} / ${TRIAGE_QUESTIONS.length}`}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-200">
          <div
            className="h-3 rounded-full bg-green-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="med-card mb-5 px-6 py-8 text-center">
        <div className="text-7xl">{question.icon}</div>
        <h2 className="mt-4 text-balance text-2xl font-black tracking-tight text-slate-800">
          {question.text[lang]}
        </h2>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
          {lang === "en"
            ? "Choose the closest answer. The app will keep the advice simple."
            : "सबसे सही उत्तर चुनें। ऐप सलाह को सरल रखेगा।"}
        </p>
      </div>

      <div className="space-y-3">
        {question.options.map((option) => {
          const styles = {
            green: "border-green-300 bg-green-50 text-green-800 hover:bg-green-100",
            yellow: "border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100",
            red: "border-red-300 bg-red-50 text-red-800 hover:bg-red-100",
          };

          return (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`w-full rounded-[1.5rem] border-2 px-5 py-5 text-left font-black transition active:scale-[0.98] ${
                styles[option.color]
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{option.icon}</span>
                <span className="text-xl">{option.label[lang]}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
