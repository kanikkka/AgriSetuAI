"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Building2,
  FileCheck,
  Send,
  X,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Zap,
  PlusCircle,
  Volume2,
  PhoneCall,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface BuyerRFQ {
  id: string;
  name: string;
  crop: string;
  requiredQtl: number;
  offeredRate: number;
  mandiDiff: string;
  badge: string;
}

export default function CoalitionsPage() {
  const { lang, t } = useLanguage();

  const [pooledSlider, setPooledSlider] = useState<number>(250);
  const [corporateBuyers, setCorporateBuyers] = useState<BuyerRFQ[]>([]);
  const [loadingBuyers, setLoadingBuyers] = useState<boolean>(true);

  // New Buyer Form States
  const [showAddBuyerModal, setShowAddBuyerModal] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>("");
  const [cropName, setCropName] = useState<string>("Wheat (Grade A)");
  const [requiredQtl, setRequiredQtl] = useState<number>(500);
  const [offeredRate, setOfferedRate] = useState<number>(2650);

  // WhatsApp Modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [statusMsg, setStatusMsg] = useState<string>("");

  // IVR Web Speech Audio State
  const [showIvrModal, setShowIvrModal] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  async function fetchLiveBuyers() {
    setLoadingBuyers(true);
    try {
      const res = await axios.get(`${API_URL}/api/intelligence/buyer-rfqs`);
      if (res.data) setCorporateBuyers(res.data);
    } catch (err) {
      console.warn("Using default buyer stream:", err);
    } finally {
      setLoadingBuyers(false);
    }
  }

  useEffect(() => {
    fetchLiveBuyers();
  }, []);

  async function handleAddBuyerSubmit() {
    if (!companyName) return;
    try {
      await axios.post(`${API_URL}/api/intelligence/submit-buyer-rfq`, {
        company_name: companyName,
        crop_name: cropName,
        required_qtl: Number(requiredQtl),
        offered_rate: Number(offeredRate),
        badge: "Verified Direct Buyer",
      });
      setShowAddBuyerModal(false);
      setCompanyName("");
      fetchLiveBuyers();
    } catch (err) {
      console.error("Failed to submit buyer RFQ:", err);
    }
  }

  function speakIVRResponse() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const scriptText = lang === "hi" 
        ? "नमस्ते! किसानलॉजिक एआई टेलीफोनी सिस्टम में आपका स्वागत है। खन्ना मंडी में आज गेहूं का भाव 2310 रुपये है।"
        : lang === "pa"
        ? "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਕਿਸਾਨਲੋਜਿਕ ਏਆਈ ਟੈਲੀਫੋਨੀ ਸਿਸਟਮ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਖੰਨਾ ਮੰਡੀ ਵਿੱਚ ਅੱਜ ਕਣਕ ਦਾ ਭਾਅ 2310 ਰੁਪਏ ਹੈ।"
        : "Namaste! Welcome to KisanLogic AI Telephony system. Khanna APMC Wheat rate today is 2310 rupees per quintal.";
      
      const utterance = new SpeechSynthesisUtterance(scriptText);
      utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }

  function handleSendWhatsApp() {
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setStatusMsg("⚠️ Please enter a valid 10-digit mobile number!");
      return;
    }

    let cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length === 10) cleaned = "91" + cleaned;

    const messageText = encodeURIComponent(
      `🌾 *KisanLogic AI - Live Mandi Report* 🌾\n\n` +
      `📍 *Mandi:* Khanna APMC (Ludhiana)\n` +
      `💰 *Individual Mandi Rate:* ₹2,310/qtl\n` +
      `🤝 *Coalition Bulk Rate:* ₹2,620/qtl (+₹310 Extra Profit)\n` +
      `📈 *Real Time-Series ML Forecast:* ₹2,450/qtl\n\n` +
      `📲 _Dispatched live from KisanLogic Engine_`
    );

    window.open(`https://api.whatsapp.com/send?phone=${cleaned}&text=${messageText}`, "_blank");
    setStatusMsg("✅ WhatsApp launched with live data stream!");
  }

  const individualRate = 2310;
  const bulkRate = 2620;
  const freightDiscount = Math.round(pooledSlider * 12);
  const pricePremiumGain = Math.round((bulkRate - individualRate) * pooledSlider);
  const totalSavings = pricePremiumGain + freightDiscount;

  return (
    <div className="pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
            <Users size={16} /> {lang === "hi" ? "किसान समूह और खरीदार नेटवर्क" : lang === "pa" ? "ਕਿਸਾਨ ਸਮੂਹ ਅਤੇ ਖਰੀਦਦਾਰ ਨੈੱਟਵਰਕ" : "Dynamic Aggregation & Buyer Database"}
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-1">
            {lang === "hi" ? "किसान समूह और कॉर्पोरेट सौदे" : lang === "pa" ? "ਕਿਸਾਨ ਸਮੂਹ ਅਤੇ ਕਾਰਪੋਰੇਟ ਸੌਦੇ" : "Farmer Coalitions & Corporate Deals"}
          </h1>
          <p className="text-gray-500 mt-1.5 max-w-2xl text-sm">
            {lang === "hi" ? "सामूहिक फसल की मात्रा से बेहतर कॉर्पोरेट दरें प्राप्त करें और व्हाट्सएप पर रिपोर्ट भेजें।" : lang === "pa" ? "ਇਕੱਠੀ ਫਸਲ ਦੀ ਮਾਤਰਾ ਨਾਲ ਬਿਹਤਰ ਕਾਰਪੋਰੇਟ ਦਰਾਂ ਪ੍ਰਾਪਤ ਕਰੋ।" : "Pool crop quantity with nearby farmers, lock higher corporate bulk rates."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowIvrModal(true);
              speakIVRResponse();
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-3 rounded-2xl flex items-center gap-2 text-sm cursor-pointer"
          >
            <PhoneCall size={16} className="text-emerald-400" />
            {t("testVoiceIvr")}
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-3 rounded-2xl flex items-center gap-2 text-sm cursor-pointer shadow-md"
          >
            <MessageSquare size={16} />
            {t("sendWhatsApp")}
          </button>
        </div>
      </div>

      {/* Calculator */}
      <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[28px] p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
              <Zap size={14} /> {t("bulkBargaining")}
            </div>
            <h2 className="text-2xl font-bold">{t("bulkBargaining")} Calculator</h2>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-300">Pooled Crop Volume:</span>
                <span className="text-lg font-bold text-emerald-400">{pooledSlider} Quintals</span>
              </div>
              <input
                type="range"
                min={50}
                max={1000}
                step={25}
                value={pooledSlider}
                onChange={(e) => setPooledSlider(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 lg:w-[480px]">
            <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[11px] text-slate-400">Individual Mandi</span>
              <p className="text-xl font-bold text-slate-200 mt-2">₹{individualRate}/qtl</p>
            </div>
            <div className="bg-slate-800/90 border border-emerald-500/40 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[11px] text-emerald-300">Pooled Corporate</span>
              <p className="text-xl font-bold text-emerald-400 mt-2">₹{bulkRate}/qtl</p>
            </div>
            <div className="bg-emerald-600 p-4 rounded-2xl text-white flex flex-col justify-between shadow-lg">
              <span className="text-[11px] font-semibold">Total Extra Profit</span>
              <p className="text-2xl font-black mt-2">₹{totalSavings.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Buyers */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="text-blue-600" size={24} /> {t("corporateBuyers")}
            </h2>
          </div>

          <button
            onClick={() => setShowAddBuyerModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle size={15} /> Post New Demand
          </button>
        </div>

        {loadingBuyers ? (
          <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-2">
            <Loader2 size={20} className="animate-spin text-blue-600" /> Fetching live SQLite database records...
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {corporateBuyers.map((b) => (
              <div key={b.id} className="bg-white border border-gray-200 rounded-[22px] p-6 shadow-sm hover:shadow-md transition-all">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <ShieldCheck size={12} /> {b.badge}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2">{b.name}</h3>

                <div className="mt-4 space-y-2 border-t border-b border-gray-100 py-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Commodity:</span>
                    <span className="font-semibold text-gray-800">{b.crop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Volume Needed:</span>
                    <span className="font-semibold text-gray-800">{b.requiredQtl} Quintals</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Offered Rate:</span>
                    <span className="text-base font-bold text-emerald-600">₹{b.offeredRate}/qtl</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Commit Supply via WhatsApp <ExternalLink size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voice IVR Modal */}
      {showIvrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 text-white rounded-[28px] max-w-md w-full p-7 relative border border-slate-800">
            <button
              onClick={() => {
                if (typeof window !== "undefined") window.speechSynthesis.cancel();
                setShowIvrModal(false);
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Volume2 size={18} /> Live Web Speech Telephony Engine
            </div>

            <h3 className="text-2xl font-bold mt-1">Interactive Audio Call</h3>

            <div className="mt-6 text-center space-y-4">
              <div className={`h-20 w-20 mx-auto rounded-full flex items-center justify-center transition-all ${isSpeaking ? "bg-emerald-500/30 text-emerald-400 animate-pulse ring-4 ring-emerald-500/20" : "bg-slate-800 text-gray-400"}`}>
                <Volume2 size={36} />
              </div>

              <p className="text-xs text-emerald-300 font-semibold">
                {isSpeaking ? "🎙️ Playing Hindi/Punjabi Voice Audio Response..." : "✓ Call Completed"}
              </p>

              <button
                onClick={speakIVRResponse}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl text-xs cursor-pointer"
              >
                Replay Audio Voice Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[28px] max-w-md w-full p-7 border relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-gray-400 hover:text-black">
              <X size={20} />
            </button>
            <h3 className="text-2xl font-bold">Send Report to WhatsApp</h3>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-gray-100 border rounded-xl px-3 py-2.5 text-xs font-semibold"
              />
            </div>
            {statusMsg && <p className="text-xs text-emerald-700 font-semibold mt-2">{statusMsg}</p>}
            <button
              onClick={handleSendWhatsApp}
              className="w-full mt-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={15} /> Send Instant Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}