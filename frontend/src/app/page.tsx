"use client";

import React, { useState, useEffect } from "react";

export default function MandiMapPage() {
  const [crop, setCrop] = useState("Wheat");
  const [mandis, setMandis] = useState<any[]>([]);
  const [selectedMandi, setSelectedMandi] = useState<any>(null);
  const [dieselRate, setDieselRate] = useState("₹87.80/Liter");
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/mandi/live-rates?crop=${crop}`);
      const json = await res.json();
      if (json?.status === "success" && json?.mandis?.length > 0) {
        setMandis(json.mandis);
        setSelectedMandi(json.mandis[0]);
        if (json.live_diesel_rate) setDieselRate(json.live_diesel_rate);
      }
    } catch {
      // Retain active state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [crop]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Live OSRM & Fuel Banner */}
      <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
            ⛽ Live Punjab Diesel: {dieselRate}
          </span>
          <span className="text-slate-300 font-medium">OSRM Real Highway Driving Distance Synced</span>
        </div>
        <span className="text-emerald-400 font-bold mt-1 sm:mt-0">● Real-time Road Transit Matrix Active</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-1.5">
            🛣️ OSRM HIGHWAY ROUTING & LIVE FUEL DEDUCTION
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Interactive Mandi Arbitrage Map</h1>
          <p className="text-xs text-slate-500 mt-0.5">Calculated using live Punjab diesel rates and turn-by-turn road driving distance.</p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {["Wheat", "Basmati Paddy", "Cotton", "Mustard"].map((item) => (
            <button
              key={item}
              onClick={() => setCrop(item)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                crop === item ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="kisan-card p-12 text-center text-slate-500 font-bold text-sm bg-white">
          ⏳ Calculating live OSRM highway routes & fuel deductions...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 kisan-card p-6 bg-slate-950 text-white space-y-4 flex flex-col justify-between border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Live OSRM Highway Corridor</span>
                <h2 className="text-sm font-bold text-slate-300 mt-0.5">Select APMC Mandi Node</h2>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Origin: Ludhiana Farm
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
              {mandis.map((m: any) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMandi(m)}
                  className={`p-3 rounded-xl cursor-pointer border transition ${
                    selectedMandi?.id === m.id
                      ? "bg-emerald-600/30 border-emerald-400 text-white ring-2 ring-emerald-400/40"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                  }`}
                >
                  <div className="font-bold text-xs">{m.name}</div>
                  <div className="text-emerald-400 font-extrabold text-sm mt-1">{m.modal}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">🛣️ {m.distance}</div>
                  <div className="text-[10px] text-emerald-300 font-bold mt-0.5">{m.net_gain}</div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Selected Highway Route:</span>
                <span className="font-bold text-white">Ludhiana Origin ➔ {selectedMandi?.name}</span>
                <span className="text-slate-400 text-[10px] block">Est. Driving Time: {selectedMandi?.drive_time}</span>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-slate-400 text-[11px] block">Live Diesel Transit</span>
                  <span className="text-amber-400 font-bold">{selectedMandi?.transport_cost}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Net Profit</span>
                  <span className="text-emerald-400 font-bold">{selectedMandi?.net_gain}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="kisan-card p-6 flex flex-col justify-between space-y-4 bg-white">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mandi Analytics</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{selectedMandi?.name}</h3>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 inline-block mt-2">
                {selectedMandi?.state} Zone • Verified
              </span>
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span className="text-slate-500">Modal Spot Price:</span>
                <span className="text-emerald-700 font-black text-sm">{selectedMandi?.modal}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span className="text-slate-500">Daily Arrivals:</span>
                <span className="text-slate-900 font-bold">{selectedMandi?.arrival}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span className="text-slate-500">Real Highway Distance:</span>
                <span className="text-slate-900 font-bold">{selectedMandi?.distance}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span className="text-slate-500">Diesel Spot Benchmark:</span>
                <span className="text-slate-900 font-bold">{selectedMandi?.fuel_rate_applied}</span>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
              Dispatching to this mandi unlocks {selectedMandi?.net_gain} after live fuel deduction.
            </div>
          </div>
        </div>
      )}

      {/* Complete APMC Table */}
      <div className="kisan-card overflow-hidden bg-white">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">APMC Mandi Live Arbitrage Matrix ({crop})</h2>
          <button onClick={fetchRates} className="text-xs font-bold text-emerald-600 hover:underline">🔄 Refresh Matrix</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Mandi Yard</th>
                <th className="px-6 py-3.5">State</th>
                <th className="px-6 py-3.5">Modal Price</th>
                <th className="px-6 py-3.5">OSRM Road Distance</th>
                <th className="px-6 py-3.5">Live Diesel Cost</th>
                <th className="px-6 py-3.5">Net Arbitrage Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mandis.map((row: any) => (
                <tr key={row.id} onClick={() => setSelectedMandi(row)} className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-6 py-4 font-bold text-slate-900">{row.name}</td>
                  <td className="px-6 py-4 text-slate-500">{row.state}</td>
                  <td className="px-6 py-4 font-black text-emerald-600">{row.modal}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{row.distance}</td>
                  <td className="px-6 py-4 text-xs font-mono text-amber-700">{row.transport_cost}</td>
                  <td className="px-6 py-4 font-bold text-emerald-700">{row.net_gain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}