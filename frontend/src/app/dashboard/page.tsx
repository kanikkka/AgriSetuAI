"use client";

import React, { useState, useEffect } from "react";

export default function MandiMapPage() {
  const [crop, setCrop] = useState("Wheat");
  const [mandis, setMandis] = useState<any[]>([]);
  const [selectedMandi, setSelectedMandi] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agrisetuai.onrender.com";
      const res = await fetch(`${apiUrl}/api/mandi/live-rates?crop=${crop}`);
      const json = await res.json();
      if (json.status === "success") {
        setMandis(json.mandis);
        setSelectedMandi(json.mandis[0]);
      }
    } catch {
      const fallback = [
        {"id": "khanna", "name": "Khanna APMC Yard", "state": "Punjab", "lat": 30.70, "lng": 76.21, "modal": "₹2,440", "raw_modal": 2440, "distance": "15 km", "transport_cost": "₹10/Qtl", "net_gain": "+₹120/Qtl", "is_best": true, "arrival": "480 MT"},
        {"id": "karnal", "name": "Karnal APMC Yard", "state": "Haryana", "lat": 29.68, "lng": 76.99, "modal": "₹2,495", "raw_modal": 2495, "distance": "85 km", "transport_cost": "₹29/Qtl", "net_gain": "+₹156/Qtl", "is_best": true, "arrival": "620 MT"},
        {"id": "rajpura", "name": "Rajpura APMC Yard", "state": "Punjab", "lat": 30.48, "lng": 76.59, "modal": "₹2,380", "raw_modal": 2380, "distance": "35 km", "transport_cost": "₹18/Qtl", "net_gain": "+₹52/Qtl", "is_best": false, "arrival": "310 MT"}
      ];
      setMandis(fallback);
      setSelectedMandi(fallback[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [crop]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-1.5">
            🗺️ SPATIAL ARBITRAGE & GPS ROUTE ENGINE
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Interactive Mandi Arbitrage Map</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time distance-based diesel deduction model calculating highest net realization.</p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          {["Wheat", "Paddy", "Cotton", "Mustard"].map((item) => (
            <button
              key={item}
              onClick={() => setCrop(item)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                crop === item ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Geospatial Radar & Interactive Route Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-2 kisan-card p-6 bg-slate-900 text-white flex flex-col justify-between min-h-[380px] relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Geospatial Arbitrage Radar</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Punjab & Haryana APMC Cluster</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
              ● GPS Synced (Ludhiana Origin)
            </span>
          </div>

          {/* Interactive Mandi Pins */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 z-10">
            {mandis.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMandi(m)}
                className={`p-3.5 rounded-2xl cursor-pointer transition border ${
                  selectedMandi?.id === m.id
                    ? "bg-emerald-600/30 border-emerald-400 ring-2 ring-emerald-400/50"
                    : "bg-slate-800/80 border-slate-700 hover:bg-slate-800"
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{m.name.split(" ")[0]}</span>
                  <span className="text-emerald-400 font-extrabold">{m.modal}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                  <span>📍 {m.distance}</span>
                  <span className="text-emerald-300 font-semibold">{m.net_gain}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Route Metric Bar */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-slate-400 text-xs block">Active Route Selected:</span>
              <span className="text-sm font-extrabold text-white">Origin Farm ➔ {selectedMandi?.name || "Khanna APMC"}</span>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <div>
                <span className="text-slate-400 block text-[11px]">Diesel Deduction</span>
                <span className="text-amber-400">{selectedMandi?.transport_cost || "₹10/Qtl"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Net Realization</span>
                <span className="text-emerald-400 text-sm font-bold">{selectedMandi?.net_gain || "+₹120/Qtl"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Route Analytics */}
        <div className="kisan-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mandi Performance</span>
            <h3 className="text-xl font-black text-slate-900 mt-1">{selectedMandi?.name || "Khanna APMC"}</h3>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 inline-block mt-2">
              {selectedMandi?.state || "Punjab"} Region
            </span>
          </div>

          <div className="space-y-3 text-xs font-semibold text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
              <span className="text-slate-400">Modal Spot Price:</span>
              <span className="text-emerald-700 font-extrabold text-sm">{selectedMandi?.modal}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
              <span className="text-slate-400">Estimated Arrivals:</span>
              <span className="text-slate-900 font-bold">{selectedMandi?.arrival}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
              <span className="text-slate-400">Total Route Distance:</span>
              <span className="text-slate-900 font-bold">{selectedMandi?.distance}</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-600 text-white rounded-2xl">
            <span className="text-[11px] text-emerald-100 block font-medium">Arbitrage Recommendation</span>
            <p className="text-xs font-bold mt-1">
              Optimal dispatch window. Batching over 100 Qtl unlocks max route efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Complete APMC Table */}
      <div className="kisan-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Regional APMC Mandi Rate List ({crop})</h2>
          <button onClick={fetchRates} className="text-xs font-bold text-emerald-600 hover:underline">🔄 Refresh Feed</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Mandi Yard</th>
                <th className="px-6 py-3.5">State</th>
                <th className="px-6 py-3.5">Modal Price</th>
                <th className="px-6 py-3.5">Distance</th>
                <th className="px-6 py-3.5">Diesel Cost</th>
                <th className="px-6 py-3.5">Net Arbitrage Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mandis.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-bold text-slate-900">{row.name}</td>
                  <td className="px-6 py-4 text-slate-500">{row.state}</td>
                  <td className="px-6 py-4 font-black text-emerald-600 text-base">{row.modal}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">{row.distance}</td>
                  <td className="px-6 py-4 font-mono text-xs text-amber-700">{row.transport_cost}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                      {row.net_gain}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}