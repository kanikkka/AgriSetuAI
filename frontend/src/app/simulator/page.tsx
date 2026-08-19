"use client";

import React, { useState } from "react";

export default function SimulatorPage() {
  const [moisture, setMoisture] = useState(11.8);
  const [broken, setBroken] = useState(2.0);

  return (
    <div className="max-w-4xl mx-auto space-y-7">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">AI Grain Quality & FCI Grading Simulator</h1>
        <p className="text-sm text-slate-500 mt-1">Evaluate physical crop grain samples against Food Corporation of India (FCI) norms.</p>
      </div>

      <div className="kisan-card p-6 md:p-8 space-y-6">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
              <span>Grain Moisture (Nami %) - Norm: 12.0%</span>
              <span className="text-emerald-600 font-extrabold text-base">{moisture}%</span>
            </div>
            <input
              type="range"
              min="9"
              max="18"
              step="0.1"
              value={moisture}
              onChange={(e) => setMoisture(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
              <span>Broken Grains (Toota Daana) - Max Limit: 4.0%</span>
              <span className="text-emerald-600 font-extrabold text-base">{broken}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              step="0.1"
              value={broken}
              onChange={(e) => setBroken(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">AI Quality Classification</span>
            <div className="text-lg font-bold text-emerald-900 mt-0.5">FCI Grade A (Standard Procurement Ready)</div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-sm">
            0% Cut Penalty
          </span>
        </div>
      </div>
    </div>
  );
}