import { useState } from "react";
import { ONBOARDING_STEPS } from "../data/mockData";

export default function OnboardingScreen({ lang, setScreen }) {
  const [step, setStep] = useState(0);
  const activeStep = ONBOARDING_STEPS[step];

  return (
    <div className="min-h-screen bg-med-hero text-white">
      <div className="soft-grid flex min-h-screen flex-col px-6 pb-6 pt-8">
        <div className="mb-10 flex items-center justify-between rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-white/80">
          <span>MedMitra</span>
          <span>{`${step + 1}/${ONBOARDING_STEPS.length}`}</span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-6 text-8xl drop-shadow-sm">{activeStep.icon}</div>
          <h1 className="text-balance text-4xl font-black tracking-tight">
            {activeStep.title[lang]}
          </h1>
          <p className="mt-4 max-w-xs text-lg font-medium leading-8 text-white/85">
            {activeStep.desc[lang]}
          </p>

          <div className="mt-10 flex gap-2">
            {ONBOARDING_STEPS.map((item, index) => (
              <div
                key={item.title.en}
                className={`h-2 rounded-full transition-all ${
                  index === step ? "w-10 bg-white" : "w-2 bg-white/35"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {step < ONBOARDING_STEPS.length - 1 ? (
            <>
              <button
                onClick={() => setScreen("home")}
                className="w-full rounded-[1.4rem] border border-white/30 bg-white/10 px-5 py-4 text-base font-black"
              >
                {lang === "en" ? "Skip for now" : "अभी छोड़ें"}
              </button>
              <button
                onClick={() => setStep((current) => current + 1)}
                className="w-full rounded-[1.4rem] bg-white px-5 py-4 text-base font-black text-green-800 shadow-soft"
              >
                {lang === "en" ? "Next" : "आगे"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setScreen("home")}
              className="w-full rounded-[1.4rem] bg-white px-5 py-4 text-lg font-black text-green-800 shadow-soft"
            >
              {lang === "en" ? "Get Started" : "शुरू करें"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
