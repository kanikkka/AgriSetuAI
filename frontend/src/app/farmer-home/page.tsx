"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function FarmerHomeLivePage() {
  const { language, setLanguage, t } = useLanguage();
  const [crop, setCrop] = useState("Basmati Paddy");
  const [quantityQtl, setQuantityQtl] = useState(32);
  const [moisture, setMoisture] = useState(12.5);
  const [cashDays, setCashDays] = useState(3);

  const [matches, setMatches] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [returnLoads, setReturnLoads] = useState<any[]>([]);
  const [decision, setDecision] = useState<any>(null);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [voiceReply, setVoiceReply] = useState("");

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
          farmer_phone: "+91 98765 43210",
          buyer_id: buyer.buyer_id,
          crop: crop,
          variety: "PB-1121",
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
    } catch (e) {
      alert("Error processing booking.");
    }
  };

  const submitVoiceQuery = async () => {
    if (!voiceQuery) return;
    try {
      const res = await fetch(`${apiUrl}/api/farmer-hub/voice-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: voiceQuery, lang: language })
      });
      const json = await res.json();
      setVoiceReply(json.spoken_response);
    } catch (e) {}
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 font-sans">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-emerald-700/60 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-600">
            🌾 {t("app_name")}
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-2">
            {t("sell_before_travel")}
          </h1>
          <p className="text-emerald-100 text-xs mt-1">
            {t("sell_subtext")}
          </p>
        </div>
      </div>

      {/* 1. Harvest Input Details */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <span>🌾</span>
          <span>{t("my_harvest")}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">{t("select_crop")}:</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
            >
              <option value="Basmati Paddy">Basmati Paddy (ਝੋਨਾ / धान)</option>
              <option value="Wheat">Wheat (ਕਣਕ / गेहूँ)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">{t("quantity_qtl")}:</label>
            <input
              type="number"
              value={quantityQtl}
              onChange={(e) => setQuantityQtl(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">{t("moisture_pct")}:</label>
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
        <div className="flex justify-between items-center">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <span>🤝</span>
            <span>{t("real_buyers")} ({matches.length})</span>
          </h2>
        </div>

        {matches.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 text-xs font-bold">
            {t("no_buyers")}
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((b, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-slate-50/50 hover:bg-white transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-sm">{b.buyer_name}</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {b.match_score}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    📍 {b.location} • <strong>{b.distance_km} km {t("distance_away")}</strong> ({b.drive_time})
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">{t("offered_price")}</span>
                    <span className="text-xl font-black text-emerald-700">₹{b.offered_price}</span>
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

      {/* 3. Bookings */}
      {bookings.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-black text-slate-900">📑 {t("my_bookings")}</h2>
          <div className="space-y-2">
            {bookings.map((bk, i) => (
              <div key={i} className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded">
                    {bk.id} • {bk.status}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">{bk.buyer_name}</h4>
                  <p className="text-xs text-slate-600">{bk.quantity_qtl} Qtl @ ₹{bk.agreed_price_per_qtl}/Qtl • {bk.delivery_location}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">{t("gross_value")}</span>
                  <span className="text-base font-black text-slate-900">₹{(bk.quantity_qtl * bk.agreed_price_per_qtl).toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Cash Need Mode */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <span>💰</span>
          <span>{t("money_needed_by")}</span>
        </h2>
        <div className="flex gap-2">
          {[
            { d: 1, key: "today" },
            { d: 3, key: "days_3" },
            { d: 7, key: "days_7" },
            { d: 15, key: "days_15" },
            { d: 30, key: "days_30" }
          ].map((item) => (
            <button
              key={item.d}
              onClick={() => setCashDays(item.d)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                cashDays === item.d ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              {t(item.key)}
            </button>
          ))}
        </div>
        {decision && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                {t("recommended")}: {decision.decision}
              </span>
              <span className="text-sm font-black text-slate-900">
                ₹{decision.total_estimated_value?.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-xs text-slate-600">{decision.rationale}</p>
          </div>
        )}
      </div>

      {/* 5. Return Freight */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <span>🚛</span>
          <span>{t("return_freight")}</span>
        </h2>
        {returnLoads.length === 0 ? (
          <p className="text-xs text-slate-500 font-bold bg-slate-50 p-4 rounded-xl border">
            {t("no_return_load")}
          </p>
        ) : (
          <div className="space-y-2">
            {returnLoads.map((r, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{r.transporter} ({r.vehicle_type})</h4>
                  <p className="text-[11px] text-slate-500">Route: {r.return_route} • Cargo: {r.return_cargo}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 font-bold block">{t("save_freight")}</span>
                  <span className="text-sm font-black text-emerald-800">+₹{r.potential_freight_saving}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Voice Assistant */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <span>🎤</span>
          <span>{t("talk_to_agrisetu")}</span>
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={t("voice_placeholder")}
            value={voiceQuery}
            onChange={(e) => setVoiceQuery(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-900"
          />
          <button
            onClick={() => submitVoiceQuery()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
          >
            {t("ask_button")}
          </button>
        </div>
        {voiceReply && (
          <div className="p-3 bg-emerald-50 text-emerald-950 font-bold text-xs rounded-xl border border-emerald-200">
            📢 {voiceReply}
          </div>
        )}
      </div>
    </div>
  );
}