"use client";

import React, { useState, useEffect } from "react";

export default function RealCsvMandiPage() {
  const [crop, setCrop] = useState("Tomato");
  const [quantityQtl, setQuantityQtl] = useState(50);
  const [vehicle, setVehicle] = useState("tractor");
  const [isShared, setIsShared] = useState(false);
  const [mandis, setMandis] = useState<any[]>([]);
  const [selectedMandi, setSelectedMandi] = useState<any>(null);
  const [csvSource, setCsvSource] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchFromCsv = async (cName: string) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/mandi/live-rates?crop=${cName}`, { cache: "no-store" });
      const json = await res.json();
      if (json?.mandis && json.mandis.length > 0) {
        setMandis(json.mandis);
        setSelectedMandi(json.mandis[0]);
        setCsvSource(json.csv_loaded_from || "35985678-0d79-46b4-9ed6-6f13308a1d24.csv");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFromCsv(crop);
  }, [crop]);

  const getTransportPerQtl = (baseDiesel: number, tollLabor: number) => {
    let multiplier = vehicle === "pickup" ? 1.4 : vehicle === "truck" ? 0.7 : 1.0;
    let dieselPart = (baseDiesel || 15) * multiplier;
    if (isShared) dieselPart = dieselPart / 2;
    return Math.round(dieselPart + (tollLabor || 8));
  };

  const active = selectedMandi || mandis[0];
  const transit = active ? getTransportPerQtl(active.diesel_cost, active.toll_labor) : 25;
  const inHandRate = active ? active.modal - transit : 0;
  const totalPocket = inHandRate * quantityQtl;
  const sharedSavings = active ? (active.diesel_cost / 2) * quantityQtl : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
      {/* CSV Source Status Bar */}
      <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
          <span className="font-bold text-xs sm:text-sm">
            📄 Active Dataset: <strong>43,143 Records CSV</strong>
          </span>
        </div>
        <div className="text-xs text-emerald-300 font-mono">
          {active?.source || "Parsing CSV Live Rows"}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            🌾 CSV Real Mandi Price Explorer
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Exact records from Agmarknet Government Dataset CSV.
          </p>
        </div>

        {/* Crops present in your CSV */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex-wrap gap-1">
          {["Tomato", "Ginger", "Green Chilli", "Cauliflower", "Wheat"].map((item) => (
            <button
              key={item}
              onClick={() => setCrop(item)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                crop === item ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Step Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            1. Total Quantity (Quintal):
          </label>
          <input
            type="number"
            value={quantityQtl}
            onChange={(e) => setQuantityQtl(Number(e.target.value) || 1)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-black text-slate-900 text-lg focus:outline-emerald-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            2. Transport Gaadi:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "pickup", icon: "🛻", label: "Pickup" },
              { id: "tractor", icon: "🚜", label: "Tractor" },
              { id: "truck", icon: "🚛", label: "Truck" }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setVehicle(v.id)}
                className={`py-2 px-1 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition ${
                  vehicle === v.id
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-base">{v.icon}</span>
                <span>{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            3. Trolley Sharing:
          </label>
          <button
            onClick={() => setIsShared(!isShared)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition flex items-center justify-between ${
              isShared
                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span>{isShared ? "✅ 2 Kisaan Sharing (50% Off)" : "👤 Solo Farmer"}</span>
            <span className="text-[11px] underline">Change</span>
          </button>
        </div>
      </div>

      {/* Highlight Banner */}
      {active && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              ⭐ Real CSV Record ({crop})
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-2">
              {active.name} — ₹{active.modal} / Quintal
            </h2>
            <p className="text-emerald-100 text-sm">
              Arrival Date: <strong>{active.arrival_date}</strong> | Min: ₹{active.min_price} | Max: ₹{active.max_price}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[200px]">
            <span className="text-xs text-emerald-200 font-semibold block">Total Net Pocket ({quantityQtl} Qtl)</span>
            <span className="text-3xl font-black text-white block mt-1">
              ₹{totalPocket.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-emerald-300 font-bold block mt-1">
              ✓ Transit Costs Deducted
            </span>
          </div>
        </div>
      )}

      {/* CSV Records Grid */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3">
          CSV Entries for {crop} (Click to Audit):
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mandis.map((m) => {
            const tr = getTransportPerQtl(m.diesel_cost, m.toll_labor);
            const inHand = m.modal - tr;
            const isSel = (active?.id === m.id);

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMandi(m)}
                className={`p-4 rounded-2xl cursor-pointer border-2 transition relative flex flex-col justify-between ${
                  isSel
                    ? "bg-emerald-50/70 border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-slate-900 text-sm">{m.name}</h4>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {m.state}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">📅 Date: {m.arrival_date}</div>
                  
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">CSV Modal:</span>
                      <span className="font-bold text-slate-900">₹{m.modal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transit:</span>
                      <span className="font-bold text-amber-700">-₹{tr}/Qtl</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 bg-white p-2.5 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">In-Hand Rate</span>
                  <span className="text-lg font-black text-emerald-700">₹{inHand}</span>
                  <span className="text-[10px] text-slate-400 block">/ Quintal</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}