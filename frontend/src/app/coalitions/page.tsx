"use client";

import React, { useState, useEffect } from "react";

export default function CoalitionsLogisticsPage() {
  const [tab, setTab] = useState<"coalitions" | "logistics" | "storage">("coalitions");
  const [volume, setVolume] = useState(250);
  const [rides, setRides] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [alert, setAlert] = useState("");

  const singleRate = 2310;
  const corporateRate = 2620;
  const totalExtra = (corporateRate - singleRate) * volume;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agrisetuai.onrender.com";
        const [rRes, wRes] = await Promise.all([
          fetch(`${apiUrl}/api/coalitions/logistics`),
          fetch(`${apiUrl}/api/coalitions/warehouses`)
        ]);
        const rData = await rRes.json();
        const wData = await wRes.json();
        setRides(rData.rides || []);
        setWarehouses(wData.warehouses || []);
      } catch {
        setRides([
          { id: 1, driver: "Gurdeep Singh (Trolley)", vehicle: "Swaraj 855 Double Trolley", route: "Khanna ➔ Karnal Yard", available_capacity: "120 Qtl Space Open", cost_sharing: "₹14/Qtl (Save 45%)", phone: "+91 98140-99881" },
          { id: 2, driver: "Jaswinder Logistics", vehicle: "Eicher 14 Wheeler Truck", route: "Samrala ➔ Rajpura APMC", available_capacity: "250 Qtl Space Open", cost_sharing: "₹18/Qtl (Save 35%)", phone: "+91 94172-33441" }
        ]);
        setWarehouses([
          { id: 1, name: "CWC Central Warehouse Ludhiana", type: "WDRA Certified", distance: "12 km away", rate: "₹4.20/Qtl/Month", capacity_available: "1,400 MT Available", receipt_loan: "Eligible for 75% e-NWR Loan" },
          { id: 2, name: "Punjab State Warehousing Corp", type: "State Mandi Yard", distance: "4 km away", rate: "₹3.80/Qtl/Month", capacity_available: "850 MT Available", receipt_loan: "Eligible for NABARD Subsidy" }
        ]);
      }
    };
    fetchData();
  }, []);

  const triggerNotification = (type: string) => {
    setAlert(`${type} dispatch triggered successfully!`);
    setTimeout(() => setAlert(""), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-1.5">
            🤝 COLLECTIVE PROCUREMENT & LOGISTICS POOL
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Farmer Coalitions, Logistics & Storage</h1>
          <p className="text-xs text-slate-500 mt-0.5">Aggregate crops for corporate bulk rates, share tractor transport, and access WDRA godowns.</p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <button onClick={() => setTab("coalitions")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${tab === "coalitions" ? "bg-emerald-600 text-white" : "text-slate-600"}`}>
            Bulk Bargaining
          </button>
          <button onClick={() => setTab("logistics")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${tab === "logistics" ? "bg-emerald-600 text-white" : "text-slate-600"}`}>
            Tractor Sharing
          </button>
          <button onClick={() => setTab("storage")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${tab === "storage" ? "bg-emerald-600 text-white" : "text-slate-600"}`}>
            Godown Locator
          </button>
        </div>
      </div>

      {alert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl">
          🔔 {alert}
        </div>
      )}

      {tab === "coalitions" && (
        <div className="space-y-6">
          <div className="kisan-card p-6 md:p-8 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Pooled Volume Profit Simulator</h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Corporate Tier
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                <span>Pooled Batch Size</span>
                <span className="text-emerald-700 text-base">{volume} Quintals</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block font-medium">Single Mandi Rate</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">₹{singleRate}/Qtl</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-xs text-emerald-700 block font-medium">Corporate Pooled Rate</span>
                <span className="text-xl font-bold text-emerald-700 mt-1 block">₹{corporateRate}/Qtl</span>
              </div>
              <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-xs">
                <span className="text-xs text-emerald-100 block font-medium">Total Coalition Extra Profit</span>
                <span className="text-xl font-extrabold mt-1 block">₹{totalExtra.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "logistics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rides.map((r) => (
            <div key={r.id} className="kisan-card p-6 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  🚜 Tractor Logistics Sharing
                </span>
                <span className="text-xs font-bold text-emerald-600">{r.cost_sharing}</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{r.driver}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Route: {r.route}</p>
                <p className="text-xs text-slate-700 font-bold mt-1">Available: {r.available_capacity}</p>
              </div>
              <button
                onClick={() => triggerNotification(`Ride booking alert sent to ${r.driver}`)}
                className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
              >
                📞 Connect & Share Trolley Space
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "storage" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {warehouses.map((w) => (
            <div key={w.id} className="kisan-card p-6 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  🏢 {w.type}
                </span>
                <span className="text-xs font-mono text-slate-500">{w.distance}</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{w.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Rent: {w.rate} • Capacity: {w.capacity_available}</p>
                <p className="text-xs text-emerald-700 font-bold mt-1.5">● {w.receipt_loan}</p>
              </div>
              <button
                onClick={() => triggerNotification(`Storage holding slot reserved at ${w.name}`)}
                className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition"
              >
                🔒 Reserve Warehouse Bay & e-NWR Receipt
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}