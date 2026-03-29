import { useEffect, useRef, useState } from "react";
import { analyzeInjuryImage, isGeminiConfigured } from "../api/gemini";
import Badge from "../components/Badge";
import LoadingSpinner from "../components/LoadingSpinner";
import StepList from "../components/StepList";
import { MOCK_AI_RESPONSES } from "../data/mockData";
import {
  fileToBase64,
  normalizeSeverityColor,
  pickRandom,
  playBeep,
} from "../utils/helpers";

export default function ImageUploadScreen({ lang, isOffline }) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [filePayload, setFilePayload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [statusText, setStatusText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const localUrl = URL.createObjectURL(file);
    const base64Image = await fileToBase64(file);

    setPreviewUrl(localUrl);
    setFilePayload({
      base64Image,
      mimeType: file.type || "image/jpeg",
      filename: file.name,
    });
    setResult(null);
    setStatusText("");
  }

  async function handleAnalyze() {
    if (!filePayload) {
      return;
    }

    playBeep();
    setLoading(true);
    setResult(null);

    try {
      if (isOffline || !isGeminiConfigured()) {
        const fallback = pickRandom(Object.values(MOCK_AI_RESPONSES));
        setResult({
          ...fallback,
          source:
            isOffline
              ? lang === "en"
                ? "Offline local analysis"
                : "ऑफलाइन स्थानीय विश्लेषण"
              : lang === "en"
                ? "Mock guidance"
                : "स्थानीय मार्गदर्शन",
          caution:
            lang === "en"
              ? "If pain increases, swelling spreads, or bleeding continues, seek in-person care."
              : "दर्द बढ़े, सूजन फैले, या खून बंद न हो तो तुरंत डॉक्टर से मिलें।",
        });
        return;
      }

      const aiResponse = await analyzeInjuryImage({
        base64Image: filePayload.base64Image,
        mimeType: filePayload.mimeType,
        language: lang,
      });

      setResult({
        injury: aiResponse.injury,
        severity: aiResponse.severity,
        color: normalizeSeverityColor(aiResponse.color || aiResponse.severity),
        steps: aiResponse.steps,
        summary: aiResponse.summary,
        caution: aiResponse.caution,
        source: "Gemini AI",
      });
    } catch (error) {
      const fallback = pickRandom(Object.values(MOCK_AI_RESPONSES));
      setResult({
        ...fallback,
        source: lang === "en" ? "Fallback guidance" : "बैकअप मार्गदर्शन",
        caution: error.message,
      });
    } finally {
      setLoading(false);
      setStatusText(
        lang === "en"
          ? `Image ready: ${filePayload.filename}`
          : `तस्वीर तैयार: ${filePayload.filename}`,
      );
    }
  }

  const cardTone = {
    green: "border-green-300 bg-green-50 text-green-800",
    yellow: "border-yellow-300 bg-yellow-50 text-yellow-800",
    red: "border-red-300 bg-red-50 text-red-800",
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-50 p-4">
      <div className="space-y-4">
        <section className="med-card p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {lang === "en" ? "Upload Injury Image" : "चोट की तस्वीर अपलोड करें"}
              </h1>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                {lang === "en"
                  ? "Take a clear photo in good light. MedMitra can use Gemini when online and local guidance when offline."
                  : "अच्छी रोशनी में साफ तस्वीर लें। ऑनलाइन होने पर Gemini और ऑफलाइन होने पर स्थानीय मार्गदर्शन उपयोग होगा।"}
              </p>
            </div>
            <Badge color={isOffline ? "red" : "blue"}>
              {isOffline ? "Offline" : isGeminiConfigured() ? "AI ready" : "API needed"}
            </Badge>
          </div>

          <button
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center rounded-[1.7rem] border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-10 text-center transition hover:bg-blue-100"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected injury"
                className="max-h-64 rounded-2xl object-contain"
              />
            ) : (
              <>
                <span className="text-6xl">📷</span>
                <p className="mt-3 text-lg font-black text-blue-700">
                  {lang === "en" ? "Tap to upload photo" : "तस्वीर लगाने के लिए टैप करें"}
                </p>
                <p className="mt-1 text-sm font-medium text-blue-500">
                  JPG, PNG
                </p>
              </>
            )}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {statusText ? (
            <p className="mt-3 text-sm font-semibold text-slate-500">{statusText}</p>
          ) : null}

          <button
            onClick={handleAnalyze}
            disabled={!filePayload || loading}
            className="mt-4 w-full rounded-[1.35rem] bg-blue-600 px-4 py-4 text-lg font-black text-white shadow-soft transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading
              ? lang === "en"
                ? "Analyzing image"
                : "तस्वीर का विश्लेषण हो रहा है"
              : lang === "en"
                ? "Get first-aid help"
                : "प्राथमिक उपचार सलाह पाएं"}
          </button>
        </section>

        {loading ? (
          <LoadingSpinner
            label={lang === "en" ? "Checking the injury" : "चोट की जांच हो रही है"}
            sublabel={
              isOffline
                ? lang === "en"
                  ? "Offline mode will use local guidance."
                  : "ऑफलाइन मोड में स्थानीय मार्गदर्शन उपयोग होगा।"
                : lang === "en"
                  ? "Sending image to Gemini."
                  : "तस्वीर Gemini को भेजी जा रही है।"
            }
            icon="🔬"
            tone="blue"
          />
        ) : null}

        {result ? (
          <section className="med-card p-5">
            <div className={`rounded-[1.4rem] border px-4 py-4 ${cardTone[result.color]}`}>
              <div className="flex items-start gap-3">
                <span className="text-4xl">
                  {result.color === "green" ? "🟢" : result.color === "yellow" ? "🟡" : "🔴"}
                </span>
                <div>
                  <h2 className="text-xl font-black">{result.injury}</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge color={result.color}>{result.severity}</Badge>
                    <Badge color="blue">{result.source}</Badge>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold leading-6">{result.summary}</p>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-black text-slate-800">
                {lang === "en" ? "First Aid Instructions" : "प्राथमिक उपचार निर्देश"}
              </h3>
              <div className="mt-4">
                <StepList steps={result.steps} tone="blue" />
              </div>
            </div>

            <div className="mt-5 rounded-[1.3rem] bg-slate-50 px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                {lang === "en" ? "Caution" : "सावधानी"}
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                {result.caution}
              </p>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
