import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriSetu AI - APMC Mandi Intelligence",
  description: "Spatial Arbitrage, AI Grain Quality & Farmer Coalition Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Mandi Rates & Arbitrage", href: "/market", icon: "🏪" },
    { name: "Future Market", href: "/future-market", icon: "📈" },
    { name: "Farmer Coalitions", href: "/coalitions", icon: "🤝" },
    { name: "Quality Inspector", href: "/simulator", icon: "🔬" },
    { name: "AI Copilot", href: "/copilot", icon: "🤖" },
    { name: "Farm Profile", href: "/profile", icon: "👤" },
  ];

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex selection:bg-emerald-100 selection:text-emerald-900">
        {/* Sole Primary Sidebar */}
        <aside className="w-68 bg-slate-950 text-slate-100 flex flex-col justify-between p-6 min-h-screen sticky top-0 hidden md:flex z-30 flex-shrink-0 border-r border-slate-800">
          <div className="space-y-8">
            <div className="flex items-center gap-3.5 px-2">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
                🌱
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-white">AgriSetu<span className="text-emerald-400">.AI</span></h1>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Kisan Intelligence</p>
              </div>
            </div>

            <nav className="space-y-1.5 text-sm font-semibold">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-all group"
                >
                  <span className="text-base transition-transform group-hover:scale-110">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> APMC Live Feed
            </div>
            <p className="text-slate-400">Syncing Khanna, Karnal & Sirsa spot arrivals.</p>
          </div>
        </aside>

        {/* Top Header & Page Body */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Live Mandi Grid Active
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline font-medium">Punjab & Haryana APMC Yard Network</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button className="px-3 py-1 bg-white text-slate-900 rounded-lg shadow-xs">English</button>
                <button className="px-3 py-1 text-slate-600 hover:text-slate-900">हिंदी</button>
                <button className="px-3 py-1 text-slate-600 hover:text-slate-900">ਪੰਜਾਬੀ</button>
              </div>
              <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                HS
              </div>
            </div>
          </header>

          <main className="p-6 md:p-8 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}