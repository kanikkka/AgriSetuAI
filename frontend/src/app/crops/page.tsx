import { Plus, Sprout, CalendarDays, Warehouse, MapPin } from "lucide-react";

const crops = [
  {
    name: "Wheat",
    farm: "Main Farm",
    quantity: "40 quintal",
    harvest: "20 Aug 2026",
    status: "Growing",
    storage: "Available",
  },
  {
    name: "Potato",
    farm: "North Field",
    quantity: "25 quintal",
    harvest: "28 Aug 2026",
    status: "Ready Soon",
    storage: "Not Available",
  },
];

export default function CropsPage() {
  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm text-[var(--muted)]">
            Farm Management
          </p>

          <h1 className="text-4xl font-semibold mt-1">
            My Crops
          </h1>

          <p className="text-[var(--muted)] mt-2">
            Track crop quantity, harvest timeline and storage availability.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-[var(--coral)] text-white px-5 py-3 rounded-2xl shadow-lg">
          <Plus size={18} />
          Add Crop
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-9">
        {crops.map((crop) => (
          <div
            key={crop.name}
            className="bg-white border border-[var(--border)] rounded-[26px] p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-2xl bg-[var(--teal-soft)] text-[var(--teal)] flex items-center justify-center">
                <Sprout size={24} />
              </div>

              <span className="text-xs px-3 py-1.5 rounded-full bg-[var(--amber-soft)] text-[#a87517] font-medium">
                {crop.status}
              </span>
            </div>

            <h2 className="text-2xl font-semibold mt-5">
              {crop.name}
            </h2>

            <p className="text-[var(--muted)] text-sm mt-1">
              {crop.farm}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <Info
                icon={<Sprout size={17} />}
                label="Quantity"
                value={crop.quantity}
              />

              <Info
                icon={<CalendarDays size={17} />}
                label="Harvest"
                value={crop.harvest}
              />

              <Info
                icon={<Warehouse size={17} />}
                label="Storage"
                value={crop.storage}
              />

              <Info
                icon={<MapPin size={17} />}
                label="Location"
                value="Mohali"
              />
            </div>

            <button className="mt-6 w-full py-3 rounded-2xl bg-[var(--navy)] text-white font-medium">
              View Crop Intelligence
            </button>
          </div>
        ))}
      </div>
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
    <div className="rounded-2xl bg-[var(--surface-soft)] p-4">
      <div className="text-[var(--coral)]">
        {icon}
      </div>

      <p className="text-xs text-[var(--muted)] mt-3">
        {label}
      </p>

      <p className="font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}
