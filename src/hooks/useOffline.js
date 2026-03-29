import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "medmitra-manual-offline";

function readManualOffline() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function useOffline() {
  const [networkOffline, setNetworkOffline] = useState(() =>
    typeof navigator === "undefined" ? false : !navigator.onLine,
  );
  const [manualOffline, setManualOffline] = useState(readManualOffline);

  useEffect(() => {
    const handleOnline = () => setNetworkOffline(false);
    const handleOffline = () => setNetworkOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(manualOffline));
  }, [manualOffline]);

  const isOffline = useMemo(
    () => networkOffline || manualOffline,
    [manualOffline, networkOffline],
  );

  return {
    isOffline,
    networkOffline,
    manualOffline,
    setManualOffline,
    toggleOffline: () => setManualOffline((current) => !current),
  };
}
