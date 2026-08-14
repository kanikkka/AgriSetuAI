"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  SlidersHorizontal,
  Users,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  const navItems = [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("market"), href: "/market", icon: TrendingUp },
    { name: t("simulator"), href: "/simulator", icon: SlidersHorizontal },
    { name: t("coalitions"), href: "/coalitions", icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5 flex flex-col justify-between border-r border-slate-800">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800 pb-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
            K
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wide text-white">PunjabiMandi.AI</h1>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">KisanLogic Engine</p>
          </div>
        </div>

        {/* 🌐 MULTILINGUAL LANGUAGE SWITCHER */}
        <div className="mt-5 bg-slate-800 p-3 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
            <Globe size={14} className="text-emerald-400" /> Choose Language
          </div>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => setLang("en")}
              type="button"
              className={`py-1.5 rounded-lg cursor-pointer transition-all ${
                lang === "en" ? "bg-emerald-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              type="button"
              className={`py-1.5 rounded-lg cursor-pointer transition-all ${
                lang === "hi" ? "bg-emerald-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLang("pa")}
              type="button"
              className={`py-1.5 rounded-lg cursor-pointer transition-all ${
                lang === "pa" ? "bg-emerald-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
              }`}
            >
              ਪੰਜਾਬੀ
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4 text-[10px] text-slate-400 text-center">
        <p className="font-semibold">KisanLogic AI v2.0</p>
        <p className="text-emerald-400 mt-0.5">SIH Hackathon Ready</p>
      </div>
    </aside>
  );
}