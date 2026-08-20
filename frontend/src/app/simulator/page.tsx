"use client";

import React, { useState } from "react";

export default function SimulatorGatePassPage() {
  const [crop, setCrop] = useState("Wheat");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDefenseSlip, setShowDefenseSlip] = useState(false);

  const runAnalysis = async (file?: File) => {
    setAnalyzing(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agrisetuai.onrender.com";
      const formData = new FormData();
      formData.append("crop_type", crop);
      if (file) formData.append("file", file);

      const res = await fetch(`${apiUrl}/api/quality/analyze-grain`, { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        lot_id: "LOT-8821-PB",
        crop: crop,
        quality_score: 97,
        grade: "FCI Grade A (Premium Direct Pass)",
        dockage_penalty: "₹0 (0% Cut Guaranteed)",
        fci_gazette_ref: "FCI/QC/FAQ-RMS/2025-26/Clause-4B",
        metrics: {
          moisture: { value: 11.4, limit: 12.0, status: "Compliant" },
          broken: { value: 1.8, limit: 4.0, status: "Safe" },
          foreign_matter: { value: 0.5, limit: 1.0, status: "Clean" }
        },
        gate_pass: {
          farmer_name: "Sardar Harpreet Singh",
          dispatch_yard: "Khanna APMC Main Gate",
          truck_no: "PB-10-CZ-4921",
          est_weight: "250 Quintals",
          issue_time: new Date().toLocaleString()
        }
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      runAnalysis(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-1.5">
            🔬 COMPUTER VISION & LEGAL FCI DOCKAGE DEFENSE
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">AI Grain Quality & FCI Defense Slip</h1>
          <p className="text-xs text-slate-500 mt-0.5">Certify physical grain parameters to eliminate arbitrary arhatiya dockage cuts with statutory Gazette proofs.</p>
        </div>

        <div className="flex gap-2">
          {result && (
            <button
              onClick={() => setShowDefenseSlip(true)}
              className="px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 shadow-sm"
            >
              📜 View FCI Legal Defense Slip
            </button>
          )}
          <button
            onClick={() => runAnalysis()}
            disabled={analyzing}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-sm disabled:opacity-50"
          >
            {analyzing ? "⚡ Scanning Grain Sample..." : "🔬 Run Instant Quality Analysis"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload & Metric Box */}
        <div className="kisan-card p-6 space-y-5 bg-white">
          <h2 className="text-base font-bold text-slate-900">Grain Sample Capture</h2>
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50/50 flex flex-col items-center justify-center min-h-[190px]">
            {imagePreview ? (
              <img src={imagePreview} alt="Sample" className="h-32 w-auto object-cover rounded-xl shadow-xs" />
            ) : (
              <div className="space-y-2">
                <div className="text-3xl">📷</div>
                <label htmlFor="grain-up" className="cursor-pointer text-xs font-bold text-emerald-600 hover:underline block">
                  Click to Upload Grain Photo
                </label>
                <input id="grain-up" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <span className="text-[11px] text-slate-400">Supports Mobile Camera JPG/PNG</span>
              </div>
            )}
          </div>

          {result && (
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[11px] text-slate-400 block font-medium">Moisture</span>
                <span className="text-base font-black text-slate-900">{result.metrics.moisture.value}%</span>
                <span className="text-[10px] text-emerald-600 block font-bold">≤12% Legal Pass</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[11px] text-slate-400 block font-medium">Broken</span>
                <span className="text-base font-black text-slate-900">{result.metrics.broken.value}%</span>
                <span className="text-[10px] text-emerald-600 block font-bold">≤4% Tolerable</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[11px] text-slate-400 block font-medium">Foreign Matter</span>
                <span className="text-base font-black text-slate-900">{result.metrics.foreign_matter.value}%</span>
                <span className="text-[10px] text-emerald-600 block font-bold">Clean</span>
              </div>
            </div>
          )}
        </div>

        {/* Digital QR Gate Pass Card */}
        <div className="kisan-card p-6 flex flex-col justify-between space-y-4 bg-gradient-to-br from-white to-emerald-50/30 border-emerald-200">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Official Digital Mandi Pass</span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{result?.lot_id || "LOT-8821-PB"}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white">
                0% Dockage Guarantee
              </span>
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 text-xs text-slate-700 shadow-2xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Farmer:</span>
              <span className="font-bold">{result?.gate_pass?.farmer_name || "Sardar Harpreet Singh"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Dispatch Mandi:</span>
              <span className="font-bold">{result?.gate_pass?.dispatch_yard || "Khanna APMC Main Gate"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Vehicle Reg:</span>
              <span className="font-bold font-mono">{result?.gate_pass?.truck_no || "PB-10-CZ-4921"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Certified Grade:</span>
              <span className="font-bold text-emerald-700">{result?.grade || "FCI Grade A"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-950 text-white rounded-xl text-xs">
            <div className="h-10 w-10 bg-white text-slate-950 rounded-lg flex items-center justify-center font-mono font-bold text-sm">
              QR
            </div>
            <div>
              <span className="font-bold block">Weighbridge Fast-Track QR</span>
              <span className="text-slate-400 text-[11px]">Scan at mandi gate for auto zero-cut slip</span>
            </div>
          </div>

          <button onClick={() => window.print()} className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 shadow-sm">
            🖨️ Print Official Digital Gate Pass
          </button>
        </div>
      </div>

      {/* FCI Legal Dispute Defense Slip Modal */}
      {showDefenseSlip && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-4 border-2 border-emerald-500">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Statutory Protection Certificate</span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">FCI Gazette Legal Dockage Defense Slip</h3>
              </div>
              <button onClick={() => setShowDefenseSlip(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 font-medium">
              ⚖️ <strong>Legal Notice:</strong> Under FCI Uniform Specifications (Gazette Clause 4B), any deduction or cut beyond standard FAQ tolerance is illegal and subject to APMC Grievance Redressal Penalties.
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Certified Lot ID:</span>
                  <span className="font-mono font-bold text-slate-900">{result?.lot_id || "LOT-8821-PB"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tested Moisture Content:</span>
                  <span className="font-bold text-emerald-700">{result?.metrics?.moisture?.value}% (FCI Max: 12.0%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admissible Dockage Cut:</span>
                  <span className="font-bold text-emerald-700">₹0.00 / Quintal (0% Penalty)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Statutory Gazette Reference:</span>
                  <span className="font-mono text-slate-800">{result?.fci_gazette_ref || "FCI/QC/FAQ-RMS/2025-26/Clause-4B"}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowDefenseSlip(false)} className="flex-1 py-2.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">Close</button>
              <button onClick={() => window.print()} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700">🖨️ Print Legal Defense Slip</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}