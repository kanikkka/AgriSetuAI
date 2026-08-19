"use client";

import React, { useState } from "react";

export default function DashboardPage() {
  const [crop, setCrop] = useState("Wheat");

  const mandis = [
    { name: "Khanna APMC Yard", state: "Punjab", modal: "₹2,440", range: "₹2,390 - ₹2,480", arrival: "450 MT", tag: "+₹140 Arbitrage Gain", tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { name: "Rajpura APMC", state: "Punjab", modal: "₹2,380", range: "₹2,340 - ₹2,410", arrival: "310 MT", tag: "High Inflow Peak", tagColor: "bg-slate-100 text-slate-700 border-slate-200" },
    { name: "Karnal APMC Yard", state: "Haryana", modal: "₹2,475", range: "₹2,420 - ₹2,510", arrival: "620 MT", tag: "Highest Regional Modal", tagColor: "bg-amber-50 text-amber-800 border-amber-200" },
    { name: "Sirsa Mandi", state: "Haryana", modal: "₹2,410", range: "₹2,370 - ₹2,430", arrival: "280 MT", tag: "Steady Supply", tagColor: "bg-blue-50 text-blue-700 border-blue-200" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-7">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Real-Time Mandi Intelligence & Arbitrage</h1>
          <p className="text-sm text-slate-500 mt-1">Spatial price arbitrage, AI grain quality assessment & collective bargaining data.</p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          {["Wheat", "Paddy", "Cotton", "Maize"].map((item) => (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="kisan-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monitored Yards</span>
              <span className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-sm">🏬</span>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-3">22 APMCs</div>
          </div>
          <div className="text-xs font-bold text-emerald-600 mt-3 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Live Data Feed Active
          </div>
        </div>

        <div className="kisan-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spatial Arbitrage</span>
              <span className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">⚡</span>
            </div>
            <div className="text-3xl font-black text-emerald-600 mt-3">+₹140<span className="text-sm font-normal text-slate-400">/qtl</span></div>
          </div>
          <div className="text-xs font-medium text-slate-500 mt-3">Khanna ➔ Karnal net route profit</div>
        </div>

        <div className="kisan-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">FCI Quality Grade</span>
              <span className="h-8 w-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-sm">⭐</span>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-3">Grade A <span className="text-sm font-bold text-emerald-600">(98%)</span></div>
          </div>
          <div className="text-xs font-medium text-amber-700 mt-3">Moisture safe: 11.8% (0% penalty)</div>
        </div>

        <div className="kisan-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coalition Gain</span>
              <span className="h-8 w-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-sm">🤝</span>
            </div>
            <div className="text-3xl font-black text-purple-700 mt-3">+₹80,500</div>
          </div>
          <div className="text-xs font-medium text-slate-500 mt-3">250 Qtl collective pooling deal</div>
        </div>
      </div>

      <div className="kisan-card overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Live Spot Market Rates ({crop})</h2>
            <p className="text-xs text-slate-500 mt-0.5">Government verified APMC transactions updated 3m ago</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Realtime Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Mandi Yard</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Modal Price</th>
                <th className="px-6 py-4">Day Range</th>
                <th className="px-6 py-4">Arrivals</th>
                <th className="px-6 py-4">Opportunity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mandis.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{row.name}</td>
                  <td className="px-6 py-4 font-medium text-slate-500">{row.state}</td>
                  <td className="px-6 py-4 font-black text-emerald-600 text-base">{row.modal}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600 font-semibold">{row.range}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{row.arrival}</td>
                  <td className="px-6 py-4">
                    <span className={"inline-block px-3 py-1 rounded-full text-xs font-bold border " + row.tagColor}>
                      {row.tag}
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