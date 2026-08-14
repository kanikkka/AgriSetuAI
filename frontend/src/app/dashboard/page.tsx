"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  IndianRupee,
  BadgeCheck,
  ArrowUpRight,
  Sparkles,
  Users,
  RefreshCw,
  Loader2,
  BarChart2,
  Calendar,
} from "lucide-react";
import { getMandiPrices, MandiPriceRecord } from "@/services/mandiPrices";
import { getSmartDecision } from "@/services/smartDecision";
import { getMLModelBenchmarks, MLBenchmarkData } from "@/services/mandiIntelligenceService";

export default function DashboardPage() {
  const [topRecord, setTopRecord] = useState<MandiPriceRecord | null>(null);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [benchmarks, setBenchmarks] = useState<MLBenchmarkData[]>([]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      setBenchmarks(getMLModelBenchmarks());
      const prices = await getMandiPrices();
      if (prices && prices.length > 0) {
        const primary = prices[0];
        setTopRecord(primary);

        const today = new Date();
        const decision = await getSmartDecision({
          day: today.getDate(),
          month: today.getMonth() + 1,
          previous_price: primary.min_price,
          current_price: primary.modal_price,
          msp: 2275,
          storage_cost_per_quintal: 2,
          storage_days: 30,
        });

        if (decision?.prediction?.expected_future_price) {
          setPredictedPrice(decision.prediction.expected_future_price);
        }
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const currentPrice = topRecord?.modal_price || 2300;
  const forecastPrice = predictedPrice || 2450;
  const profitMargin = Math.max(0, forecastPrice - currentPrice);

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--coral)] font-semibold uppercase tracking-wider">
            KisanLogic Decision Control
          </p>
          <h1 className="text-4xl font-semibold mt-1">Farmer Dashboard</h1>
          <p className="text-[var(--muted)] mt-1 text-sm">
            Live overview of market prices, ML model benchmarks, and selling strategies.
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-medium text-black border border-[var(--border)] px-4 py-2.5 rounded-2xl bg-white cursor-pointer hover:bg-gray-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin text-[var(--coral)]" : ""} />
          Sync Live Stream
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid md:grid-cols-4 gap-5 mt-8">
        <StatCard
          icon={<IndianRupee className="text-[var(--coral)]" />}
          label="Current Modal Price"
          value={loading ? "Loading..." : "₹" + currentPrice + "/qtl"}
          sub={topRecord ? topRecord.mandi_name + " Mandi" : "Primary Market"}
        />

        <StatCard
          icon={<TrendingUp className="text-emerald-600" />}
          label="AI Forecast (30 Days)"
          value={loading ? "Calculating..." : "₹" + Math.round(forecastPrice) + "/qtl"}
          sub={"+₹" + Math.round(profitMargin) + " expected margin"}
        />

        <StatCard
          icon={<BadgeCheck className="text-blue-600" />}
          label="Wheat MSP Benchmark"
          value="₹2,275/qtl"
          sub="Official Government MSP"
        />

        <StatCard
          icon={<Users className="text-[var(--teal)]" />}
          label="Active Coalitions"
          value="3 Nearby Groups"
          sub="Combined Pooled Supply"
        />
      </div>

      {/* Strategy & ML Model Evaluation Grid */}
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 mt-8">
        {/* ML Strategy Recommendation */}
        <div className="bg-[var(--navy)] text-white rounded-[28px] p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[var(--teal)] opacity-20 blur-3xl" />

          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-sm font-medium">
              <Sparkles size={17} /> AI Recommendation Engine
            </div>

            <h2 className="text-3xl font-semibold mt-3">
              Recommended Strategy: Hold & Join Coalition
            </h2>

            <p className="text-white/70 mt-3 leading-relaxed">
              Based on live Agmarknet records from <strong>{topRecord?.mandi_name || "Khanna"}</strong> mandi, holding crop for 15–30 days yields an estimated gain of <strong>+₹{Math.round(profitMargin)}/qtl</strong>.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-white/50">Simulated Net Profit / 50 qtl</p>
              <p className="text-3xl font-semibold mt-1">
                ₹{((forecastPrice - 50) * 50).toLocaleString("en-IN")}
              </p>
            </div>

            <a
              href="/simulator"
              className="px-5 py-3 rounded-2xl bg-[var(--coral)] text-white text-sm font-medium flex items-center gap-2 hover:opacity-90"
            >
              Open What-If Simulator
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>

        {/* 🚀 PPT SLIDE 6 MATCH: ML MODEL COMPARISON BENCHMARK */}
        <div className="bg-white border border-[var(--border)] rounded-[28px] p-7 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b pb-4 border-[var(--border)]">
              <div>
                <p className="text-xs text-[var(--coral)] font-semibold uppercase tracking-wider">
                  Slide 6 Match — Research Benchmark
                </p>
                <h2 className="text-xl font-semibold mt-0.5">Model Comparison (MAE ↓)</h2>
              </div>
              <BarChart2 size={20} className="text-[var(--muted)]" />
            </div>

            <p className="text-xs text-[var(--muted)] mt-3">
              Lower Mean Absolute Error (MAE) indicates higher price prediction accuracy.
            </p>

            {/* Model Comparison Bars */}
            <div className="space-y-4 mt-5">
              {benchmarks.map((b) => (
                <div key={b.modelName}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className={b.isOurModel ? "text-emerald-700 font-bold" : "text-black"}>
                      {b.modelName}
                    </span>
                    <span className={b.isOurModel ? "text-emerald-700 font-bold" : "text-[var(--muted)]"}>
                      ₹{b.mae}/qtl Error
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        b.isOurModel ? "bg-emerald-600" : "bg-gray-400"
                      }`}
                      style={{ width: `${Math.min(100, (b.mae / 350) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a
            href="/market"
            className="w-full mt-6 py-3 rounded-2xl bg-[var(--surface-soft)] text-black font-semibold text-xs text-center block hover:bg-[var(--border)] transition-colors"
          >
            Explore 7-Day Market Predictions →
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-[24px] p-6 shadow-xs">
      <div className="mb-3">{icon}</div>
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      {sub && <p className="text-xs text-[var(--muted)] mt-1">{sub}</p>}
    </div>
  );
}