export const ONBOARDING_STEPS = [
  {
    icon: "🚨",
    title: { en: "Emergency Help", hi: "आपातकालीन सहायता" },
    desc: {
      en: "Quick triage for emergency situations with clear first-aid steps.",
      hi: "आपात स्थिति के लिए त्वरित मूल्यांकन और साफ प्राथमिक उपचार निर्देश।",
    },
  },
  {
    icon: "🖼️",
    title: { en: "Image Analysis", hi: "तस्वीर विश्लेषण" },
    desc: {
      en: "Upload an injury photo and get AI-backed first-aid guidance.",
      hi: "चोट की तस्वीर अपलोड करें और AI आधारित प्राथमिक उपचार सलाह पाएं।",
    },
  },
  {
    icon: "🎤",
    title: { en: "Voice Support", hi: "आवाज़ से सहायता" },
    desc: {
      en: "Speak naturally in your language and continue to emergency triage.",
      hi: "अपनी भाषा में बोलें और तुरंत ट्रायाज सहायता तक पहुंचें।",
    },
  },
];

export const TRIAGE_QUESTIONS = [
  {
    id: "conscious",
    text: { en: "Is the person conscious?", hi: "क्या व्यक्ति होश में है?" },
    icon: "🧠",
    options: [
      { label: { en: "Yes", hi: "हाँ" }, value: "yes", icon: "✅", color: "green" },
      { label: { en: "No", hi: "नहीं" }, value: "no", icon: "❌", color: "red" },
    ],
  },
  {
    id: "bleeding",
    text: { en: "Is there bleeding?", hi: "क्या खून बह रहा है?" },
    icon: "🩸",
    options: [
      { label: { en: "None", hi: "नहीं" }, value: "none", icon: "✅", color: "green" },
      { label: { en: "Mild", hi: "थोड़ा" }, value: "mild", icon: "🟡", color: "yellow" },
      { label: { en: "Severe", hi: "ज्यादा" }, value: "severe", icon: "🔴", color: "red" },
    ],
  },
  {
    id: "breathing",
    text: { en: "Is breathing normal?", hi: "क्या सांस सामान्य है?" },
    icon: "🫁",
    options: [
      { label: { en: "Yes", hi: "हाँ" }, value: "yes", icon: "✅", color: "green" },
      { label: { en: "No", hi: "नहीं" }, value: "no", icon: "❌", color: "red" },
    ],
  },
];

export const SEVERITY_MAP = {
  critical: {
    key: "critical",
    label: { en: "CRITICAL", hi: "गंभीर" },
    color: "red",
    bg: "#fee2e2",
    border: "#ef4444",
    icon: "🔴",
    steps: {
      en: [
        "Call ambulance IMMEDIATELY — 108",
        "Do NOT move the patient",
        "Keep airway clear",
        "Apply pressure to any bleeding wounds",
        "Stay with patient until help arrives",
      ],
      hi: [
        "तुरंत एम्बुलेंस बुलाएं — 108",
        "मरीज को न हिलाएं",
        "सांस का रास्ता साफ रखें",
        "खून बहने पर दबाव डालें",
        "मदद आने तक साथ रहें",
      ],
    },
  },
  medium: {
    key: "medium",
    label: { en: "MEDIUM", hi: "मध्यम" },
    color: "yellow",
    bg: "#fef9c3",
    border: "#eab308",
    icon: "🟡",
    steps: {
      en: [
        "Keep patient calm and seated",
        "Apply first aid for visible injuries",
        "Monitor breathing every 2 minutes",
        "Contact local health worker",
        "Head to nearest clinic within 1 hour",
      ],
      hi: [
        "मरीज को शांत और बैठा रखें",
        "दिखाई देने वाली चोटों पर प्राथमिक उपचार करें",
        "हर 2 मिनट में सांस जांचें",
        "स्थानीय स्वास्थ्य कार्यकर्ता से संपर्क करें",
        "1 घंटे के भीतर नजदीकी क्लिनिक जाएं",
      ],
    },
  },
  low: {
    key: "low",
    label: { en: "LOW", hi: "कम" },
    color: "green",
    bg: "#dcfce7",
    border: "#22c55e",
    icon: "🟢",
    steps: {
      en: [
        "Clean and dress any wounds",
        "Rest the patient in a comfortable position",
        "Provide fluids if conscious",
        "Monitor for next 30 minutes",
        "Visit clinic if symptoms worsen",
      ],
      hi: [
        "घावों को साफ करें और पट्टी लगाएं",
        "मरीज को आरामदायक स्थिति में लिटाएं",
        "होश में हो तो पानी दें",
        "अगले 30 मिनट निगरानी करें",
        "स्थिति बिगड़े तो क्लिनिक जाएं",
      ],
    },
  },
};

