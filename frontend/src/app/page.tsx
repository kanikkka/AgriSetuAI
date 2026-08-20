"use client";

import React, { useState, useEffect } from "react";

export default function MandiMapPage() {
  const [crop, setCrop] = useState("Wheat");
  const [vehicle, setVehicle] = useState("tractor");
  const [poolMembers, setPoolMembers] = useState(1);
  const [mandis, setMandis] = useState<any[]>([]);
  const [selectedMandi, setSelectedMandi] = useState<any>(null);
  const [dieselRate, setDieselRate] = useState("₹87.80/Liter");
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(
        `${apiUrl}/api/mandi/live-rates?crop=${crop}&vehicle=${vehicle}&pool_members=${poolMembers}`
      );
      const json = await res.json();
      if (json?.status === "success" && json?.mandis?.length > 0) {
        setMandis(json.mandis);
        setSelectedMandi(json.mandis[0]);
        if (json.live_diesel_rate) setDieselRate(json.live_diesel_rate);
      }
    } catch {
      // Fallback display
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [crop, vehicle, poolMembers]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center border border-slate-800 text-xs gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
            ⛽ Spot Diesel: {dieselRate}
          </span>
          <span className="text-slate-300">OSRM Highway Routing + NHAI Tolls + Mandi Palledari Active</span>
        </div>
        <span className="text-emerald-400 font-bold">● Landed Realization Engine</span>
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-1.5">
            🚚 DYNAMIC FREIGHT & COALITION DISCOUNT CALCULATOR
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Interactive Mandi Arbitrage Map</h1>
          <p className="text-xs text-slate-500 mt-0.5">Compare true profit after deducting live fuel, highway tolls, labor, and shared pooling savings.</p>
        </div>

        {/* Crop Selector */}
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

      {/* Vehicle Type & Coalition Pooling Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Vehicle Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Select Transport Vehicle Type:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "pickup", name: "🛻 Pickup / Ace", spec: "30 Qtl (11.5 km/L)" },
              { id: "tractor", name: "🚜 Tractor Trolley", spec: "100 Qtl (4.5 km/L)" },
              { id: "truck", name: "🚛 10-W Truck", spec: "250 Qtl (3.0 km/L)" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setVehicle(v.id)}
                className={`p-2.5 rounded-xl border text-left transition ${
                  vehicle === v.id
                    ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="font-extrabold text-xs text-slate-900">{v.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{v.spec}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Coalition Shared Trolley Selector */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700">Trolley Sharing / Coalition Pooling:</label>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {poolMembers === 1 ? "Solo Farmer (100% Cost)" : `${poolMembers} Farmers Sharing (${Math.round(100 / poolMembers)}% Cost)`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Share transport with neighboring farms to slash fuel & toll charges.
            </p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => setPoolMembers(num)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  poolMembers === num
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {num === 1 ? "Solo (1)" : `Pool ${num}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Mandi Selection + Complete Landed Cost Breakdown */}
      {loading ? (
        <div className="kisan-card p-12 text-center text-slate-500 font-bold text-sm bg-white">
          ⏳ Computing full landed cost breakdown (Diesel + Tolls + Labor)...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mandi Cards */}
          <div className="lg:col-span-2 kisan-card p-6 bg-slate-950 text-white space-y-4 flex flex-col justify-between border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">APMC Mandi Hubs</span>
                <h2 className="text-sm font-bold text-slate-300 mt-0.5">Select Mandi for Landed Analysis</h2>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ludhiana Farm Origin
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-2">
              {mandis.map((m: any) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMandi(m)}
                  className={`p-3.5 rounded-xl cursor-pointer border transition ${
                    selectedMandi?.id === m.id
                      ? "bg-emerald-600/30 border-emerald-400 text-white ring-2 ring-emerald-400/40"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                  }`}
                >
                  <div className="font-bold text-xs">{m.name}</div>
                  <div className="text-emerald-400 font-black text-sm mt-1">{m.modal}</div>
                  <div className="text-[10px] text-slate-400 mt-1">🛣️ {m.distance}</div>
                  <div className="text-[11px] font-extrabold text-emerald-300 mt-0.5">
                    {poolMembers > 1 ? m.net_gain_pooled : m.net_gain}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Route Info Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Selected Mandi Corridor:</span>
                <span className="font-bold text-white">Ludhiana Origin ➔ {selectedMandi?.name}</span>
                <span className="text-slate-400 text-[10px] block">Est. Driving: {selectedMandi?.drive_time}</span>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-slate-400 text-[11px] block">Landed Freight</span>
                  <span className="text-amber-400 font-bold">
                    {poolMembers > 1 ? selectedMandi?.breakdown?.pooled_total : selectedMandi?.breakdown?.solo_total}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Net Realization</span>
                  <span className="text-emerald-400 font-black">
                    {poolMembers > 1 ? selectedMandi?.net_gain_pooled : selectedMandi?.net_gain}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Landed Cost Breakdown Card */}
          <div className="kisan-card p-6 flex flex-col justify-between space-y-4 bg-white">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Landed Cost Audit</span>
              <h3 className="text-xl font-black text-slate-900 mt-1">{selectedMandi?.name}</h3>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 inline-block mt-1.5">
                {selectedMandi?.state} Zone
              </span>
            </div>

            {/* Full Landed Expense Matrix */}
            <div className="space-y-2.5 text-xs font-medium text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Live Diesel Fuel Cost:</span>
                <span className="font-bold text-slate-900">{selectedMandi?.breakdown?.diesel_fuel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">NHAI Highway Tolls:</span>
                <span className="font-bold text-slate-900">{selectedMandi?.breakdown?.highway_toll}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mandi Labor (Tulaii):</span>
                <span className="font-bold text-slate-900">{selectedMandi?.breakdown?.mandi_labor}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                <span>Total Freight / Qtl:</span>
                <span className="text-amber-700">
                  {poolMembers > 1 ? selectedMandi?.breakdown?.pooled_total : selectedMandi?.breakdown?.solo_total}
                </span>
              </div>
              {poolMembers > 1 && (
                <div className="text-[11px] text-emerald-700 font-bold bg-emerald-100/60 p-2 rounded-lg">
                  ✨ Saved {selectedMandi?.breakdown?.solo_total} ➔ {selectedMandi?.breakdown?.pooled_total} via {poolMembers}-Farmer Coalition Pool!
                </div>
              )}
            </div>

            <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold space-y-0.5 shadow-xs">
              <span className="text-[11px] text-emerald-100 font-medium block">Pukka Net Realization</span>
              <p>
                Net gain: {poolMembers > 1 ? selectedMandi?.net_gain_pooled : selectedMandi?.net_gain} after all transit, toll & labor deductions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Complete APMC Matrix Table */}
      <div className="kisan-card overflow-hidden bg-white">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Landed Arbitrage Matrix ({crop})</h2>
            <span className="text-xs text-slate-400">Comparing Solo vs Shared Coalition Transit</span>
          </div>
          <button onClick={fetchRates} className="text-xs font-bold text-emerald-600 hover:underline">🔄 Refresh Matrix</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Mandi Yard</th>
                <th className="px-6 py-3.5">Spot Price</th>
                <th className="px-6 py-3.5">Road Distance</th>
                <th className="px-6 py-3.5">Diesel + Toll</th>
                <th className="px-6 py-3.5">Solo Landed Profit</th>
                <th className="px-6 py-3.5">Pooled Profit ({poolMembers}x)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mandis.map((row: any) => (
                <tr key={row.id} onClick={() => setSelectedMandi(row)} className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-6 py-4 font-bold text-slate-900">{row.name}</td>
                  <td className="px-6 py-4 font-black text-emerald-600">{row.modal}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{row.distance}</td>
                  <td className="px-6 py-4 text-xs font-mono text-amber-700">{row.breakdown?.solo_total}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{row.net_gain}</td>
                  <td className="px-6 py-4 font-black text-emerald-700 bg-emerald-50/50">{row.net_gain_pooled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}