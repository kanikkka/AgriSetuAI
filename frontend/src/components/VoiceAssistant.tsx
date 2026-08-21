"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function VoiceAssistant() {
  const { i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [spokenResponse, setSpokenResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const langCode = i18n.language === "pa" ? "pa-IN" : i18n.language === "hi" ? "hi-IN" : "en-IN";

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langCode;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = async (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      
      // Query Backend
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${apiUrl}/api/farmer-hub/voice-query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: speechToText, lang: i18n.language || "hi" })
        });
        const data = await res.json();
        if (data.spoken_response) {
          setSpokenResponse(data.spoken_response);
          speakText(data.spoken_response);
        }
      } catch (err) {
        console.error("Voice API error:", err);
      }
    };

    recognition.start();
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <span>🎙️</span>
            <span>Real Voice Assistant (Web Speech Engine)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Mic par bolkar live mandi rates ya buyers ki jaankari lein (Hindi / Punjabi / English).
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
          isSpeaking ? "bg-amber-100 text-amber-800 animate-pulse" : isListening ? "bg-red-100 text-red-800 animate-bounce" : "bg-emerald-100 text-emerald-800"
        }`}>
          {isSpeaking ? "🔊 Speaking..." : isListening ? "🔴 Listening..." : "Ready"}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={startListening}
          className={`flex-1 py-3 rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-sm ${
            isListening ? "bg-red-600 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <span>{isListening ? "⏹️ Bolna band karein" : "🎤 Mic Dabayein & Bolein"}</span>
        </button>

        {spokenResponse && (
          <button
            onClick={() => speakText(spokenResponse)}
            className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition"
          >
            🔊 Replay
          </button>
        )}
      </div>

      {transcript && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
          <strong>Aapne poocha:</strong> "{transcript}"
        </div>
      )}

      {spokenResponse && (
        <div className="p-4 bg-emerald-50 text-emerald-950 font-bold text-xs rounded-2xl border border-emerald-200 space-y-1">
          <span className="text-[10px] uppercase text-emerald-700 block font-black">AgriSetu Jawab:</span>
          <p className="text-sm">{spokenResponse}</p>
        </div>
      )}
    </div>
  );
}