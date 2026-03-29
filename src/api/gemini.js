import { safeJsonParse } from "../utils/helpers";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const TRIAGE_SCHEMA = {
  type: "object",
  properties: {
    severityKey: { type: "string" },
    summary: { type: "string" },
    advice: { type: "array", items: { type: "string" } },
    escalation: { type: "string" },
    warning: { type: "string" },
  },
  required: ["severityKey", "summary", "advice", "escalation", "warning"],
};

const IMAGE_SCHEMA = {
  type: "object",
  properties: {
    injury: { type: "string" },
    severity: { type: "string" },
    color: { type: "string" },
    summary: { type: "string" },
    steps: { type: "array", items: { type: "string" } },
    caution: { type: "string" },
  },
  required: ["injury", "severity", "color", "summary", "steps", "caution"],
};

const REPORT_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    symptoms: { type: "string" },
    severity: { type: "string" },
    triageSummary: { type: "string" },
    actionPlan: { type: "array", items: { type: "string" } },
    referral: { type: "string" },
  },
  required: ["id", "name", "symptoms", "severity", "triageSummary", "actionPlan", "referral"],
};

export function isGeminiConfigured() {
  return Boolean(API_KEY);
}

async function generateStructuredContent({ prompt, schema, inlineImage }) {
  if (!API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY");
  }

  const parts = [{ text: prompt }];

  if (inlineImage) {
    parts.push({
      inline_data: {
        mime_type: inlineImage.mimeType,
        data: inlineImage.base64Image,
      },
    });
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
        responseJsonSchema: schema,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini request failed");
  }

  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
  const parsed = safeJsonParse(text);

  if (!parsed) {
    throw new Error("Gemini returned an unreadable response");
  }

  return parsed;
}

export async function getTriageAdvice(prompt) {
  return generateStructuredContent({
    prompt,
    schema: TRIAGE_SCHEMA,
  });
}

export async function analyzeInjuryImage({ base64Image, mimeType, language }) {
  return generateStructuredContent({
    prompt:
      language === "hi"
        ? "आप एक ग्रामीण प्राथमिक सहायता सहायक हैं। तस्वीर देखकर चोट का प्रकार, गंभीरता, सरल प्राथमिक उपचार कदम, और सावधानी बताएं। जवाब सरल हिंदी में दें।"
        : "You are a rural first-aid assistant. Review the injury image and return the injury type, severity, simple first-aid steps, and one caution in plain English.",
    schema: IMAGE_SCHEMA,
    inlineImage: { base64Image, mimeType },
  });
}

export async function generateHealthWorkerReport({
  patientName,
  symptoms,
  severity,
  language,
}) {
  const prompt =
    language === "hi"
      ? `ग्रामीण स्वास्थ्य कार्यकर्ता के लिए एक छोटा और स्पष्ट मरीज रिपोर्ट JSON में बनाएं।
नाम: ${patientName}
लक्षण: ${symptoms}
गंभीरता: ${severity}
रिपोर्ट संक्षिप्त, कार्रवाई योग्य, और रेफरल सलाह सहित हो।`
      : `Create a concise patient report for a rural health worker as JSON.
Patient name: ${patientName}
Symptoms: ${symptoms}
Severity: ${severity}
Keep it short, actionable, and include a referral recommendation.`;

  return generateStructuredContent({
    prompt,
    schema: REPORT_SCHEMA,
  });
}
