"use client";

import React, { useState } from "react";

export default function CoalitionsPage() {
  const [volume, setVolume] = useState(250);
  const singleRate = 2310;
  const corporateRate = 2620;
  const totalExtra = (corporateRate - singleRate) * volume;

  const buyers = [
    { name: "ITC Agri Business", req: "Wheat HD-2967", offer: "₹2,620/Qtl", minVol: "200 Qtl", badge: "Verified Buyer", status: "Active Procurement" },
    { name: "Adani Wilmar Logistics", req: "Basmati Paddy 1121", offer: "₹3,850/Qtl", minVol: "350 Qtl", badge: "Direct Export", status: "Urgent Batch" },
    { name: "Cargill India Foods", req: "Hybrid Maize", offer: "₹2,190/Qtl", minVol: "150 Qtl", badge: "Bulk Processor", status: "Closing Soon" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mb-2">
            🤝 Dynamic Aggregation & Bulk Deals
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Farmer Coalitions & Corporate Deals</h1>
          <p className="text-sm text-slate-500 mt-1">Pool crop quantity with neighboring farmers to unlock high corporate rates.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 shadow-xs">
            📞 Voice IVR Demo
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-500/20">
            💬 WhatsApp Alert
          </button>
        </div>
      </div>

      <div className="kisan-card p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Bulk Bargaining Profit Calculator</h2>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Corporate Bulk Tier
          </span>
        </div>

        <div>
          <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
            <span>Pooled Crop Volume:</span>
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
            <span className="text-xs text-emerald-100 font-medium block">Total Extra Coalition Profit</span>
            <span className="text-2xl font-extrabold mt-1 block">₹{totalExtra.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Active Corporate Procurement Deals</h2>
          <button className="text-xs font-bold text-emerald-600 hover:underline">+ Post New Demand</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {buyers.map((b, i) => (
            <div key={i} className="kisan-card p-6 space-y-4">
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
                  <span className="text-slate-400 block font-medium">Offer Price</span>
                  <span className="font-extrabold text-emerald-600 text-base">{b.offer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Min Batch</span>
                  <span className="font-bold text-slate-700 text-sm">{b.minVol}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}