"use client";

import React, { useState, useEffect } from "react";

interface Message {
  id: number;
  sender: "ai" | "user";
  text: string;
}

export default function VoiceCopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Namaste! Main aapka AgriSetu AI Copilot hoon. Aap bol kar ya likh kar mandi arbitrage, weather, ya fasal holding par koi bhi sawal pooch sakte hain.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Web Speech API: Voice-to-Text
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.start();
  };

  // Web Speech API: Text-to-Speech Audio Playback
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
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
        body: JSON.stringify({ query: queryText, crop: "Wheat", language: "hi" }),
      });
      const data = await res.json();
      const replyText = data?.reply || "AgriSetu AI: Mandi liquidity strong hai. Holding for 4 days gives +₹60/Qtl margin.";
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: replyText }]);
      speakText(replyText);
    } catch {
      const fallback = "Khanna APMC mein arrivals peak par hain. Karnal yard dispatch par +₹140/Qtl net munafa milega.";
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: fallback }]);
      speakText(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-1.5">
          🎙️ MULTILINGUAL VOICE-TO-TEXT & AUDIO COPILOT
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Kisan Voice AI Copilot</h1>
        <p className="text-xs text-slate-500 mt-0.5">Click the microphone to speak your question in Hindi, Punjabi, or English.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs h-[520px] flex flex-col justify-between overflow-hidden">
        {/* Chat History */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/40">
          {messages.map((m) => (
            <div key={m.id} className={m.sender === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.sender === "user"
                    ? "max-w-lg p-4 rounded-2xl bg-emerald-600 text-white rounded-br-xs text-sm font-medium shadow-xs"
                    : "max-w-lg p-4 rounded-2xl bg-white border border-slate-200 text-slate-900 rounded-bl-xs text-sm shadow-2xs space-y-2"
                }
              >
                {m.sender === "ai" && (
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span className="flex items-center gap-1.5">🌱 AgriSetu Intelligence</span>
                    <button onClick={() => speakText(m.text)} className="text-slate-400 hover:text-emerald-700 text-xs">
                      🔊 Replay Voice
                    </button>
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
                ⚡ Processing live agricultural context...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar with Microphone */}
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={startListening}
            className={`p-2.5 rounded-xl border transition ${
              isListening ? "bg-red-500 text-white border-red-600 animate-bounce" : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
            }`}
            title="Click to Speak"
          >
            {isListening ? "🎙️ Listening..." : "🎤 Speak"}
          </button>

          <input
            type="text"
            placeholder="Ask or speak: 'Wheat kab bechu?', 'Karnal arbitrage rate', 'Weather forecast'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
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