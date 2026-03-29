import { useState } from "react";
import TopBar from "./components/TopBar";
import { useLanguage } from "./hooks/useLanguage";
import { useOffline } from "./hooks/useOffline";
import HealthWorkerScreen from "./screens/HealthWorkerScreen";
import HomeScreen from "./screens/HomeScreen";
import ImageUploadScreen from "./screens/ImageUploadScreen";
import NearbyScreen from "./screens/NearbyScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import TriageScreen from "./screens/TriageScreen";
import VoiceScreen from "./screens/VoiceScreen";

const SCREEN_COMPONENTS = {
  onboarding: OnboardingScreen,
  home: HomeScreen,
  triage: TriageScreen,
  imageUpload: ImageUploadScreen,
  voice: VoiceScreen,
  healthWorker: HealthWorkerScreen,
  nearby: NearbyScreen,
};

export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [lang, setLang] = useLanguage("en");
  const { isOffline, toggleOffline } = useOffline();

  const ActiveScreen = SCREEN_COMPONENTS[screen] || HomeScreen;
  const showTopBar = screen !== "onboarding";

  return (
    <div className="app-shell">
      {showTopBar ? (
        <TopBar
          lang={lang}
          setLang={setLang}
          setScreen={setScreen}
          isOffline={isOffline}
        />
      ) : null}

      <ActiveScreen
        lang={lang}
        setScreen={setScreen}
        isOffline={isOffline}
        toggleOffline={toggleOffline}
      />
    </div>
  );
}
