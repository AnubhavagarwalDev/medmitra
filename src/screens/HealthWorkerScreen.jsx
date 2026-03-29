import { useState } from "react";
import {
  generateHealthWorkerReport,
  isGeminiConfigured,
} from "../api/gemini";
import Badge from "../components/Badge";
import LoadingSpinner from "../components/LoadingSpinner";
import StepList from "../components/StepList";
import { HEALTH_WORKER_SEVERITY } from "../data/mockData";
import {
  downloadTextFile,
  formatLocalDate,
  playBeep,
} from "../utils/helpers";

function buildFallbackReport(form, lang) {
  return {
    id: `RPT-${Math.floor(Math.random() * 9000 + 1000)}`,
    name: form.name,
    symptoms: form.symptoms,
    severity: form.severity,
    triageSummary:
      lang === "en"
        ? "Patient requires observation, first aid, and follow-up according to reported symptoms."
        : "मरीज को बताए गए लक्षणों के अनुसार निगरानी, प्राथमिक उपचार और फॉलो-अप की आवश्यकता है।",
    actionPlan:
      lang === "en"
        ? [
            "Check airway, breathing, and bleeding immediately.",
            "Record temperature, pain level, and symptom duration.",
            "Give basic first aid and keep the patient calm.",
            "Refer to the nearest clinic if symptoms worsen or remain severe.",
          ]
        : [
            "तुरंत सांस, खून बहना और होश की स्थिति जांचें।",
            "तापमान, दर्द और लक्षणों की अवधि लिखें।",
            "प्राथमिक उपचार दें और मरीज को शांत रखें।",
            "लक्षण गंभीर रहें या बढ़ें तो नजदीकी क्लिनिक रेफर करें।",
          ],
    referral:
      lang === "en"
        ? "Escalate to PHC or district hospital if the patient becomes unstable."
        : "मरीज अस्थिर हो तो PHC या जिला अस्पताल रेफर करें।",
    date: formatLocalDate(lang),
    source:
      lang === "en"
        ? "Local template"
        : "स्थानीय टेम्पलेट",
  };
}

function printReport(report, lang) {
  const popup = window.open("", "_blank", "width=900,height=700");
  const content = `
    <html>
      <head>
        <title>MedMitra Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; line-height: 1.6; color: #111827; }
          h1 { margin-bottom: 8px; }
          h2 { margin-top: 24px; }
          ul { padding-left: 20px; }
          .meta { margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <h1>MedMitra ${lang === "en" ? "Patient Report" : "मरीज रिपोर्ट"}</h1>
        <div class="meta">
          <div><strong>ID:</strong> ${report.id}</div>
          <div><strong>${lang === "en" ? "Date" : "तारीख"}:</strong> ${report.date}</div>
          <div><strong>${lang === "en" ? "Patient" : "मरीज"}:</strong> ${report.name}</div>
          <div><strong>${lang === "en" ? "Severity" : "गंभीरता"}:</strong> ${report.severity}</div>
        </div>
        <h2>${lang === "en" ? "Symptoms" : "लक्षण"}</h2>
        <p>${report.symptoms}</p>
        <h2>${lang === "en" ? "Summary" : "सारांश"}</h2>
        <p>${report.triageSummary}</p>
        <h2>${lang === "en" ? "Action Plan" : "कार्य योजना"}</h2>
        <ul>${report.actionPlan.map((item) => `<li>${item}</li>`).join("")}</ul>
        <h2>${lang === "en" ? "Referral" : "रेफरल"}</h2>
        <p>${report.referral}</p>
      </body>
    </html>
  `;

  if (!popup) {
    downloadTextFile(
      `${report.id}.txt`,
      `${report.id}\n${report.name}\n${report.symptoms}\n${report.triageSummary}\n${report.actionPlan.join("\n")}\n${report.referral}`,
    );
    return;
  }

  popup.document.open();
  popup.document.write(content);
  popup.document.close();
  popup.focus();
  popup.print();
}

