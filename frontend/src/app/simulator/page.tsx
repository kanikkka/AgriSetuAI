"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw,
  Droplets,
  Scale,
  Sun,
  ShieldAlert,
  Download,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import jsPDF from "jspdf";
import { useLanguage } from "@/context/LanguageContext";
import { getMandiPrices, MandiPriceRecord } from "@/services/mandiPrices";
import {
  calculateMoisturePenalty,
  calculateArhtiDebtDecision,
  calculateFairFreightSharing,
  MoisturePenaltyResult,
  ArhtiDebtAnalysis,
  FairFreightShare,
} from "@/services/mandiIntelligenceService";

export default function SimulatorPage() {
  const { lang, t } = useLanguage();

  const [mandis, setMandis] = useState<MandiPriceRecord[]>([]);
  const [selectedMandi, setSelectedMandi] = useState<MandiPriceRecord | null>(null);
  const [quantity, setQuantity] = useState<number>(50);
  const [daysToWait, setDaysToWait] = useState<number>(20);
  const [distanceKm, setDistanceKm] = useState<number>(25);

  const [moisturePct, setMoisturePct] = useState<number>(14.0);
  const [hasArhtiDebt, setHasArhtiDebt] = useState<boolean>(false);
  const [debtAmount, setDebtAmount] = useState<number>(50000);

  const [loading, setLoading] = useState<boolean>(true);
  const [predictedFuturePrice, setPredictedFuturePrice] = useState<number>(2450);

  const [moistureInfo, setMoistureInfo] = useState<MoisturePenaltyResult | null>(null);
  const [debtInfo, setDebtInfo] = useState<ArhtiDebtAnalysis | null>(null);
  const [freightShares, setFreightShares] = useState<FairFreightShare[]>([]);

  async function fetchLiveMandiData() {
    setLoading(true);
    try {
      const data = await getMandiPrices();
      if (data && data.length > 0) {
        setMandis(data);
        const primary = data[0];
        setSelectedMandi(primary);
        runCalculations(primary, quantity, daysToWait, moisturePct, debtAmount, hasArhtiDebt, distanceKm);
      }
    } catch (err) {
      console.error("Error fetching live mandi prices:", err);
    } finally {
      setLoading(false);
    }
  }

  function runCalculations(
    mandi: MandiPriceRecord,
    qtl: number,
    days: number,
    moisture: number,
    debt: number,
    withDebt: boolean,
    dist: number
  ) {
    const basePrice = mandi.modal_price;
    setPredictedFuturePrice(Math.round(basePrice + days * 7.5));

    const moistureRes = calculateMoisturePenalty(qtl, basePrice, moisture);
    setMoistureInfo(moistureRes);

    const debtRes = calculateArhtiDebtDecision(qtl, basePrice, basePrice + 150, withDebt ? debt : 0, dist);
    setDebtInfo(debtRes);

    const farmerLabel = lang === "hi" ? "आप (किसान)" : lang === "pa" ? "ਤੁਸੀਂ (ਕਿਸਾਨ)" : "You (Farmer)";
    const mockFarmers = [
      { name: farmerLabel, qtl },
      { name: "Harpreet Singh", qtl: 40 },
      { name: "Gurpreet Singh", qtl: 60 },
    ];
    setFreightShares(calculateFairFreightSharing(mockFarmers, dist * 120));
  }

  useEffect(() => {
    fetchLiveMandiData();
  }, [lang]);

  const currentPrice = selectedMandi ? selectedMandi.modal_price : 2310;
  const netEffectiveCurrentPrice = currentPrice - (moistureInfo?.penaltyPerQtl || 0);

  const transportCostPerQtl = Math.round(distanceKm * 2.5);
  const storageCostTotal = daysToWait * 2 * quantity;

  const sellTodayNet = (netEffectiveCurrentPrice - transportCostPerQtl) * quantity;
  const waitNetReturn = (predictedFuturePrice - transportCostPerQtl) * quantity - storageCostTotal;
  const coalitionNetReturn = Math.round((predictedFuturePrice * 1.03 - transportCostPerQtl * 0.7) * quantity - storageCostTotal);

  function exportPDFReport() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("KisanLogic AI - Ground Reality Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Selected Mandi: ${selectedMandi?.mandi_name || 'Khanna APMC'}`, 14, 35);
    doc.text(`Crop Quantity: ${quantity} Quintals`, 14, 45);
    doc.text(`Grain Moisture: ${moisturePct}% (Penalty: -Rs ${moistureInfo?.penaltyPerQtl || 0}/qtl)`, 14, 55);
    doc.text(`Sell Today Net: Rs ${sellTodayNet.toLocaleString('en-IN')}`, 14, 70);
    doc.text(`Wait ${daysToWait} Days Net: Rs ${waitNetReturn.toLocaleString('en-IN')}`, 14, 80);
    doc.text(`Coalition & Sun-Dry Net: Rs ${coalitionNetReturn.toLocaleString('en-IN')}`, 14, 90);
    doc.save("KisanLogic_Decision_Report.pdf");
  }

  return (
    <div className="pb-16 p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> {t("groundSimulatorBadge")}
          </div>
          <h1 className="text-3xl font-black text-gray-900 mt-1">{t("groundSimulatorTitle")}</h1>
          <p className="text-gray-500 mt-0.5 text-xs font-medium">
            {t("groundSimulatorSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportPDFReport}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs cursor-pointer shadow-md transition-all"
          >
            <Download size={15} /> {t("exportPdf")}
          </button>

          <button
            onClick={fetchLiveMandiData}
            disabled={loading}
            className="bg-white border border-gray-300 text-black px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer hover:bg-gray-50 shadow-xs"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-emerald-600" : ""} />
            {t("syncMandi")}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6 mt-6">
        {/* Controls Panel */}
        <div className="bg-white border border-gray-200 rounded-[24px] p-6 space-y-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-3 border-gray-100 flex items-center gap-2">
            <Scale size={16} className="text-emerald-600" /> {t("mandiInputs")}
          </h2>

          <div>
            <label className="text-xs text-gray-500 font-bold block mb-1">{t("selectMandi")}</label>
            <select
              value={selectedMandi?.id || ""}
              onChange={(e) => {
                const found = mandis.find((m) => m.id === Number(e.target.value));
                if (found) {
                  setSelectedMandi(found);
                  runCalculations(found, quantity, daysToWait, moisturePct, debtAmount, hasArhtiDebt, distanceKm);
                }
              }}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {mandis.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.mandi_name} ({m.district}) — Modal: ₹{m.modal_price}/qtl
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>{t("cropQuantity")}:</span>
              <span className="text-emerald-600 font-black">{quantity} qtl</span>
            </div>
            <input
              type="range"
              min={10}
              max={300}
              step={5}
              value={quantity}
              onChange={(e) => {
                const val = Number(e.target.value);
                setQuantity(val);
                if (selectedMandi) runCalculations(selectedMandi, val, daysToWait, moisturePct, debtAmount, hasArhtiDebt, distanceKm);
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>{t("daysToHold")}:</span>
              <span className="text-emerald-600 font-black">{daysToWait} {lang === "hi" ? "दिन" : lang === "pa" ? "ਦਿਨ" : "days"}</span>
            </div>
            <input
              type="range"
              min={1}
              max={45}
              step={1}
              value={daysToWait}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDaysToWait(val);
                if (selectedMandi) runCalculations(selectedMandi, quantity, val, moisturePct, debtAmount, hasArhtiDebt, distanceKm);
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* REAL GROUND-REALITY CONTROLS */}
          <div className="border-t pt-4 border-gray-100 space-y-4">
            <h2 className="text-sm font-bold flex items-center gap-2 text-amber-700 uppercase tracking-wider">
              <Droplets size={16} /> {t("groundFactors")}
            </h2>

            <div>
              <div className="flex justify-between text-xs font-black">
                <span>{t("moisturePenalty")}:</span>
                <span className={moisturePct > 12 ? "text-red-600 bg-red-50 px-2 py-0.5 rounded-md" : "text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md"}>
                  {moisturePct}% {lang === "hi" ? "नमी" : lang === "pa" ? "ਨਮੀ" : "Moisture"}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={20}
                step={0.5}
                value={moisturePct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMoisturePct(val);
                  if (selectedMandi) runCalculations(selectedMandi, quantity, daysToWait, val, debtAmount, hasArhtiDebt, distanceKm);
                }}
                className="w-full mt-1.5 accent-amber-600 cursor-pointer"
              />
              <p className="text-[10px] text-gray-400 mt-1 font-medium">{t("moistureStandardNotice")}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">{t("arhtiDebt")}</span>
                <button
                  onClick={() => {
                    const toggle = !hasArhtiDebt;
                    setHasArhtiDebt(toggle);
                    if (selectedMandi) runCalculations(selectedMandi, quantity, daysToWait, moisturePct, debtAmount, toggle, distanceKm);
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-black cursor-pointer transition-all ${
                    hasArhtiDebt ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {hasArhtiDebt ? t("debtActive") : t("debtFree")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-5">
          {/* Moisture Penalty Card */}
          {moistureInfo && moistureInfo.isPenaltyApplied && (
            <div className="bg-amber-50 border border-amber-200 rounded-[22px] p-5 text-amber-950 shadow-xs">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-black uppercase tracking-wider">
                <ShieldAlert size={16} /> {t("moisturePenaltyAlert")}
              </div>
              <h3 className="text-xl font-black mt-1">
                -₹{moistureInfo.penaltyPerQtl}/qtl {t("penaltyDeduction")} (-₹{moistureInfo.totalPenaltyLoss.toLocaleString("en-IN")} Total)
              </h3>

              <div className="mt-3 flex items-center justify-between text-xs bg-amber-100/90 p-3 rounded-xl">
                <span className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Sun size={15} /> {t("sunDrySaveNotice")} {moistureInfo.recommendedSunDryDays} {lang === "hi" ? "दिन" : lang === "pa" ? "ਦਿਨ" : "days"}
                </span>
                <span className="font-extrabold text-emerald-800 text-sm">
                  +₹{moistureInfo.netSavingsIfDried.toLocaleString("en-IN")} {t("netSavingsText")}
                </span>
              </div>
            </div>
          )}

          {/* Game Theory Fair Freight Allocation Table */}
          <div className="bg-white border border-gray-200 rounded-[22px] p-5 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-wider">
              <Scale size={16} /> {t("freightTitle")}
            </div>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">{t("freightSubtitle")}</h3>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-bold">
                    <th className="pb-2">{t("tableFarmer")}</th>
                    <th className="pb-2">{t("tableLoad")}</th>
                    <th className="pb-2">{t("tableCost")}</th>
                    <th className="pb-2 text-right">{t("tableSavings")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-bold">
                  {freightShares.map((f, i) => (
                    <tr key={i} className={i === 0 ? "bg-emerald-50/80 text-emerald-950 font-black" : ""}>
                      <td className="py-2.5">{f.farmerName}</td>
                      <td className="py-2.5">{f.quantityQtl} qtl</td>
                      <td className="py-2.5 text-blue-700">₹{f.fairCostShareRs}</td>
                      <td className="py-2.5 text-right text-emerald-700">+₹{f.savingsVsIndividualRs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Comparison Cards */}
      <div className="grid md:grid-cols-3 gap-5 mt-6">
        <ScenarioCard
          title={t("sellToday")}
          amount={"₹" + sellTodayNet.toLocaleString("en-IN")}
          subtitle={`${t("penaltyDeduction")}: -₹${(moistureInfo?.penaltyPerQtl || 0) * quantity}`}
        />

        <ScenarioCard
          title={`${t("waitAndDry")} (${daysToWait} ${lang === "hi" ? "दिन" : lang === "pa" ? "ਦਿਨ" : "Days"})`}
          amount={"₹" + waitNetReturn.toLocaleString("en-IN")}
          subtitle={`+₹${(waitNetReturn - sellTodayNet).toLocaleString("en-IN")} ${t("netGain")}`}
        />

        <ScenarioCard
          title={t("coalitionSunDry")}
          amount={"₹" + coalitionNetReturn.toLocaleString("en-IN")}
          subtitle={`+₹${(coalitionNetReturn - sellTodayNet).toLocaleString("en-IN")} ${t("maxNetReturn")}`}
          best
        />
      </div>
    </div>
  );
}

function ScenarioCard({ title, amount, subtitle, best }: { title: string; amount: string; subtitle: string; best?: boolean }) {
  return (
    <div
      className={`rounded-[22px] p-6 border transition-all ${
        best ? "border-emerald-500 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20" : "border-gray-200 bg-white shadow-xs"
      }`}
    >
      {best && (
        <span className="text-[10px] bg-emerald-600 text-white px-3 py-1 rounded-full font-black inline-flex items-center gap-1 uppercase tracking-wider">
          <Sparkles size={12} /> AI Optimal Decision
        </span>
      )}
      <h3 className="text-base font-bold text-gray-900 mt-2">{title}</h3>
      <p className="text-3xl font-black text-gray-900 mt-2">{amount}</p>
      <p className="text-xs text-emerald-700 font-extrabold mt-1.5 flex items-center gap-1">
        <ArrowUpRight size={14} /> {subtitle}
      </p>
    </div>
  );
}