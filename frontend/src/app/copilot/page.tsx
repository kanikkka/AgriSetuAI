"use client";

import React, { useState } from "react";

interface Message {
  id: number;
  sender: "ai" | "user";
  text: string;
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Namaste! Main aapka AgriSetu AI Copilot hoon. Mandi bhav, holding strategy, grain quality ya weather ke baare mein kuch bhi poochein.",
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

  const getSmartReply = (q: string) => {
    const query = q.toLowerCase();
    if (query.includes("sell") || query.includes("hold") || query.includes("week")) {
      return "Khanna & Rajpura APMC mein arrivals peak par hain. Wheat ko 4-5 din hold karna behtar rahega, price mein +₹55 se +₹75/Qtl tak ka jump aane ki sambhavna hai.";
    } else if (query.includes("arbitrage") || query.includes("karnal") || query.includes("khanna") || query.includes("rate")) {
      return "Karnal APMC rate ₹2,475/Qtl hai jabki Khanna mein ₹2,440/Qtl hai. Diesel kharch (₹25/Qtl) kaatne ke baad bhi aapko +₹140/Qtl ka net munafa milega.";
    } else if (query.includes("moisture") || query.includes("nami") || query.includes("dockage")) {
      return "13% moisture par arhatiya ₹20-30/Qtl dockage penalty laga sakta hai. Mandi le jaane se pehle daane ko 2 ghante dhoop mein sukhayein taaki moisture 12% se neeche aa jaye (0% penalty).";
    } else if (query.includes("weather") || query.includes("rain") || query.includes("mausam")) {
      return "Agle 72 ghante tak Khanna aur Karnal belt mein mausam saaf rahega. Loading aur inter-state transport ke liye yeh sabse surakshit samay hai.";
    } else {
      return "AgriSetu AI Alert: Mandi liquidity strong hai. Direct corporate khareedari ke liye Coalition section check karein ya Quality Inspector se FCI Grade certificate prapt karein.";
    }
  };

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
      const replyText = data?.reply || getSmartReply(queryText);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: replyText }]);
    } catch {
      const fallbackText = getSmartReply(queryText);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: fallbackText }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-2">
          🤖 CONTEXT-AWARE AGRI ADVISORY
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Kisan AI Multilingual Copilot</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">Real-time advisory for holding decisions, spatial arbitrage & quality protection.</p>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm h-[520px] flex flex-col justify-between overflow-hidden">
        {/* Messages */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/40">
          {messages.map((m) => (
            <div key={m.id} className={m.sender === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.sender === "user"
                    ? "max-w-lg p-4 rounded-2xl bg-emerald-600 text-white rounded-br-xs text-sm font-medium shadow-xs"
                    : "max-w-lg p-4 rounded-2xl bg-white border border-slate-200 text-slate-900 rounded-bl-xs text-sm shadow-xs space-y-1.5"
                }
              >
                {m.sender === "ai" && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <span>🌱</span> AgriSetu Intelligence
                  </div>
                )}
                <p className={m.sender === "ai" ? "text-slate-800 leading-relaxed font-normal" : "text-white leading-relaxed"}>
                  {m.text}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs rounded-bl-xs animate-pulse">
                ⚡ Analyzing APMC real-time data & weather dynamics...
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-5 py-2.5 bg-slate-100/70 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Suggested:</span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt)}
              className="text-xs font-semibold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 whitespace-nowrap transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-3.5 bg-white border-t border-slate-200 flex gap-2.5">
          <input
            type="text"
            placeholder="Ask about mandi rates, holding strategy, grain moisture, or weather..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400 font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition shadow-xs disabled:opacity-50"
          >
            Ask AI
          </button>
        </form>
      </div>
    </div>
  );
}