export default function HealthWorkerScreen({ lang, isOffline }) {
  const [form, setForm] = useState({
    name: "",
    symptoms: "",
    severity: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  async function handleSubmit() {
    if (!form.name || !form.symptoms) {
      return;
    }

    playBeep();
    setLoading(true);

    try {
      if (isOffline || !isGeminiConfigured()) {
        setReport(buildFallbackReport(form, lang));
        return;
      }

      const aiReport = await generateHealthWorkerReport({
        patientName: form.name,
        symptoms: form.symptoms,
        severity: form.severity,
        language: lang,
      });

      setReport({
        ...aiReport,
        date: formatLocalDate(lang),
        source: "Gemini AI",
      });
    } catch (_error) {
      setReport(buildFallbackReport(form, lang));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-70px)] bg-slate-50 p-4">
        <LoadingSpinner
          label={lang === "en" ? "Generating report" : "रिपोर्ट बन रही है"}
          sublabel={
            isOffline
              ? lang === "en"
                ? "Offline mode will use a local template."
                : "ऑफलाइन मोड में स्थानीय टेम्पलेट उपयोग होगा।"
              : lang === "en"
                ? "Preparing a short clinical summary with Gemini."
                : "Gemini के साथ छोटा क्लिनिकल सारांश तैयार हो रहा है।"
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-50 p-4">
      {!report ? (
        <section className="med-card p-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {lang === "en" ? "Health Worker Mode" : "स्वास्थ्य कार्यकर्ता मोड"}
              </h1>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                {lang === "en"
                  ? "Create a patient handoff note with AI assistance or a local fallback."
                  : "AI सहायता या स्थानीय बैकअप के साथ मरीज हैंडऑफ रिपोर्ट बनाएं।"}
              </p>
            </div>
            <Badge color={isOffline ? "red" : "blue"}>
              {isOffline ? "Offline" : isGeminiConfigured() ? "AI ready" : "API needed"}
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-black uppercase tracking-[0.22em] text-slate-500">
                {lang === "en" ? "Patient Name" : "मरीज का नाम"}
              </label>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder={lang === "en" ? "Enter name" : "नाम लिखें"}
                className="w-full rounded-[1.2rem] border-2 border-slate-200 px-4 py-3 text-base font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black uppercase tracking-[0.22em] text-slate-500">
                {lang === "en" ? "Symptoms" : "लक्षण"}
              </label>
              <textarea
                value={form.symptoms}
                onChange={(event) =>
                  setForm((current) => ({ ...current, symptoms: event.target.value }))
                }
                placeholder={lang === "en" ? "Describe symptoms" : "लक्षण बताएं"}
                className="h-28 w-full resize-none rounded-[1.2rem] border-2 border-slate-200 px-4 py-3 text-base font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black uppercase tracking-[0.22em] text-slate-500">
                {lang === "en" ? "Severity" : "गंभीरता"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["low", "medium", "high"].map((severityKey) => (
                  <button
                    key={severityKey}
                    onClick={() =>
                      setForm((current) => ({ ...current, severity: severityKey }))
                    }
                    className={`rounded-[1.1rem] border-2 px-3 py-3 text-sm font-black transition ${
                      form.severity === severityKey
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    {HEALTH_WORKER_SEVERITY[severityKey].label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!form.name || !form.symptoms}
              className="w-full rounded-[1.35rem] bg-green-600 px-4 py-4 text-lg font-black text-white shadow-soft transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {lang === "en" ? "Generate Report" : "रिपोर्ट बनाएं"}
            </button>
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="med-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {lang === "en" ? "Patient Report" : "मरीज रिपोर्ट"}
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-500">{report.id}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  color={
                    HEALTH_WORKER_SEVERITY[report.severity]?.color || "yellow"
                  }
                >
                  {report.severity}
                </Badge>
                <Badge color="blue">{report.source}</Badge>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { label: lang === "en" ? "Date" : "तारीख", value: report.date },
                { label: lang === "en" ? "Patient" : "मरीज", value: report.name },
                { label: lang === "en" ? "Symptoms" : "लक्षण", value: report.symptoms },
                {
                  label: lang === "en" ? "Summary" : "सारांश",
                  value: report.triageSummary,
                },
              ].map((item) => (
                <div key={item.label} className="border-b border-slate-100 pb-3 last:border-none">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <section className="med-card p-5">
            <h3 className="text-lg font-black text-slate-800">
              {lang === "en" ? "Action Plan" : "कार्य योजना"}
            </h3>
            <div className="mt-4">
              <StepList steps={report.actionPlan} />
            </div>

            <div className="mt-5 rounded-[1.3rem] bg-slate-50 px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                {lang === "en" ? "Referral" : "रेफरल"}
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                {report.referral}
              </p>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => printReport(report, lang)}
              className="rounded-[1.35rem] bg-blue-600 px-4 py-4 text-base font-black text-white shadow-soft"
            >
              {lang === "en" ? "Download PDF" : "PDF डाउनलोड"}
            </button>
            <button
              onClick={() => {
                setReport(null);
                setForm({ name: "", symptoms: "", severity: "medium" });
              }}
              className="rounded-[1.35rem] bg-slate-200 px-4 py-4 text-base font-black text-slate-700"
            >
              {lang === "en" ? "New Patient" : "नया मरीज"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
