"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";

function MainNavigation({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();

  const menuItems = [
    { name: "Mandi Rates & Map", href: "/market", icon: "🗺️" },
    { name: "Quality & QR Gate Pass", href: "/simulator", icon: "🔬" },
    { name: "Coalitions & Logistics", href: "/coalitions", icon: "🤝" },
    { name: "Voice AI Copilot", href: "/copilot", icon: "🎙️" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sleek Primary Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-100 flex flex-col justify-between p-6 min-h-screen sticky top-0 hidden md:flex z-30 flex-shrink-0 border-r border-slate-800">
        <div className="space-y-8">
          <Link href="/market" className="flex items-center gap-3 px-1">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              🌱
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white">AgriSetu<span className="text-emerald-400">.AI</span></h1>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">APMC Enterprise Hub</p>
            </div>
          </Link>

          <nav className="space-y-2 text-sm font-semibold">
            {menuItems.map((item) => {
              const active = pathname === item.href || (pathname === "/" && item.href === "/market");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                    active
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold"
                      : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> Agmarknet Live Node
          </div>
          <p className="text-slate-400 text-[11px]">Punjab & Haryana APMC spatial grid active.</p>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Live Mandi Grid Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button onClick={() => setLang("en")} className={`px-2.5 py-1 rounded-lg transition ${lang === "en" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"}`}>EN</button>
              <button onClick={() => setLang("hi")} className={`px-2.5 py-1 rounded-lg transition ${lang === "hi" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"}`}>हिंदी</button>
              <button onClick={() => setLang("pa")} className={`px-2.5 py-1 rounded-lg transition ${lang === "pa" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"}`}>ਪੰਜਾਬੀ</button>
            </div>
            <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              HS
            </div>
          </div>
        </header>

        <main className="p-5 md:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <MainNavigation>{children}</MainNavigation>
    </LanguageProvider>
  );
}