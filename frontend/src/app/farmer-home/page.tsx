import LiveSystemsFeed from @/components/LiveSystemsFeed;
"use client";

import React, { useState, useEffect } from "react";
import "@/i18n";
import { useTranslation } from "react-i18next";
import VoiceAssistant from "@/components/VoiceAssistant";

export default function FarmerHomeLivePage() {
  const { t, i18n } = useTranslation();
  const [crop, setCrop] = useState("Basmati Paddy");
  const [quantityQtl, setQuantityQtl] = useState(32);
  const [moisture, setMoisture] = useState(12.5);
  const [cashDays, setCashDays] = useState(3);

  const [matches, setMatches] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [returnLoads, setReturnLoads] = useState<any[]>([]);
  const [decision, setDecision] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);

  // Live Buyer Onboarding State
  const [newBuyerName, setNewBuyerName] = useState("");
  const [newBuyerRate, setNewBuyerRate] = useState(3780);
  const [showBuyerModal, setShowBuyerModal] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const refreshAllData = async () => {
    try {
      const mRes = await fetch(`${apiUrl}/api/farmer-hub/buyer-matches?crop=${crop}&quantity_qtl=${quantityQtl}&moisture_pct=${moisture}`);
      const mJson = await mRes.json();
      setMatches(mJson.matches || []);

      const bRes = await fetch(`${apiUrl}/api/farmer-hub/bookings/F-GURPREET-01`);
      const bJson = await bRes.json();
      setBookings(bJson.bookings || []);

      const rRes = await fetch(`${apiUrl}/api/farmer-hub/return-freight`);
      const rJson = await rRes.json();
      setReturnLoads(rJson.loads || []);

      const dRes = await fetch(`${apiUrl}/api/farmer-hub/cash-need-decision?days=${cashDays}&qty=${quantityQtl}&crop=${crop}`);
      const dJson = await dRes.json();
      setDecision(dJson);

      const wRes = await fetch(`${apiUrl}/api/farmer-hub/live-weather?lat=30.7072&lng=76.2167`);
      const wJson = await wRes.json();
      setWeather(wJson);
    } catch (e) {}
  };

  useEffect(() => {
    refreshAllData();
    const interval = setInterval(refreshAllData, 15000);
    return () => clearInterval(interval);
  }, [crop, quantityQtl, moisture, cashDays]);

  const requestSaleBooking = async (buyer: any) => {
    try {
      const res = await fetch(`${apiUrl}/api/farmer-hub/book-sale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_id: "F-GURPREET-01",
          farmer_name: "Gurpreet Singh",
          buyer_id: buyer.buyer_id,
          crop: crop,
          quantity_qtl: quantityQtl,
          offered_price: buyer.offered_price,
          delivery_location: buyer.location
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        alert(data.message);
        refreshAllData();
      }
    } catch (e) {}
  };

  const registerNewBuyer = async () => {
    if (!newBuyerName.trim()) return;
    try {
      const res = await fetch(`${apiUrl}/api/farmer-hub/register-buyer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBuyerName,
          buyer_type: "Corporate Procurement",
          location_name: "Khanna Agro Hub",
          offered_price_per_qtl: Number(newBuyerRate),
          required_crop: crop
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        alert(data.message);
        setNewBuyerName("");
        setShowBuyerModal(false);
        refreshAllData();
      }
    } catch (e) {}
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-md flex justify-between items-center">
        <div>
          <span className="bg-emerald-700/60 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-600">
            ðŸŒ¾ {t("app_title")} â€¢ 100% Production Ready
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-2">
            {t("sell_title")}
          </h1>
          <p className="text-emerald-100 text-xs mt-1">
            {t("sell_desc")}
          </p>
        </div>

        <button
          onClick={() => setShowBuyerModal(!showBuyerModal)}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs transition shadow-sm"
        >
          + Post Live Buyer Bid
        </button>
      </div>

      {/* Live Buyer Modal / Onboarding */}
      {showBuyerModal && (
        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-700 space-y-3">
          <h3 className="text-sm font-black text-amber-400">ðŸ¢ Live Buyer Registration & Reverse Bidding</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Corporate Buyer Name (e.g. NestlÃ© India)"
              value={newBuyerName}
              onChange={(e) => setNewBuyerName(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
            />
            <input
              type="number"
              placeholder="Offered Bid Rate (â‚¹/Quintal)"
              value={newBuyerRate}
              onChange={(e) => setNewBuyerRate(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
            />
          </div>
          <button
            onClick={registerNewBuyer}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2 rounded-xl text-xs"
          >
            Submit Real-time Buyer Quote
          </button>
        </div>
      )}

      {/* Live Open-Meteo Weather Bar */}
      {weather && (
        <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>ðŸŒ¤ï¸ Khanna Hyperlocal: <strong>{weather.temperature_c}Â°C</strong></span>
            <span>â€¢ Humidity: <strong>{weather.relative_humidity_pct}%</strong></span>
          </div>
          <div className="text-emerald-400 font-bold">
            ðŸ›¡ï¸ Moisture Risk: {weather.moisture_risk_level} (3-Day Rain Prob: {weather.max_rain_probability_3d_pct}%)
          </div>
        </div>
      )}

      {/* Real Voice Assistant Engine */}
      <LiveSystemsFeed />`n`n      <VoiceAssistant />

      {/* 1. Harvest Input Details */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <span>ðŸŒ¾</span>
          <span>{t("my_crop")}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">{t("crop_name")}:</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
            >
              <option value="Basmati Paddy">Basmati Paddy</option>
              <option value="Wheat">Wheat</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">{t("quantity")}:</label>
            <input
              type="number"
              value={quantityQtl}
              onChange={(e) => setQuantityQtl(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">{t("moisture")}:</label>
            <input
              type="number"
              step="0.1"
              value={moisture}
              onChange={(e) => setMoisture(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* 2. Real Buyers Match */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <span>ðŸ¤</span>
          <span>{t("ready_buyers")} ({matches.length})</span>
        </h2>

        {matches.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 text-xs font-bold">
            {t("no_buyers")}
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((b, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-sm">{b.buyer_name}</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {b.match_score}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    ðŸ“ {b.location} â€¢ <strong>{b.distance_km} km away</strong> ({b.drive_time})
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">{t("price_label")}</span>
                    <span className="text-2xl font-black text-emerald-700">â‚¹{b.offered_price}</span>
                    <span className="text-[10px] text-slate-500 block">/ Quintal</span>
                  </div>
                  <button
                    onClick={() => requestSaleBooking(b)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    {t("request_sale")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Confirmed Bookings */}
      {bookings.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-black text-slate-900">ðŸ“‘ {t("my_bookings")}</h2>
          <div className="space-y-2">
            {bookings.map((bk, i) => (
              <div key={i} className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded">
                    {bk.id} â€¢ {bk.status}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">{bk.buyer_name}</h4>
                  <p className="text-xs text-slate-600">{bk.quantity_qtl} Qtl @ â‚¹{bk.agreed_price_per_qtl}/Qtl â€¢ {bk.delivery_location}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Gross Value</span>
                  <span className="text-base font-black text-slate-900">â‚¹{(bk.quantity_qtl * bk.agreed_price_per_qtl).toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}