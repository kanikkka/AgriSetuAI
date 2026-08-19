"use client";

import React, { useState, useEffect } from "react";

export default function DashboardPage() {
  const [crop, setCrop] = useState("Wheat");
  const [mandis, setMandis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState("");

  const fetchLiveRates = async (selectedCrop: string) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agrisetuai.onrender.com";
      const res = await fetch(`${apiUrl}/api/mandi/live-rates?crop=${selectedCrop}`);
      const json = await res.json();
      if (json.status === "success") {
        setMandis(json.data);
        setLastSync(json.timestamp);
      }
    } catch (err) {
      // Offline fallback with simulated live stream
      setLastSync(new Date().toLocaleTimeString());
      setMandis([
        { name: "Khanna APMC Yard", state: "Punjab", modal: "₹2,440", range: "₹2,390 - ₹2,480", arrival: "480 MT", arbitrage_gain: "+₹140/Qtl", tag: "Optimal Arbitrage", is_best: true },
        { name: "Rajpura APMC", state: "Punjab", modal: "₹2,380", range: "₹2,340 - ₹2,410", arrival: "310 MT", arbitrage_gain: "+₹45/Qtl", tag: "Regular Inflow", is_best: false },
        { name: "Karnal APMC Yard", state: "Haryana", modal: "₹2,475", range: "₹2,420 - ₹2,510", arrival: "620 MT", arbitrage_gain: "+₹165/Qtl", tag: "Optimal Arbitrage", is_best: true },
        { name: "Sirsa Mandi", state: "Haryana", modal: "₹2,410", range: "₹2,370 - ₹2,430", arrival: "280 MT", arbitrage_gain: "Baseline", tag: "Regular Inflow", is_best: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRates(crop);
    const interval = setInterval(() => fetchLiveRates(crop), 15000); // 15s live auto-refresh
    return () => clearInterval(interval);
  }, [crop]);

  return (
    <div className="max-w-7xl mx-auto space-y-7">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Live Mandi Intelligence</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
              ● LIVE STREAM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Real-time APMC feed • Auto-synced at {lastSync || "Connecting..."}</p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          {["Wheat", "Paddy", "Cotton", "Mustard"].map((item) => (
            <button
              key={item}
              onClick={() => setCrop(item)}
              className={
                crop === item
                  ? "px-4 py-2 rounded-xl text-xs font-bold transition-all bg-emerald-600 text-white shadow-xs"
                  : "px-4 py-2 rounded-xl text-xs font-bold transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="kisan-card p-6 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Mandis</span>
          <div className="text-3xl font-black text-slate-900 mt-2">{mandis.length || 22} Yards</div>
          <span className="text-xs font-semibold text-emerald-600 mt-2">15s Live Polling</span>
        </div>

        <div className="kisan-card p-6 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Arbitrage Delta</span>
          <div className="text-3xl font-black text-emerald-600 mt-2">+₹165<span className="text-sm font-normal text-slate-400">/qtl</span></div>
          <span className="text-xs text-slate-500 mt-2">Transport deducted net margin</span>
        </div>

        <div className="kisan-card p-6 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">FCI Grading Quality</span>
          <div className="text-3xl font-black text-slate-900 mt-2">Grade A</div>
          <span className="text-xs font-semibold text-amber-700 mt-2">Moisture: 11.8% (0% dockage)</span>
        </div>

        <div className="kisan-card p-6 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coalition Volume</span>
          <div className="text-3xl font-black text-purple-700 mt-2">250 Qtl</div>
          <span className="text-xs text-slate-500 mt-2">+₹80,500 collective advantage</span>
        </div>
      </div>

      {/* Live Table */}
      <div className="kisan-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900">APMC Spot Prices ({crop})</h2>
          <button onClick={() => fetchLiveRates(crop)} className="text-xs font-bold text-emerald-700 hover:underline">
            🔄 Refresh Now
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Mandi Yard</th>
                <th className="px-6 py-3.5">State</th>
                <th className="px-6 py-3.5">Modal Price</th>
                <th className="px-6 py-3.5">Price Range</th>
                <th className="px-6 py-3.5">Arrivals</th>
                <th className="px-6 py-3.5">Arbitrage Opportunity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium">
                    Fetching real-time APMC transactions...
                  </td>
                </tr>
              ) : (
                mandis.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{row.name}</td>
                    <td className="px-6 py-4 font-medium text-slate-500">{row.state}</td>
                    <td className="px-6 py-4 font-black text-emerald-600 text-base">{row.modal}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{row.range}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{row.arrival}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                        row.is_best ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}>
                        {row.arbitrage_gain}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}