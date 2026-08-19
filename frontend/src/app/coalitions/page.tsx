"use client";

import React, { useState, useEffect } from "react";

export default function CoalitionsPage() {
  const [volume, setVolume] = useState(250);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertStatus, setAlertStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newDeal, setNewDeal] = useState({ name: "", req: "", offer: 2500, minVol: 100 });

  const singleRate = 2310;
  const corporateRate = 2620;
  const totalExtra = (corporateRate - singleRate) * volume;

  const fetchDeals = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agrisetuai.onrender.com";
      const res = await fetch(`${apiUrl}/api/coalitions/deals`);
      const json = await res.json();
      if (json.status === "success") setDeals(json.deals);
    } catch {
      setDeals([
        { id: 1, name: "ITC Agri-Business Hub", req: "Wheat HD-2967 (Grade A)", offer: 2620, minVol: 200, badge: "Verified Buyer", status: "Active Procurement" },
        { id: 2, name: "Adani Wilmar Logistics", req: "Basmati Paddy 1121", offer: 3850, minVol: 350, badge: "Direct Export", status: "Urgent Batch" },
        { id: 3, name: "Cargill India Foods", req: "Hybrid Yellow Maize", offer: 2190, minVol: 150, badge: "Bulk Processor", status: "Closing Soon" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const triggerAlert = async (type: "whatsapp" | "ivr") => {
    setAlertStatus(type === "whatsapp" ? "Dispatching WhatsApp notification..." : "Initiating automated voice call...");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agrisetuai.onrender.com";
      const res = await fetch(`${apiUrl}/api/coalitions/notify-${type}`, { method: "POST" });
      const json = await res.json();
      setAlertStatus(json.service + ": " + (json.audio_status || "Delivered successfully!"));
    } catch {
      setAlertStatus(`Live ${type.toUpperCase()} alert simulated successfully.`);
    }
    setTimeout(() => setAlertStatus(""), 4000);
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.name || !newDeal.req) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agrisetuai.onrender.com";
      await fetch(`${apiUrl}/api/coalitions/deals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDeal),
      });
      setShowModal(false);
      fetchDeals();
    } catch {
      setDeals((prev) => [{ ...newDeal, id: Date.now(), badge: "Community Demand", status: "Under Pooling" }, ...prev]);
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mb-2">
            🤝 DYNAMIC AGGREGATION & BULK DEALS
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Farmer Coalitions & Collective Bargaining</h1>
          <p className="text-sm text-slate-500 mt-1">Pool crop volume with neighboring farmers to bypass arhatiyas and lock corporate bulk premiums.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => triggerAlert("ivr")} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 shadow-xs">
            📞 Voice IVR Broadcast
          </button>
          <button onClick={() => triggerAlert("whatsapp")} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-500/20">
            💬 WhatsApp Pool Alert
          </button>
        </div>
      </div>

      {alertStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl animate-fade-in flex items-center gap-2">
          <span>🔔</span> {alertStatus}
        </div>
      )}

      {/* Bargaining Calculator */}
      <div className="kisan-card p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Collective Bargaining Profit Model</h2>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Corporate Direct Tier
          </span>
        </div>

        <div>
          <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
            <span>Aggregated Pool Quantity:</span>
            <span className="text-emerald-600 text-lg font-extrabold">{volume} Quintals</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold block">Individual Mandi Rate</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">₹{singleRate}<span className="text-xs text-slate-400 font-normal">/qtl</span></span>
          </div>

          <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
            <span className="text-xs text-emerald-700 font-semibold block">Pooled Corporate Rate</span>
            <span className="text-2xl font-bold text-emerald-700 mt-1 block">₹{corporateRate}<span className="text-xs text-emerald-600 font-normal">/qtl</span></span>
          </div>

          <div className="p-5 bg-gradient-to-tr from-emerald-600 to-teal-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
            <span className="text-xs text-emerald-100 font-medium block">Total Collective Extra Gain</span>
            <span className="text-2xl font-extrabold mt-1 block">₹{totalExtra.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Corporate Deals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Active Procurement Batches ({deals.length})</h2>
          <button onClick={() => setShowModal(true)} className="text-xs font-bold text-white bg-emerald-600 px-3.5 py-2 rounded-xl hover:bg-emerald-700 shadow-xs">
            + Post New Crop Demand
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Syncing active buyer network...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {deals.map((b) => (
              <div key={b.id} className="kisan-card p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {b.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{b.status}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{b.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{b.req}</p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Locked Offer</span>
                    <span className="font-extrabold text-emerald-600 text-base">₹{b.offer}/Qtl</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Min Batch</span>
                    <span className="font-bold text-slate-700 text-sm">{b.minVol} Qtl</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Demand Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Post New Farmer/Corporate Demand</h3>
            <form onSubmit={handleCreateDeal} className="space-y-3 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-500">Buyer / FPO Entity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Punjab Agri Processors Ltd"
                  value={newDeal.name}
                  onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-500">Crop Variety & Specifications</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wheat PBW-725 Clean Sample"
                  value={newDeal.req}
                  onChange={(e) => setNewDeal({ ...newDeal, req: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-500">Offered Rate (₹/Qtl)</label>
                  <input
                    type="number"
                    value={newDeal.offer}
                    onChange={(e) => setNewDeal({ ...newDeal, offer: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500">Min Volume (Qtl)</label>
                  <input
                    type="number"
                    value={newDeal.minVol}
                    onChange={(e) => setNewDeal({ ...newDeal, minVol: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-slate-100 rounded-xl font-bold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700">
                  Publish Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}