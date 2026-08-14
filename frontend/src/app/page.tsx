import {
  ArrowRight,
  Brain,
  CloudSun,
  Handshake,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen pb-16">
      {/* Top Navbar */}
      <nav className="mx-5 mt-5 rounded-[24px] bg-[var(--navy)] px-7 py-4 text-white flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Sprout size={23} />
          </div>

          <div>
            <p className="text-xl font-bold tracking-tight">
              KisanLogic.AI
            </p>

            <p className="text-xs text-white/60">
              Agricultural Decision Intelligence
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/75">
          <a href="/dashboard" className="hover:text-white">Dashboard</a>
          <a href="/market" className="hover:text-white">Market Intelligence</a>
          <a href="/simulator" className="hover:text-white">Simulator</a>
          <a href="/coalitions" className="hover:text-white">Coalitions</a>
          <a href="/copilot" className="hover:text-white">AI Copilot</a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-[var(--coral)] text-white font-medium shadow-lg hover:opacity-90 text-sm"
          >
            Launch Platform
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-16 lg:px-24 pt-16 pb-12 grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--lavender-soft)] text-[var(--navy)] text-sm font-medium">
            <Sparkles size={16} />
            Next-generation agricultural intelligence
          </div>

          <h1 className="mt-7 text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.03] tracking-[-0.04em] max-w-4xl">
            From market data to
            <span className="text-[var(--coral)]"> smarter farm decisions.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl leading-8 text-[var(--muted)] max-w-2xl">
            KisanLogic.AI helps farmers decide when to sell, where to sell,
            how much to hold, and which market opportunity gives the strongest
            expected return.
          </p>

          <div className="flex flex-wrap gap-4 mt-9">
            <a
              href="/dashboard"
              className="flex items-center gap-2 bg-[var(--navy)] text-white px-7 py-3.5 rounded-2xl font-medium shadow-xl hover:opacity-95"
            >
              Explore KisanLogic
              <ArrowRight size={18} />
            </a>

            <a
              href="/market"
              className="px-7 py-3.5 rounded-2xl bg-white border border-[var(--border)] font-medium shadow-sm hover:bg-gray-50"
            >
              View Market Intelligence
            </a>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-12 max-w-2xl">
            <Metric value="Live Mandi" label="Database Synchronization" />
            <Metric value="ML Model" label="Price Forecasting Engine" />
            <Metric value="AI-led" label="Decision Support System" />
          </div>
        </div>

        {/* Live Feature Preview Card */}
        <div className="relative">
          <div className="absolute -top-10 -left-10 h-36 w-36 rounded-full bg-[var(--lavender)]/15 blur-3xl" />
          <div className="absolute -bottom-10 -right-5 h-40 w-40 rounded-full bg-[var(--coral)]/15 blur-3xl" />

          <div className="relative rounded-[32px] bg-white border border-[var(--border)] shadow-2xl overflow-hidden">
            <div className="px-7 py-5 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">
                  Farmer Intelligence
                </p>

                <p className="text-lg font-semibold">
                  Wheat • Khanna Mandi
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-full bg-[var(--teal-soft)] text-[var(--teal)] text-sm font-medium">
                Live analysis
              </div>
            </div>

            <div className="p-7">
              <div className="rounded-[24px] bg-[var(--navy)] text-white p-6">
                <p className="text-sm text-white/60">
                  AI Recommendation
                </p>

                <div className="flex items-end justify-between mt-3">
                  <div>
                    <h2 className="text-4xl font-semibold">
                      HOLD
                    </h2>

                    <p className="text-white/70 mt-2">
                      Re-evaluate after 15 days
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-white/60">
                      Confidence
                    </p>

                    <p className="text-3xl font-semibold text-[#f5c55d]">
                      85%
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <InfoCard
                  icon={<TrendingUp size={19} />}
                  label="Expected Price"
                  value="₹2,450"
                  tone="coral"
                />

                <InfoCard
                  icon={<CloudSun size={19} />}
                  label="Weather Risk"
                  value="Low"
                  tone="teal"
                />

                <InfoCard
                  icon={<MapPinned size={19} />}
                  label="Best Market"
                  value="Khanna APMC"
                  tone="lavender"
                />

                <InfoCard
                  icon={<Handshake size={19} />}
                  label="Coalition Gain"
                  value="+₹9,400"
                  tone="amber"
                />
              </div>

              <div className="mt-5 p-5 rounded-2xl bg-[var(--surface-soft)]">
                <p className="text-sm font-medium">
                  Why this recommendation?
                </p>

                <p className="text-sm text-[var(--muted)] mt-2 leading-6">
                  Short-term market momentum is positive, weather risk is low,
                  and nearby buyer demand is strengthening.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 md:px-16 lg:px-24 py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[var(--coral)] uppercase tracking-[0.2em]">
            One intelligence layer
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mt-4">
            More than crop price prediction.
          </h2>

          <p className="text-[var(--muted)] text-lg mt-4 leading-8">
            KisanLogic combines market signals, farmer intent, buyer demand,
            storage, logistics and AI-based decision support into one platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          <FeatureCard
            icon={<Brain />}
            title="Decision Intelligence"
            text="Sell, hold or store recommendations backed by market and cost signals."
            accent="bg-[var(--lavender-soft)]"
            href="/dashboard"
          />

          <FeatureCard
            icon={<Handshake />}
            title="Farmer Coalitions"
            text="Connect upcoming farmer supply with bulk buyers for maximum price leverage."
            accent="bg-[var(--coral-soft)]"
            href="/coalitions"
          />

          <FeatureCard
            icon={<MapPinned />}
            title="What-If Simulator"
            text="Compare mandi, storage, transport and coalition opportunities live."
            accent="bg-[var(--teal-soft)]"
            href="/simulator"
          />

          <FeatureCard
            icon={<ShieldCheck />}
            title="AI Copilot"
            text="Get instant natural language guidance powered by real DB market entries."
            accent="bg-[var(--amber-soft)]"
            href="/copilot"
          />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-6 md:mx-16 lg:mx-24 my-10 rounded-[32px] bg-[var(--navy)] text-white px-8 md:px-14 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <p className="text-white/55 text-sm uppercase tracking-[0.2em]">
            Agriculture meets intelligence
          </p>

          <h3 className="text-3xl md:text-4xl font-semibold mt-3 max-w-2xl">
            Make every selling decision with more context, not more guesswork.
          </h3>
        </div>

        <a
          href="/dashboard"
          className="shrink-0 bg-[var(--coral)] px-6 py-3.5 rounded-2xl font-medium flex items-center gap-2 text-white hover:opacity-90"
        >
          Open App Dashboard
          <ArrowRight size={18} />
        </a>
      </section>
    </main>
  );
}

