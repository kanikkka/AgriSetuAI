"use client";

import React from "react";
import { useLanguage, Language } from "@/context/LanguageContext";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  const langs: { id: Language; label: string }[] = [
    { id: "en", label: "EN" },
    { id: "hi", label: "हिंदी" },
    { id: "pa", label: "ਪੰਜਾਬੀ" }
  ];

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs font-sans">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {t("live_status")}
        </span>
        <span className="hidden sm:inline text-xs text-slate-500 font-semibold">
          ⛽ {t("spot_diesel")}: <strong className="text-slate-800">₹87.80/L</strong>
        </span>
      </div>

      {/* Global 3-Language Selector Buttons */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
        {langs.map((l) => (
          <button
            key={l.id}
            onClick={() => setLanguage(l.id)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              language === l.id
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </header>
  );
}