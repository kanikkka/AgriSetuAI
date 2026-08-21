"use client";

import React, { useState, useEffect } from "react";

export default function LiveSystemsFeed() {
  const [nasaData, setNasaData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(`${apiUrl}/api/farmer-hub/nasa-firms-live`)
      .then((r) => r.json())
      .then(setNasaData)
      .catch(() => {});
  }, []);

  const testRazorpayEscrow = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/farmer-hub/initiate-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: "BK-LIVE-2026", amount: 119040.0 })
      });
      const data = await res.json();
      setPaymentData(data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-4 font-sans shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
            ● Production Integrations Dashboard
          </span>
          <h2 className="text-lg font-black mt-0.5">5 Core Enterprise Webhook Handlers</h2>
        </div>
        <button
          onClick={testRazorpayEscrow}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition"
        >
          {loading ? "Generating..." : "⚡ Test Bank Escrow Token"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* 1. NASA FIRMS Stream */}
        <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="font-bold text-amber-400">🛰️ NASA VIIRS Satellite Fire Feed</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
              {nasaData?.status || "Connecting..."}
            </span>
          </div>
          <p className="text-slate-300 text-[11px]">
            Satellite: <strong>{nasaData?.satellite || "VIIRS SNPP NRT"}</strong>
          </p>
          <p className="text-slate-300 text-[11px]">
            Impact: <strong className="text-emerald-300">{nasaData?.supply_shock_prediction || "Active Monitoring"}</strong>
          </p>
        </div>

        {/* 2. Escrow & Banking Webhook */}
        <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="font-bold text-emerald-400">💳 Razorpay / e-NAM Settlement</span>
            <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded">HMAC SHA-256</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            Status: <strong>{paymentData?.payment_status || "Ready for Dispatch"}</strong>
          </p>
          {paymentData?.order_id && (
            <p className="text-[10px] font-mono text-emerald-300">
              Order: {paymentData.order_id} (₹{paymentData.amount_paise / 100})
            </p>
          )}
        </div>
      </div>
    </div>
  );
}