export const MOCK_AI_RESPONSES = {
  burn: {
    injury: "Burn Injury",
    severity: "Medium",
    color: "yellow",
    steps: [
      "Cool the burn under running water for 10 minutes",
      "Do NOT apply ice, butter, or toothpaste",
      "Cover loosely with clean cloth or bandage",
      "Do not pop blisters",
      "Seek medical attention if burn is large or deep",
    ],
    summary: "Likely a superficial or partial-thickness burn. Cooling and clean covering are the priority.",
  },
  cut: {
    injury: "Laceration / Cut",
    severity: "Low",
    color: "green",
    steps: [
      "Apply direct pressure with a clean cloth",
      "Keep pressure for 5 to 10 minutes",
      "Clean with clean water once bleeding slows",
      "Cover with sterile bandage",
      "Watch for signs of infection over the next 24 hours",
    ],
    summary: "Bleeding appears controllable. Clean dressing and observation are important.",
  },
  fracture: {
    injury: "Possible Fracture",
    severity: "High",
    color: "red",
    steps: [
      "Do NOT move the injured limb",
      "Immobilize using a splint or stiff board",
      "Apply ice pack wrapped in cloth for 20 minutes",
      "Elevate the injured area if possible",
      "Call ambulance immediately and do not delay",
    ],
    summary: "Possible fracture or severe trauma. Movement should be minimized until trained help arrives.",
  },
};

export const MOCK_VOICE_TRANSCRIPTS = {
  en: [
    "Person fell from roof, not moving",
    "Severe bleeding on left arm",
    "Child having difficulty breathing",
    "Patient unconscious, no response",
  ],
  hi: [
    "छत से गिरा है, हिल नहीं रहा",
    "बाएं हाथ से खून बह रहा है",
    "बच्चे को सांस लेने में तकलीफ है",
    "मरीज बेहोश है",
  ],
};

export const HEALTH_WORKER_SEVERITY = {
  low: { label: "🟢 Low", color: "green" },
  medium: { label: "🟡 Medium", color: "yellow" },
  high: { label: "🔴 High", color: "red" },
};

export const DEFAULT_LOCATION = {
  lat: Number(import.meta.env.VITE_DEFAULT_LAT || 28.8156),
  lng: Number(import.meta.env.VITE_DEFAULT_LNG || 79.025),
  label: {
    en: "Rampur region",
    hi: "रामपुर क्षेत्र",
  },
};

export const NEARBY_PLACES = [
  {
    icon: "🏥",
    name: { en: "District Hospital", hi: "जिला अस्पताल" },
    coords: { lat: 28.8152, lng: 79.0173 },
    open: true,
    type: { en: "Emergency care", hi: "आपातकालीन देखभाल" },
  },
  {
    icon: "🩺",
    name: { en: "PHC Rampur", hi: "प्राथमिक स्वास्थ्य केंद्र रामपुर" },
    coords: { lat: 28.8211, lng: 79.0292 },
    open: true,
    type: { en: "Primary care", hi: "प्राथमिक देखभाल" },
  },
  {
    icon: "💊",
    name: { en: "Jan Aushadhi Store", hi: "जन औषधि स्टोर" },
    coords: { lat: 28.8118, lng: 79.0327 },
    open: false,
    type: { en: "Medicines", hi: "दवाइयाँ" },
  },
  {
    icon: "🚑",
    name: { en: "ASHA Worker Center", hi: "आशा कार्यकर्ता केंद्र" },
    coords: { lat: 28.8077, lng: 79.0218 },
    open: true,
    type: { en: "Local support", hi: "स्थानीय सहायता" },
  },
];
