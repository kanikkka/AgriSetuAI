"use client";

import React, { useState } from "react";

export default function CopilotPage() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Namaste Sardar ji! I am your AgriSetu AI Copilot. Ask me about mandi arbitrage, weather risks, or best time to sell." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText },
      { sender: "ai", text: "Khanna APMC arrivals are spiking today. Holding wheat stock for 4 days is projected to fetch +₹65/Qtl higher price." }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Kisan AI Multilingual Copilot</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time dynamic advisory for holding decisions, arbitrage, and weather impact.</p>
      </div>

      <div className="kisan-card h-[500px] flex flex-col justify-between overflow-hidden">
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {messages.map((m, i) => (
            <div key={i} className={m.sender === "user" ? "flex justify-end" : "flex justify-start"}>
              <div className={
                m.sender === "user"
                  ? "max-w-md p-4 rounded-2xl text-sm bg-emerald-600 text-white rounded-br-none shadow-sm"
                  : "max-w-md p-4 rounded-2xl text-sm bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200"
              }>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-3">
          <input
            type="text"
            placeholder="Ask about mandi rates, quality grading, or crop selling strategies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
          />
          <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition shadow-sm">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}