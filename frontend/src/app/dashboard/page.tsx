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
      if (json?.status === "success" && json?.mandis?.length > 0) {
        setMandis(json.mandis);
        setSelectedMandi(json.mandis[0]);
      } else {
        setMandis([]);
        setSelectedMandi(null);
      }
    } catch {
      setMandis([]);
      setSelectedMandi(null);
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
            🗺️ LIVE BACKEND GRID
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Interactive Mandi Arbitrage Map</h1>
          <p className="text-xs text-slate-500 mt-0.5">Direct connection to SQLite Database & API Node.</p>
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
          ⏳ Fetching live data from backend server...
        </div>
      ) : mandis.length === 0 ? (
        <div className="kisan-card p-12 text-center text-red-500 font-bold text-sm bg-white border-red-200">
          ⚠️ Backend se live data connect nahi hua. Make sure backend server is running.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 kisan-card p-6 bg-slate-950 text-white space-y-4 flex flex-col justify-between border-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Live Database Nodes</span>
                  <h2 className="text-sm font-bold text-slate-300 mt-0.5">Select a Mandi Node</h2>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ● Live Feed Active
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                {mandis.map((m: any) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMandi(m)}
                    className={`p-3 rounded-xl cursor-pointer border transition ${
                      selectedMandi?.id === m.id
                        ? "bg-emerald-600/30 border-emerald-400 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                    }`}
                  >
                    <div className="font-bold text-xs">{m.name}</div>
                    <div className="text-emerald-400 font-extrabold text-sm mt-1">{m.modal}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{m.distance} • {m.net_gain}</div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Selected:</span>
                  <span className="font-bold text-white">{selectedMandi?.name}</span>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Diesel Cost</span>
                    <span className="text-amber-400 font-bold">{selectedMandi?.transport_cost}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Net Realization</span>
                    <span className="text-emerald-400 font-bold">{selectedMandi?.net_gain}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="kisan-card p-6 flex flex-col justify-between space-y-4 bg-white">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Metrics</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{selectedMandi?.name}</h3>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 inline-block mt-2">
                  {selectedMandi?.state} Zone
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
                  <span className="text-slate-500">Distance:</span>
                  <span className="text-slate-900 font-bold">{selectedMandi?.distance}</span>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
                Net gain: {selectedMandi?.net_gain}
              </div>
            </div>
          </div>

          <div className="kisan-card overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Official Database Mandi Feed ({crop})</h2>
              <button onClick={fetchRates} className="text-xs font-bold text-emerald-600 hover:underline">🔄 Refresh</button>
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
                    <th className="px-6 py-3.5">Net Arbitrage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mandis.map((row: any) => (
                    <tr key={row.id} onClick={() => setSelectedMandi(row)} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-6 py-4 font-bold text-slate-900">{row.name}</td>
                      <td className="px-6 py-4 text-slate-500">{row.state}</td>
                      <td className="px-6 py-4 font-black text-emerald-600">{row.modal}</td>
                      <td className="px-6 py-4 text-xs">{row.distance}</td>
                      <td className="px-6 py-4 text-xs font-mono text-amber-700">{row.transport_cost}</td>
                      <td className="px-6 py-4 font-bold text-emerald-700">{row.net_gain}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}