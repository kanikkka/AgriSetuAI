"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Users,
  TrendingUp,
  MapPin,
  IndianRupee,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { getSmartDecision } from "@/services/smartDecision";

export default function DecisionPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function runDecision() {
    setLoading(true);
    setError("");

    try {
      const data = await getSmartDecision({
        day: 10,
        month: 8,
        previous_price: 2450,
        current_price: 2520,
        msp: 2585,
        storage_cost_per_quintal: 2,
        storage_days: 30,
      });

      setResult(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        "Unable to connect to the KisanLogic.AI backend."
      );
    } finally {
      setLoading(false);
    }
  }

  const futurePrice =
    result?.prediction?.expected_future_price ?? "—";

  const decision = result?.decision;

  return (
    <div>
      <p className="text-sm text-[var(--coral)] font-medium">
        AI Decision Intelligence
      </p>

      <h1 className="text-4xl font-semibold mt-1">
        Decision Center
      </h1>

      <p className="text-[var(--muted)] mt-2 max-w-2xl">
        Get an AI-supported selling decision using your current market
        conditions and predicted future price.
      </p>

      <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6 mt-8">

        <div className="bg-[var(--navy)] text-white rounded-[28px] p-8">
          <div className="flex items-center gap-2 text-emerald-300 text-sm">
            <CheckCircle2 size={18} />
            AI Recommendation
          </div>

          <h2 className="text-4xl font-semibold mt-4">
            {decision?.decision ?? "Run analysis"}
          </h2>

          <p className="text-white/60 mt-3 leading-7 max-w-xl">
            The recommendation is generated from the current price,
            MSP, predicted future price and storage economics.
          </p>

          <div className="mt-8">
            <p className="text-white/45 text-sm">
              Predicted Future Price
            </p>

            <p className="text-5xl font-semibold mt-2">
              {typeof futurePrice === "number"
                ? `₹${futurePrice.toFixed(0)}`
                : futurePrice}
            </p>
          </div>

          <button
            onClick={runDecision}
            disabled={loading}
            className="mt-8 bg-[var(--coral)] px-6 py-3 rounded-2xl flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Run AI Decision
                <TrendingUp size={18} />
              </>
            )}
          </button>

          {error && (
            <p className="mt-5 text-red-300 text-sm">
              {error}
            </p>
          )}
        </div>

        <div className="bg-white border border-[var(--border)] rounded-[28px] p-7">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted)]">
                Current Market Inputs
              </p>

              <h2 className="text-2xl font-semibold mt-1">
                Wheat Market
              </h2>
            </div>

            <div className="h-12 w-12 rounded-2xl bg-[var(--teal-soft)] text-[var(--teal)] flex items-center justify-center">
              <ShieldCheck size={23} />
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <InputCard
              icon={<IndianRupee size={18} />}
              label="Current Price"
              value="₹2,520 / qtl"
            />

            <InputCard
              icon={<ShieldCheck size={18} />}
              label="MSP"
              value="₹2,585 / qtl"
            />

            <InputCard
              icon={<Clock3 size={18} />}
              label="Storage Period"
              value="30 days"
            />

            <InputCard
              icon={<Users size={18} />}
              label="Storage Cost"
              value="₹2 / qtl / day"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-8">

        <Signal
          icon={<TrendingUp />}
          title="Predicted Price"
          value={
            typeof futurePrice === "number"
              ? `₹${futurePrice.toFixed(0)}`
              : "Run analysis"
          }
        />

        <Signal
          icon={<IndianRupee />}
          title="Current Price"
          value="₹2,520"
        />

        <Signal
          icon={<MapPin />}
          title="Market Status"
          value={result ? "Analyzed" : "Waiting"}
        />

      </div>

      <div className="mt-8 bg-[var(--coral-soft)] border border-[var(--border)] rounded-[28px] p-7">
        <p className="text-sm text-[var(--muted)]">
          Decision Engine
        </p>

        <h2 className="text-xl font-semibold mt-2">
          {decision?.reason ??
            "Click “Run AI Decision” to get the backend-powered recommendation."}
        </h2>

        <p className="text-sm text-[var(--muted)] mt-3 max-w-3xl leading-6">
          KisanLogic.AI uses the backend prediction model and decision engine
          to support the farmer's selling decision. Actual market prices can
          change.
        </p>
      </div>
    </div>
  );
}

function InputCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface-soft)]">
      <div className="text-[var(--coral)]">
        {icon}
      </div>

      <div>
        <p className="text-xs text-[var(--muted)]">
          {label}
        </p>

        <p className="font-semibold mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}

function Signal({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-[22px] p-6">
      <div className="text-[var(--coral)]">
        {icon}
      </div>

      <p className="text-sm text-[var(--muted)] mt-4">
        {title}
      </p>

      <p className="text-2xl font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}
