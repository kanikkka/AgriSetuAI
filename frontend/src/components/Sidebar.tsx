"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { nameKey: "nav_farmer_hub", href: "/farmer-home", icon: "🌾" },
    { nameKey: "nav_collective", href: "/collective", icon: "🤝" },
    { nameKey: "nav_mandi_rates", href: "/market", icon: "🗺️" },
    { nameKey: "nav_quality", href: "/simulator", icon: "🔬" },
    { nameKey: "nav_copilot", href: "/copilot", icon: "🎙️" },
  ];

  return (
    <aside className="w-64 bg-[#0A1118] text-white flex flex-col justify-between p-4 hidden md:flex font-sans border-r border-slate-800">
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-xl shadow-md">
            🌱
          </div>
          <div>
            <h1 className="font-black text-base text-white tracking-tight">AgriSetu.AI</h1>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">APMC Enterprise Hub</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/farmer-home" && pathname === "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-400 hover:bg-slate-850 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{t(item.nameKey)}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400 text-center">
        <span className="text-emerald-400 font-bold block mb-0.5">● Punjab Agmarknet Grid</span>
        100% Real API Stream
      </div>
    </aside>
  );
}