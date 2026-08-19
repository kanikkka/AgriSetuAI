"use client";

import React from "react";

export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-7">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Kisan Profile & Farm Registry</h1>
        <p className="text-sm text-slate-500 mt-1">Verified land holdings, APMC licenses, and mandi dispatch settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="kisan-card p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Farmer Identity</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-slate-400 text-xs block">Registered Name</span>
              <span className="text-slate-800 font-semibold">Sardar Harpreet Singh</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">Registered Mobile</span>
              <span className="text-slate-800 font-semibold">+91 98765 43210</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">District & State</span>
              <span className="text-slate-800 font-semibold">Ludhiana, Punjab</span>
            </div>
          </div>
        </div>

        <div className="kisan-card p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Land & Mandi Linkage</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-slate-400 text-xs block">Operational Land</span>
              <span className="text-slate-800 font-semibold">18.5 Acres</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">Primary Crops</span>
              <span className="text-slate-800 font-semibold">Wheat (Sharbati), Basmati Paddy 1121</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">Primary APMC Yard</span>
              <span className="text-slate-800 font-semibold">Khanna Mandi Yard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}