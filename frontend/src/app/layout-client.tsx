"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage, Language } from "@/context/LanguageContext";

export function MainNavigation() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { nameKey: "nav_farmer_hub", href: "/farmer-home", icon: "🌾" },
    { nameKey: "nav_collective", href: "/collective", icon: "🤝" },
    { nameKey: "nav_mandi_rates", href: "/market", icon: "🗺️" },
    { nameKey: "nav_quality", href: "/simulator", icon: "🔬" },
    { nameKey: "nav_copilot", href: "/copilot", icon: "🎙️" },
  ];

  const langs: { id: Language; label: string }[] = [
    { id: "en", label: "EN" },
    { id: "hi", label: "हिंदी" },
    { id: "pa", label: "ਪੰਜਾਬੀ" }
  ];

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
      <div className="flex items-center gap-2">
        <span className="text-xl">🌱</span>
        <span className="font-black text-slate-900 tracking-tight">AgriSetu AI</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Multilingual Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
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

        <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
          KS
        </div>
      </div>
    </div>
  );
}

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <MainNavigation />
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}