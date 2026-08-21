"use client";
import React, { useState, useEffect } from "react";

export default function DynamicCollectivePage() {
  const [farmers, setFarmers] = useState<any[]>([
    { id: "F1", name: "Gurpreet Singh", village: "Khanna", qty_qtl: 32.0, moisture_pct: 12.5, distance_km: 0.0 },
    { id: "F2", name: "Harbhajan Gill", village: "Bhadla", qty_qtl: 28.0, moisture_pct: 12.8, distance_km: 3.8 }
  ]);
  const [bids, setBids] = useState<any[]>([
    { id: "B1", buyer_name: "ITC Agri-Business", bid_rate: 3720.0 },
    { id: "B2", buyer_name: "Adani Wilmar Export", bid_rate: 3700.0 }
  ]);

  const [newFarmerName, setNewFarmerName] = useState("");
  const [newVillage, setNewVillage] = useState("");
  const [newQty, setNewQty] = useState(30);
  const [newMoisture, setNewMoisture] = useState(12.5);
  const [newBuyerName, setNewBuyerName] = useState("");
  const [newBidRate, setNewBidRate] = useState(3750);
  const [calcResult, setCalcResult] = useState<any>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const triggerCalc = async (currF = farmers, currB = bids) => {
    try {
      const res = await fetch(`${apiUrl}/api/collective/calculate-dynamic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmers: currF, bids: currB })
      });
      const data = await res.json();
      if (data?.status === "success") setCalcResult(data);
    } catch (e) {}
  };

  useEffect(() => { triggerCalc(farmers, bids); }, [farmers, bids]);

  const addFarmer = () => {
    if (!newFarmerName.trim()) return;
    const updated = [...farmers, { id: `F-${Date.now()}`, name: newFarmerName, village: newVillage || "Khanna Cluster", qty_qtl: Number(newQty) || 10, moisture_pct: Number(newMoisture) || 12.5, distance_km: 4.0 }];
    setFarmers(updated); setNewFarmerName(""); setNewVillage("");
  };

  const addBid = () => {
    if (!newBuyerName.trim()) return;
    const updated = [...bids, { id: `B-${Date.now()}`, buyer_name: newBuyerName, bid_rate: Number(newBidRate) || 3650 }];
    setBids(updated); setNewBuyerName("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      <div className="bg-slate-900 text-white p-6 rounded-3xl flex justify-between items-center">
        <div>
          <span className="text-emerald-400 text-xs font-bold uppercase">● Live Interactive FPO Engine</span>
          <h1 className="text-2xl font-black mt-1">AgriSetu Collective</h1>
        </div>
        <div className="bg-slate-800 p-3 rounded-2xl text-center min-w-[160px]">
          <span className="text-xs text-slate-400 block font-bold">Total Virtual Lot</span>
          <span className="text-2xl font-black text-emerald-400">{calcResult?.total_quantity_qtl || 0} Qtl</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
          <h2 className="text-sm font-black text-slate-900">➕ Add Farmer Live</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <input placeholder="Name" value={newFarmerName} onChange={e=>setNewFarmerName(e.target.value)} className="bg-slate-50 border p-2 rounded-xl" />
            <input placeholder="Village" value={newVillage} onChange={e=>setNewVillage(e.target.value)} className="bg-slate-50 border p-2 rounded-xl" />
            <input type="number" placeholder="Qty (Qtl)" value={newQty} onChange={e=>setNewQty(Number(e.target.value))} className="bg-slate-50 border p-2 rounded-xl font-bold" />
            <input type="number" placeholder="Moisture %" value={newMoisture} onChange={e=>setNewMoisture(Number(e.target.value))} className="bg-slate-50 border p-2 rounded-xl font-bold" />
          </div>
          <button onClick={addFarmer} className="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs">+ Add Farmer</button>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
          <h2 className="text-sm font-black text-slate-900">🏷️ Add Buyer Bid Live</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <input placeholder="Buyer Name" value={newBuyerName} onChange={e=>setNewBuyerName(e.target.value)} className="bg-slate-50 border p-2 rounded-xl" />
            <input type="number" placeholder="Bid Price (₹)" value={newBidRate} onChange={e=>setNewBidRate(Number(e.target.value))} className="bg-slate-50 border p-2 rounded-xl font-bold" />
          </div>
          <button onClick={addBid} className="w-full bg-slate-900 text-white font-bold py-2 rounded-xl text-xs">+ Submit Bid</button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
        <h3 className="text-xs font-black text-slate-900">Active Farmers in Lot:</h3>
        <div className="grid grid-cols-3 gap-2">
          {farmers.map(f => (
            <div key={f.id} className="p-3 bg-slate-50 border rounded-xl text-xs flex justify-between">
              <div>
                <span className="font-bold block">{f.name}</span>
                <span className="text-slate-500">{f.qty_qtl} Qtl | {f.moisture_pct}%</span>
              </div>
              <button onClick={() => setFarmers(farmers.filter(x=>x.id!==f.id))} className="text-red-500 font-bold">✕</button>
            </div>
          ))}
        </div>
      </div>

      {calcResult?.settlements && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
          <h3 className="text-xs font-black text-slate-900">🧾 Live Settlement (At ₹{calcResult.highest_bid}/Qtl Bid)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 font-bold">
                <tr><th className="p-2">Farmer</th><th className="p-2">Qty</th><th className="p-2">Gross</th><th className="p-2 text-emerald-700">Net Settlement</th></tr>
              </thead>
              <tbody>
                {calcResult.settlements.map((s: any, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 font-bold">{s.farmer_name}</td>
                    <td className="p-2">{s.quantity_qtl} Qtl</td>
                    <td className="p-2">₹{s.gross_amount}</td>
                    <td className="p-2 font-black text-emerald-700">₹{s.estimated_net_settlement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}