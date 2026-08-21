"use client";

import React, { useState, useEffect } from "react";

export default function RealAgmarknetMandiPage() {
  const [crop, setCrop] = useState("Wheat");
  const [quantityQtl, setQuantityQtl] = useState(100);
  const [vehicle, setVehicle] = useState("tractor");
  const [isShared, setIsShared] = useState(false);
  const [mandis, setMandis] = useState<any[]>([]);
  const [selectedMandi, setSelectedMandi] = useState<any>(null);
  const [dieselRate, setDieselRate] = useState("₹87.80");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchGovtAgmarknet = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/mandi/live-rates?crop=${crop}`, { cache: "no-store" });
      const json = await res.json();
      
      if (json?.status === "success" && json.mandis && json.mandis.length > 0) {
        setMandis(json.mandis);
        setSelectedMandi(json.mandis[0]);
        if (json.live_diesel_rate) setDieselRate(json.live_diesel_rate);
      } else {
        setErrorMsg("Government Agmarknet server par is fasal ka live arrival data load ho raha hai.");
      }
    } catch (err) {
      setErrorMsg("Backend server se connect nahi ho paya. Make sure backend uvicorn is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGovtAgmarknet();
  }, [crop]);

  const getTransportPerQtl = (baseDiesel: number, tollLabor: number) => {
    let multiplier = vehicle === "pickup" ? 1.4 : vehicle === "truck" ? 0.7 : 1.0;
    let dieselPart = (baseDiesel || 20) * multiplier;
    if (isShared) dieselPart = dieselPart / 2;
    return Math.round(dieselPart + (tollLabor || 8));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
      {/* Top Govt Stream Banner */}
      <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>
          <span className="font-bold text-xs sm:text-sm">🌐 Official Agmarknet Gov.in Stream</span>
          <span className="bg-slate-800 px-3 py-0.5 rounded-full text-xs font-semibold text-emerald-400 border border-slate-700">
            ⛽ Spot Diesel: {dieselRate}/L
          </span>
        </div>
        <button
          onClick={fetchGovtAgmarknet}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1"
        >
          🔄 Sync Gov API
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            🌾 Live APMC Mandi Spot Radar
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Official Agmarknet portal rates + Live OSRM Highway Transit Deductions.
          </p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          {["Wheat", "Paddy(Dhan)(Common)", "Mustard", "Cotton"].map((item) => (
            <button
              key={item}
              onClick={() => setCrop(item)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
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
            1. Fasal Quantity (Quintal):
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
            2. Gaadi Chunein:
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

      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
          <div className="text-4xl animate-spin mb-3">⏳</div>
          <h2 className="text-lg font-black text-slate-800">Fetching Real Agmarknet Government Records...</h2>
          <p className="text-xs text-slate-500 mt-1">Connecting to data.gov.in endpoint with API Key</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-6 rounded-2xl text-center text-sm font-bold">
          {errorMsg}
        </div>
      ) : (
        <>
          {/* Mandi Cards List */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Live Mandiyan ({mandis.length} Yards Connected):
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mandis.map((m) => {
                const transport = getTransportPerQtl(m.diesel_cost, m.toll_labor);
                const inHand = m.modal - transport;
                const isSel = selectedMandi?.id === m.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMandi(m)}
                    className={`p-5 rounded-2xl cursor-pointer border-2 transition relative flex flex-col justify-between ${
                      isSel
                        ? "bg-emerald-50/70 border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-slate-900 text-base">{m.name}</h4>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {m.state}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">🛣️ {m.distance_km} km ({m.drive_time})</div>
                      
                      <div className="mt-3 pt-2 border-t border-slate-100 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Agmarknet Price:</span>
                          <span className="font-bold text-slate-900">₹{m.modal}/Qtl</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Transit Cut:</span>
                          <span className="font-bold text-amber-700">-₹{transport}/Qtl</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 bg-white p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Net Pukka Bhav</span>
                      <span className="text-xl font-black text-emerald-700">₹{inHand}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Updated: {m.arrival_date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Breakdown Box */}
          {selectedMandi && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-black text-slate-900 mb-4">
                🧾 {selectedMandi.name} Settlement Summary ({quantityQtl} Quintals)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold block">Agmarknet Gross Sale</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">
                    ₹{(selectedMandi.modal * quantityQtl).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <span className="text-xs text-amber-800 font-semibold block">Total Live Freight</span>
                  <span className="text-2xl font-black text-amber-800 mt-1 block">
                    -₹{(getTransportPerQtl(selectedMandi.diesel_cost, selectedMandi.toll_labor) * quantityQtl).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-4 bg-emerald-700 text-white rounded-2xl shadow-md">
                  <span className="text-xs text-emerald-200 font-bold block">NET FARMER POCKET</span>
                  <span className="text-2xl font-black text-white mt-1 block">
                    ₹{((selectedMandi.modal - getTransportPerQtl(selectedMandi.diesel_cost, selectedMandi.toll_labor)) * quantityQtl).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}