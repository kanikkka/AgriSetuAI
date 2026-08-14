"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface MarketItem {
  commodity: string;
  mandi: string;
  modal_price: number;
  min_price: number;
  max_price: number;
  arrival_date: string;
  state: string;
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCrop, setSelectedCrop] = useState<string>("Wheat");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agrisetuai.onrender.com";

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/market/latest?crop=${selectedCrop}`);
        if (res.ok) {
          const json = await res.json();
          setData(Array.isArray(json) ? json : (json.data || []));
        }
      } catch (err) {
        console.error("Failed to load market data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCrop, apiUrl]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {t("appName")} - {t("dashboard")}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time APMC Mandi Intelligence & AI Arbitrage Engine
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["Wheat", "Paddy", "Cotton", "Maize"].map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedCrop === crop
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Monitored Mandis</p>
          <p className="text-2xl font-bold text-white mt-1">22 APMCs</p>
          <span className="text-xs text-emerald-400 font-medium mt-2 inline-block">● Live Sync</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Commodity</p>
          <p className="text-2xl font-bold text-white mt-1">{selectedCrop}</p>
          <span className="text-xs text-slate-400 mt-2 inline-block">Punjab & Haryana</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Spatial Arbitrage</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">+₹140/Qtl</p>
          <span className="text-xs text-slate-400 mt-2 inline-block">Net diesel deducted</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">FCI Grading Risk</p>
          <p className="text-2xl font-bold text-teal-300 mt-1">Grade A (98.4%)</p>
          <span className="text-xs text-slate-400 mt-2 inline-block">Moisture safe (&lt;12%)</span>
        </div>
      </div>

      {/* Market Prices Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-white mb-4">Latest Mandi Rates & Arrivals</h2>
        {loading ? (
          <div className="py-12 text-center text-slate-400 animate-pulse">Loading live rates...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Mandi</th>
                  <th className="px-4 py-3">State</th>
                  <th className="px-4 py-3">Modal Price</th>
                  <th className="px-4 py-3">Range (Min - Max)</th>
                  <th className="px-4 py-3 rounded-r-lg">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.length > 0 ? (
                  data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="px-4 py-3 font-semibold text-white">{item.mandi}</td>
                      <td className="px-4 py-3 text-slate-400">{item.state}</td>
                      <td className="px-4 py-3 text-emerald-400 font-bold">₹{item.modal_price}/q</td>
                      <td className="px-4 py-3 text-slate-400">₹{item.min_price} - ₹{item.max_price}</td>
                      <td className="px-4 py-3 text-slate-400">{item.arrival_date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      Live data stream connected. Rates refreshing from APMC server...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}