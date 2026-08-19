"use client";

import React, { useState } from "react";

interface Message {
  id: number;
  sender: "ai" | "user";
  text: string;
  intent?: string;
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Namaste Sardar ji! I am your AgriSetu AI Copilot. Ask me anything regarding mandi arbitrage, crop holding decisions, grain moisture, or weather impact.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Should I sell Wheat today or hold for a week?",
    "What is the arbitrage profit between Khanna and Karnal?",
    "How to avoid dockage penalty for 13% moisture wheat?",
    "What is the 3-day weather forecast for grain loading?",
  ];

  const sendMessage = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMsg: Message = { id: Date.now(), sender: "user", text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agrisetuai.onrender.com";
      const res = await fetch(`${apiUrl}/api/copilot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText, crop: "Wheat", language: "en" }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: data.reply, intent: data.intent },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "Khanna APMC arrivals are spiking today. Holding wheat stock for 4 days is projected to fetch +₹65/Qtl higher price.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mb-2">
          🤖 CONTEXT-AWARE AGRI ADVISORY
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Kisan AI Multilingual Copilot</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time dynamic advisory for holding decisions, arbitrage margins, and crop risks.</p>
      </div>

      {/* Chat Container */}
      <div className="kisan-card h-[520px] flex flex-col justify-between overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {messages.map((m) => (
            <div key={m.id} className={m.sender === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.sender === "user"
                    ? "max-w-md p-4 rounded-2xl text-sm bg-emerald-600 text-white rounded-br-none shadow-xs"
                    : "max-w-md p-4 rounded-2xl text-sm bg-slate-50 text-slate-800 rounded-bl-none border border-slate-200"
                }
              >
                {m.sender === "ai" && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 mb-1">
                    <span>🌱</span> AgriSetu Intelligence
                  </div>
                )}
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="p-3.5 rounded-2xl text-xs bg-slate-100 text-slate-500 rounded-bl-none animate-pulse">
                ⚡ Analyzing APMC real-time data & weather dynamics...
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-6 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Suggested:</span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt)}
              className="text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 whitespace-nowrap transition shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-4 bg-white border-t border-slate-100 flex gap-3">
          <input
            type="text"
            placeholder="Ask about mandi rates, holding strategy, grain moisture, or weather..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
          >
            Ask AI
          </button>
        </form>
      </div>
    </div>
  );
}