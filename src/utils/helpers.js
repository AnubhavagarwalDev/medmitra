export function calcSeverity(answers) {
  if (
    answers.conscious === "no" ||
    answers.bleeding === "severe" ||
    answers.breathing === "no"
  ) {
    return "critical";
  }

  if (answers.bleeding === "mild") {
    return "medium";
  }

  return "low";
}

export function playBeep() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch (_error) {
    return;
  }
}

export function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function safeJsonParse(input, fallback = null) {
  try {
    if (typeof input !== "string") {
      return fallback;
    }

    const normalized = input.replace(/```json|```/g, "").trim();
    return JSON.parse(normalized);
  } catch (_error) {
    return fallback;
  }
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.split(",")[1];

      if (!base64) {
        reject(new Error("Could not encode image"));
        return;
      }

      resolve(base64);
    };

    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export function formatLocalDate(language = "en") {
  const locale = language === "hi" ? "hi-IN" : "en-IN";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

export function normalizeSeverityColor(severity) {
  const value = severity.toLowerCase();

  if (value.includes("critical") || value.includes("high") || value.includes("red")) {
    return "red";
  }

  if (value.includes("medium") || value.includes("yellow")) {
    return "yellow";
  }

  return "green";
}

export function haversineDistanceKm(from, to) {
  const earthRadiusKm = 6371;
  const latDiff = toRadians(to.lat - from.lat);
  const lngDiff = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(fromLat) *
      Math.cos(toLat) *
      Math.sin(lngDiff / 2) *
      Math.sin(lngDiff / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

export function formatDistance(distanceKm) {
  return `${distanceKm.toFixed(1)} km`;
}

export function buildMapEmbedUrl({ lat, lng }) {
  const delta = 0.045;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join("%2C");

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function buildDirectionsUrl(origin, destination) {
  const originParam = `${origin.lat},${origin.lng}`;
  const destinationParam = `${destination.lat},${destination.lng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destinationParam}&travelmode=driving`;
}

export function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
