"use client";

import Link from "next/link";
import {
  Home,
  Sprout,
  Store,
  Handshake,
  Users,
  FlaskConical,
  Bot,
  User,
} from "lucide-react";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "My Crops", href: "/crops", icon: Sprout },
  { label: "Market", href: "/market", icon: Store },
  { label: "Future Market", href: "/future-market", icon: Handshake },
  { label: "Coalitions", href: "/coalitions", icon: Users },
  { label: "Simulator", href: "/simulator", icon: FlaskConical },
  { label: "AI Copilot", href: "/copilot", icon: Bot },
  { label: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[var(--navy)] text-white p-5">
      <div className="flex items-center gap-3 mb-10">
        <Sprout />
        <div>
          <p className="font-bold text-lg">KisanLogic.AI</p>
          <p className="text-xs text-white/50">Farmer Intelligence</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white"
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
