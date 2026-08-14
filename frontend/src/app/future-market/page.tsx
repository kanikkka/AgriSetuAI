import {
  Wheat,
  Handshake,
  Users,
  CalendarDays,
  MapPin,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const buyers = [
  {
    name: "Punjab Foods Pvt. Ltd.",
    demand: "300 qtl",
    price: "Rs. 2,610/qtl",
    match: "92%",
    location: "Mohali",
  },
  {
    name: "North Grain Processors",
    demand: "180 qtl",
    price: "Rs. 2,575/qtl",
    match: "84%",
    location: "Ludhiana",
  },
];

export default function FutureMarketPage() {
  return (
    <div>
      {/* HEADER */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-sm text-[var(--coral)] font-medium">
            Future Agricultural Network
          </p>

          <h1 className="text-4xl font-semibold mt-1">
            Future Market
          </h1>

          <p className="text-[var(--muted)] mt-2 max-w-2xl">
            Discover buyer demand before harvest and coordinate your
            future crop supply with better market opportunities.
          </p>
        </div>

        <button className="bg-[var(--coral)] text-white px-5 py-3 rounded-2xl flex items-center gap-2">
          Add Future Supply
          <ArrowRight size={18} />
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-5 mt-8">
        <Stat
          label="Your Future Supply"
          value="40 qtl"
          sub="Wheat - 20 Aug"
        />

        <Stat
          label="Upcoming Demand"
          value="480 qtl"
          sub="Next 14 days"
        />

        <Stat
          label="Strong Matches"
          value="2"
          sub="Above 80% match"
        />

        <Stat
          label="Coalition Supply"
          value="320 qtl"
          sub="8 nearby farmers"
        />
      </div>

      {/* SUPPLY + MARKET SIGNAL */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border border-[var(--border)] rounded-[26px] p-7">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-[var(--muted)]">
                Your Upcoming Supply
              </p>

              <h2 className="text-2xl font-semibold mt-1">
                Wheat Harvest
              </h2>
            </div>

            <div className="h-12 w-12 bg-[var(--teal-soft)] text-[var(--teal)] rounded-2xl flex items-center justify-center">
              <Wheat size={23} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Info
              icon={<Wheat size={17} />}
              label="Crop"
              value="Wheat"
            />

            <Info
              icon={<TrendingUp size={17} />}
              label="Quantity"
              value="40 quintal"
            />

            <Info
              icon={<CalendarDays size={17} />}
              label="Available From"
              value="20 Aug 2026"
            />

            <Info
              icon={<MapPin size={17} />}
              label="District"
              value="Mohali"
            />
          </div>
        </div>

        <div className="bg-[var(--navy)] text-white rounded-[26px] p-7">
          <p className="text-sm text-white/50">
            AI Future Market Signal
          </p>

          <h2 className="text-3xl font-semibold mt-3">
            Demand may exceed available supply
          </h2>

          <p className="text-white/60 mt-4 leading-7">
            Upcoming buyer demand is currently stronger than registered
            farmer supply for this harvest window.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-7">
            <DarkStat
              label="Demand"
              value="480 qtl"
            />

            <DarkStat
              label="Supply"
              value="320 qtl"
            />

            <DarkStat
              label="Gap"
              value="160 qtl"
            />

            <DarkStat
              label="Signal"
              value="Strong"
            />
          </div>
        </div>
      </div>

      {/* BUYERS */}
      <div className="bg-white border border-[var(--border)] rounded-[26px] p-7 mt-8">
        <div className="flex items-center gap-3">
          <Handshake className="text-[var(--coral)]" />

          <div>
            <p className="text-sm text-[var(--muted)]">
              Buyer Matching
            </p>

            <h2 className="text-2xl font-semibold">
              Future buyer opportunities
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mt-6">
          {buyers.map((buyer) => (
            <div
              key={buyer.name}
              className="border border-[var(--border)] rounded-[22px] p-6"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-xs text-[var(--muted)]">
                    BUYER
                  </p>

                  <h3 className="text-xl font-semibold mt-1">
                    {buyer.name}
                  </h3>
                </div>

                <span className="h-fit bg-[var(--teal-soft)] text-[var(--teal)] px-3 py-1.5 rounded-full text-sm font-medium">
                  {buyer.match} match
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <Mini
                  label="Demand"
                  value={buyer.demand}
                />

                <Mini
                  label="Offer"
                  value={buyer.price}
                />

                <Mini
                  label="Location"
                  value={buyer.location}
                />
              </div>

              <button className="w-full mt-6 bg-[var(--navy)] text-white py-3 rounded-2xl">
                View Opportunity
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* COALITION */}
      <div className="mt-8 bg-[var(--lavender-soft)] rounded-[26px] p-7 border border-[var(--border)]">
        <div className="flex items-start justify-between gap-8">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-[var(--lavender)]">
              <Users size={23} />
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">
                Smart Coalition Opportunity
              </p>

              <h2 className="text-2xl font-semibold mt-1">
                Combine supply with 7 nearby farmers
              </h2>

              <p className="text-[var(--muted)] mt-2 max-w-2xl">
                Together you can fulfil a 300 quintal buyer requirement
                and potentially negotiate a stronger selling price.
              </p>
            </div>
          </div>

          <button className="bg-[var(--navy)] text-white px-5 py-3 rounded-2xl whitespace-nowrap">
            Explore Coalition
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-[22px] p-5">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
      <p className="text-xs text-[var(--muted)] mt-2">{sub}</p>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[var(--surface-soft)] rounded-2xl p-4">
      <div className="text-[var(--coral)]">{icon}</div>
      <p className="text-xs text-[var(--muted)] mt-3">{label}</p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  );
}

function DarkStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/10 rounded-2xl p-4">
      <p className="text-xs text-white/50">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function Mini({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="font-medium mt-1">{value}</p>
    </div>
  );
}