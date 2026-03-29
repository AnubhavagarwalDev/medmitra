import { useEffect, useMemo, useState } from "react";
import Badge from "../components/Badge";
import { DEFAULT_LOCATION, NEARBY_PLACES } from "../data/mockData";
import {
  buildDirectionsUrl,
  buildMapEmbedUrl,
  formatDistance,
  haversineDistanceKm,
} from "../utils/helpers";

export default function NearbyScreen({ lang }) {
  const [position, setPosition] = useState(DEFAULT_LOCATION);
  const [status, setStatus] = useState("idle");
  const [errorText, setErrorText] = useState("");

  function requestLocation() {
    if (!navigator.geolocation) {
      setStatus("fallback");
      setErrorText(
        lang === "en"
          ? "GPS is unavailable on this device. Showing the default service area."
          : "इस डिवाइस पर GPS उपलब्ध नहीं है। डिफ़ॉल्ट सेवा क्षेत्र दिखाया जा रहा है।",
      );
      return;
    }

    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
        setStatus("ready");
        setErrorText("");
      },
      () => {
        setStatus("fallback");
        setErrorText(
          lang === "en"
            ? "Using the fallback map area because live location was blocked."
            : "लाइव लोकेशन ब्लॉक होने के कारण बैकअप मैप क्षेत्र दिखाया जा रहा है।",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      },
    );
  }

  useEffect(() => {
    requestLocation();
  }, []);

  const places = useMemo(
    () =>
      NEARBY_PLACES.map((place) => ({
        ...place,
        distanceKm: haversineDistanceKm(position, place.coords),
      })).sort((first, second) => first.distanceKm - second.distanceKm),
    [position],
  );

  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-50 p-4">
      <div className="space-y-4">
        <section className="med-card p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {lang === "en" ? "Nearby Help" : "पास की सहायता"}
              </h1>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                {lang === "en"
                  ? "Live location is used when available. Directions open in Google Maps."
                  : "जहां संभव हो लाइव लोकेशन उपयोग होती है। रास्ता Google Maps में खुलेगा।"}
              </p>
            </div>
            <Badge color={status === "ready" ? "green" : "blue"}>
              {status === "ready"
                ? lang === "en"
                  ? "Live GPS"
                  : "लाइव GPS"
                : lang === "en"
                  ? "Map ready"
                  : "मैप तैयार"}
            </Badge>
          </div>

          <div className="overflow-hidden rounded-[1.6rem] border border-slate-200">
            <iframe
              title="Nearby healthcare map"
              src={buildMapEmbedUrl(position)}
              className="h-72 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.2rem] bg-blue-50 px-4 py-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-500">
                {lang === "en" ? "Map status" : "मैप स्थिति"}
              </p>
              <p className="mt-1 text-sm font-semibold text-blue-900">
                {errorText ||
                  (status === "ready"
                    ? lang === "en"
                      ? "Showing places near your current location."
                      : "आपकी वर्तमान लोकेशन के पास की जगहें दिखाई जा रही हैं।"
                    : lang === "en"
                      ? `Showing default area: ${DEFAULT_LOCATION.label.en}`
                      : `डिफ़ॉल्ट क्षेत्र दिख रहा है: ${DEFAULT_LOCATION.label.hi}`)}
              </p>
            </div>
            <button
              onClick={requestLocation}
              className="rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-blue-700 shadow-soft"
            >
              {lang === "en" ? "Refresh" : "फिर से"}
            </button>
          </div>
        </section>

        <section className="space-y-3">
          {places.map((place) => (
            <div key={place.name.en} className="med-card flex items-center gap-4 px-4 py-4">
              <span className="text-4xl">{place.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-black text-slate-800">
                  {place.name[lang]}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {place.type[lang]} • {formatDistance(place.distanceKm)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge color={place.open ? "green" : "red"}>
                  {place.open
                    ? lang === "en"
                      ? "Open"
                      : "खुला"
                    : lang === "en"
                      ? "Closed"
                      : "बंद"}
                </Badge>
                <a
                  href={buildDirectionsUrl(position, place.coords)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-black uppercase tracking-wide text-blue-700"
                >
                  {lang === "en" ? "Directions" : "रास्ता"}
                </a>
              </div>
            </div>
          ))}
        </section>

        <a
          href="tel:108"
          className="flex w-full items-center justify-center rounded-[1.4rem] bg-red-500 px-4 py-4 text-lg font-black text-white shadow-soft"
        >
          {lang === "en" ? "Call Ambulance 108" : "एम्बुलेंस 108 बुलाएं"}
        </a>
      </div>
    </div>
  );
}
