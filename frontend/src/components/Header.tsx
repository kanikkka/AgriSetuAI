"use client";

import React, { useState, useEffect } from "react";
import "@/i18n";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    setCurrentLang(i18n.language || "en");
  }, [i18n.language]);

  const switchLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLang(lng);
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs font-sans">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {t("live_grid")}
        </span>
        <span className="hidden sm:inline text-xs text-slate-500 font-semibold">
          ⛽ {t("spot_diesel")}: <strong className="text-slate-800">₹87.80/L</strong>
        </span>
      </div>

      {/* Reliable i18next Switcher */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
        {[
          { code: "en", label: "EN" },
          { code: "hi", label: "हिंदी" },
          { code: "pa", label: "ਪੰਜਾਬੀ" }
        ].map((item) => (
          <button
            key={item.code}
            onClick={() => switchLanguage(item.code)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              currentLang === item.code
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}