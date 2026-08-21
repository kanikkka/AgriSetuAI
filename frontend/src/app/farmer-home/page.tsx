"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/i18n";
import { useTranslation } from "react-i18next";
import VoiceAssistant from "@/components/VoiceAssistant";
import LiveSystemsFeed from "@/components/LiveSystemsFeed";

export default function ComprehensiveFarmerDashboard() {
  const { t, i18n } = useTranslation();
  
  // Role-Based Switcher
  const [role, setRole] = useState<"farmer" | "buyer">("farmer");
  
  // Crop & Form state
  const [crop, setCrop] = useState("Basmati Paddy");
  const [quantityQtl, setQuantityQtl] = useState(32);
  const [moisture, setMoisture] = useState(12.5);
  const [defectPct, setDefectPct] = useState(1.8);
  const [cashDays, setCashDays] = useState(3);

  // Server Data states
  const [matches, setMatches] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [decision, setDecision] = useState<any>(null);
  const [pytorchForecast, setPytorchForecast] = useState<any>(null);

  // Computer Vision Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Buyer Form state
  const [buyerName, setBuyerName] = useState("");
  const [buyerRate, setBuyerRate] = useState(3750);
  const [buyerMinLot, setBuyerMinLot] = useState(50);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const refreshAll = async () => {
    try {
      const mRes = await fetch(`${apiUrl}/api/farmer-hub/buyer-matches?crop=${crop}&quantity_qtl=${quantityQtl}&moisture_pct=${moisture}`);
      const mJson = await mRes.json();
      setMatches(mJson.matches || []);

      const bRes = await fetch(`${apiUrl}/api/farmer-hub/bookings/F-GURPREET-01`);
      const bJson = await bRes.json();
      setBookings(bJson.bookings || []);

      const dRes = await fetch(`${apiUrl}/api/farmer-hub/cash-need-decision?days=${cashDays}&qty=${quantityQtl}&crop=${crop}`);
      setDecision(await dRes.json());

      const fRes = await fetch(`${apiUrl}/api/farmer-hub/pytorch-forecast?base_price=3720&crop=${crop}`);
      setPytorchForecast(await fRes.json());
    } catch (e) {}
  };

  useEffect(() => {
    refreshAll();
  }, [crop, quantityQtl, moisture, cashDays]);

  // Handle Real Camera Capture & CV Inference
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/farmer-hub/scan-grain-cv`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_base64: reader.result })
        });
        const data = await res.json();
        setScanResult(data);
        if (data.detected_moisture_pct) setMoisture(data.detected_moisture_pct);
        if (data.detected_defect_pct) setDefectPct(data.detected_defect_pct);
      } catch (err) {
        console.error(err);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const registerBuyerBid = async () => {
    if (!buyerName.trim()) return;
    try {
      await fetch(`${apiUrl}/api/farmer-hub/register-buyer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: buyerName,
          buyer_type: "Corporate Procurement",
          location_name: "Khanna Agro Complex",
          offered_price_per_qtl: Number(buyerRate),
          min_quantity_qtl: Number(buyerMinLot),
          required_crop: crop
        })
      });
      alert(`Quote of ₹${buyerRate}/Qtl submitted by ${buyerName}!`);
      setBuyerName("");
      refreshAll();
    } catch (e) {}
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 font-sans">
      {/* Top Role Selector Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl flex flex-wrap justify-between items-center gap-3 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌱</span>
          <div>
            <h1 className="text-base font-black tracking-tight">AgriSetu AI Enterprise Gateway</h1>
            <p className="text-[10px] text-emerald-400 font-mono">PyTorch LSTM + Computer Vision Active</p>
          </div>
        </div>

        {/* Role Toggle Switch */}
        <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700 text-xs">
          <button
            onClick={() => setRole("farmer")}
            className={`px-4 py-1.5 rounded-xl font-bold transition ${
              role === "farmer" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            👨‍🌾 Farmer View (Gurpreet Singh)
          </button>
          <button
            onClick={() => setRole("buyer")}
            className={`px-4 py-1.5 rounded-xl font-bold transition ${
              role === "buyer" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            🏢 Corporate Buyer Portal
          </button>
        </div>
      </div>

      {/* Production Integrations Monitor */}
      <LiveSystemsFeed />

      {role === "buyer" ? (
        /* ================= BUYER PORTAL ================= */
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <span className="bg-amber-100 text-amber-900 text-[11px] font-black px-3 py-1 rounded-full uppercase">
              Corporate Reverse Auction Desk
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-2">Post Live Procurement Quote</h2>
            <p className="text-xs text-slate-500">Quotes are committed directly to SQLite & matched with local smallholders.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Company / Mill Name:</label>
              <input
                type="text"
                placeholder="e.g. Nestlé Agri Sourcing"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Bid Price (₹/Quintal):</label>
              <input
                type="number"
                value={buyerRate}
                onChange={(e) => setBuyerRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Minimum Lot Required (Qtl):</label>
              <input
                type="number"
                value={buyerMinLot}
                onChange={(e) => setBuyerMinLot(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900"
              />
            </div>
          </div>

          <button
            onClick={registerBuyerBid}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-2xl text-xs transition"
          >
            + Publish Live Procurement Contract
          </button>
        </div>
      ) : (
        /* ================= FARMER DASHBOARD ================= */
        <div className="space-y-6">
          {/* Real-time Voice Engine */}
          <VoiceAssistant />

          {/* COMPUTER VISION GRAIN QUALITY SCANNER */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>🔬</span>
                  <span>AI Grain Moisture & Defect Scanner (Computer Vision)</span>
                </h2>
                <p className="text-xs text-slate-500">Capture or upload grain sample to calculate moisture % and zero-cut FCI pass.</p>
              </div>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                <span>📷</span>
                <span>{isScanning ? "Analyzing Pixels..." : "Scan Grain Sample"}</span>
              </button>
            </div>

            {scanResult && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-slate-400 font-bold block text-[10px]">Detected Moisture</span>
                  <span className="text-lg font-black text-emerald-800">{scanResult.detected_moisture_pct}%</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-slate-400 font-bold block text-[10px]">Defect Pixel Ratio</span>
                  <span className="text-lg font-black text-emerald-800">{scanResult.detected_defect_pct}%</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-slate-400 font-bold block text-[10px]">Uniformity Score</span>
                  <span className="text-lg font-black text-emerald-800">{scanResult.grain_uniformity_score}%</span>
                </div>
                <div className="bg-emerald-700 text-white p-2.5 rounded-xl flex flex-col justify-center">
                  <span className="text-[10px] font-bold block text-emerald-200">Quality Certificate</span>
                  <span className="text-xs font-black">{scanResult.assigned_grade}</span>
                </div>
              </div>
            )}
          </div>

          {/* 14-DAY PYTORCH LSTM FORECAST CHART */}
          {pytorchForecast && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded">
                    {pytorchForecast.model_architecture}
                  </span>
                  <h2 className="text-base font-black text-slate-900 mt-1">14-Day PyTorch AI Price Forecast</h2>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                  Optimal Window: {pytorchForecast.optimal_sell_window}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
                {pytorchForecast.forecast_14_days?.map((f: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border transition ${
                      f.recommendation.includes("PEAK")
                        ? "bg-amber-50 border-amber-400 shadow-xs"
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-bold block">{f.date}</span>
                    <span className="text-sm font-black text-slate-900 block mt-0.5">₹{f.predicted_price}</span>
                    <span className={`text-[9px] font-bold block mt-1 ${
                      f.recommendation.includes("PEAK") ? "text-amber-800 font-black" : "text-slate-500"
                    }`}>
                      {f.recommendation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REAL BUYER DISCOVERY */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>🤝</span>
              <span>Matched Buyers Ready for Your Crop ({matches.length})</span>
            </h2>

            <div className="space-y-3">
              {matches.map((b, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-sm">{b.buyer_name}</h3>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {b.match_score}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">📍 {b.location} • <strong>{b.distance_km} km away</strong> ({b.drive_time})</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-emerald-700">₹{b.offered_price}/Qtl</span>
                    <button
                      onClick={async () => {
                        await fetch(`${apiUrl}/api/farmer-hub/book-sale`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            farmer_id: "F-GURPREET-01",
                            farmer_name: "Gurpreet Singh",
                            buyer_id: b.buyer_id,
                            crop: crop,
                            quantity_qtl: quantityQtl,
                            offered_price: b.offered_price,
                            delivery_location: b.location
                          })
                        });
                        alert("Confirmed sale request dispatched!");
                        refreshAll();
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                    >
                      Request Sale
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}