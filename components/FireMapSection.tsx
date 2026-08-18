import {
  ArrowUpRight,
  Flame,
  Globe2,
  MapPin,
  TrendingUp,
} from "lucide-react";

import FireMapWrapper from "./FireMapWrapper";

const stats = [
  {
    label: "Active Fire Zones",
    value: "2,481",
    change: "+12.4%",
    icon: Flame,
  },
  {
    label: "Area Affected",
    value: "1.8M",
    unit: "ha",
    change: "+8.7%",
    icon: MapPin,
  },
  {
    label: "High Risk Regions",
    value: "37",
    change: "+5",
    icon: TrendingUp,
  },
];

export default function FireMapSection() {
  return (
    <section
      id="fire-map"
      className="relative overflow-hidden bg-[#07130d] py-28 md:py-36"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute right-37.5 top-[20%] h-125 w-125 rounded-full bg-emerald-500/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">

        {/* Section heading */}
        <div className="mb-14 max-w-3xl">
          <div className="mb-5 flex items-center gap-2 text-emerald-400">
            <Globe2 size={18} />

            <span className="text-xs font-semibold uppercase tracking-[0.25em]">
              Global Intelligence
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            The planet is
            <span className="text-emerald-400"> burning.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
            Explore wildfire activity across different regions and
            understand how environmental conditions influence fire risk.
          </p>
        </div>

        {/* Dashboard */}
        <div className="grid gap-5 lg:grid-cols-[1.7fr_0.8fr]">

          {/* Map */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1d15]">
            <div className="absolute left-5 top-5 z-1000 rounded-xl border border-white/10 bg-black/50 px-4 py-2 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

                <span className="text-xs font-medium text-white">
                  Live fire activity
                </span>
              </div>
            </div>

            <FireMapWrapper />
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-5">

            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="group rounded-3xl border border-white/10 bg-white/3 p-6 transition hover:border-emerald-400/20 hover:bg-white/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="rounded-xl bg-emerald-400/10 p-3">
                      <Icon
                        size={20}
                        className="text-emerald-400"
                      />
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="text-white/20 transition group-hover:text-emerald-400"
                    />
                  </div>

                  <p className="mt-7 text-sm text-white/40">
                    {stat.label}
                  </p>

                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-4xl font-bold text-white">
                      {stat.value}
                    </span>

                    {stat.unit && (
                      <span className="mb-1 text-sm text-white/40">
                        {stat.unit}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-orange-400">
                    {stat.change} from previous period
                  </p>
                </div>
              );
            })}

          </div>
        </div>

        {/* Bottom information */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-white/2 p-5">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Highest Risk
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              Amazon Basin
            </p>

            <p className="mt-1 text-sm text-white/40">
              Extreme environmental conditions
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/2 p-5">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Most Active
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              North America
            </p>

            <p className="mt-1 text-sm text-white/40">
              Increased activity in recent days
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/2 p-5">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Monitoring
            </p>

            <p className="mt-2 text-lg font-semibold text-emerald-400">
              Global
            </p>

            <p className="mt-1 text-sm text-white/40">
              Multiple regions under observation
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}