function Metric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-2xl font-semibold text-[var(--navy)]">
        {value}
      </p>

      <p className="text-sm text-[var(--muted)] mt-1">
        {label}
      </p>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "coral" | "teal" | "lavender" | "amber";
}) {
  const toneClass = {
    coral: "bg-[var(--coral-soft)] text-[var(--coral)]",
    teal: "bg-[var(--teal-soft)] text-[var(--teal)]",
    lavender: "bg-[var(--lavender-soft)] text-[var(--lavender)]",
    amber: "bg-[var(--amber-soft)] text-[#b98625]",
  }[tone];

  return (
    <div className="rounded-2xl border border-[var(--border)] p-4 bg-white">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${toneClass}`}>
        {icon}
      </div>

      <p className="text-xs text-[var(--muted)] mt-4">
        {label}
      </p>

      <p className="text-xl font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
  accent,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  accent: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="bg-white rounded-[24px] border border-[var(--border)] p-6 shadow-sm hover:-translate-y-1 transition block cursor-pointer"
    >
      <div className={`h-12 w-12 ${accent} rounded-2xl flex items-center justify-center text-[var(--navy)]`}>
        {icon}
      </div>

      <h3 className="text-xl font-semibold mt-5">
        {title}
      </h3>

      <p className="text-[var(--muted)] mt-3 leading-6 text-sm">
        {text}
      </p>
    </a>
  );
}