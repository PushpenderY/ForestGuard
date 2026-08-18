import {
  ArrowUpRight,
  Flame,
  Globe2,
  MapPin,
  TreePine,
  Users,
} from "lucide-react";

const wildfireData = [
  {
    location: "California, USA",
    year: "2025",
    title: "Southern California Wildfires",
    area: "Over 40,000 hectares",
    impact: "Large-scale forest and residential damage",
    severity: "Extreme",
    coordinates: "34.0522° N, 118.2437° W",
  },
  {
    location: "Amazon, Brazil",
    year: "2025",
    title: "Amazon Basin Fires",
    area: "Thousands of hectares",
    impact: "Severe ecosystem and biodiversity impact",
    severity: "High",
    coordinates: "3.4653° S, 62.2159° W",
  },
  {
    location: "Australia",
    year: "2024",
    title: "Australian Bushfires",
    area: "Large forest regions",
    impact: "Wildlife habitat and vegetation loss",
    severity: "High",
    coordinates: "25.2744° S, 133.7751° E",
  },
  {
    location: "Greece",
    year: "2024",
    title: "Mediterranean Wildfires",
    area: "Thousands of hectares",
    impact: "Forest, tourism and infrastructure damage",
    severity: "Moderate",
    coordinates: "39.0742° N, 21.8243° E",
  },
];

const impactStats = [
  {
    value: "4.2M+",
    label: "Hectares affected",
    icon: TreePine,
  },
  {
    value: "1,200+",
    label: "Fire incidents tracked",
    icon: Flame,
  },
  {
    value: "80+",
    label: "Regions monitored",
    icon: Globe2,
  },
  {
    value: "Millions",
    label: "People impacted",
    icon: Users,
  },
];

export default function WildfireImpact() {
  return (
    <section
      id="impact"
      className="relative overflow-hidden bg-[#0a1f16] py-28 md:py-36"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute right-[-200px] top-[20%] h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">

        {/* Heading */}
        <div className="mb-14 max-w-3xl">

          <div className="mb-5 flex items-center gap-2 text-orange-400">
            <Flame size={18} />

            <span className="text-xs font-semibold uppercase tracking-[0.25em]">
              Wildfire Intelligence
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            When forests
            <span className="text-orange-400"> burn,</span>
            <br />
            the impact spreads.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
            Wildfires can affect ecosystems, wildlife, communities and
            economies. Explore some of the major wildfire events and
            understand their wider impact.
          </p>

        </div>

        {/* Impact statistics */}
        <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {impactStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-orange-400/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between">

                  <div className="rounded-xl bg-orange-400/10 p-3">
                    <Icon
                      size={20}
                      className="text-orange-400"
                    />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-white/20 transition group-hover:text-orange-400"
                  />

                </div>

                <p className="mt-6 text-3xl font-bold text-white">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm text-white/40">
                  {stat.label}
                </p>
              </div>
            );
          })}

        </div>

        {/* Fire cards */}
        <div className="mb-7 flex items-end justify-between">

          <div>
            <p className="text-sm font-medium text-white">
              Recent wildfire events
            </p>

            <p className="mt-1 text-sm text-white/30">
              Selected events for environmental awareness
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs text-white/30 sm:flex">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            Severity monitored
          </div>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {wildfireData.map((fire) => (
            <article
              key={fire.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#07130d] p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-400/20"
            >

              {/* Top line */}
              <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-orange-500/0 via-orange-400/50 to-orange-500/0 opacity-0 transition group-hover:opacity-100" />

              {/* Header */}
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-orange-400/10 p-3">
                    <Flame
                      size={20}
                      className="text-orange-400"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">

                      <MapPin
                        size={13}
                        className="text-white/30"
                      />

                      <p className="text-sm text-white/50">
                        {fire.location}
                      </p>

                    </div>

                    <p className="mt-1 text-xs text-white/25">
                      {fire.year}
                    </p>
                  </div>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                    fire.severity === "Extreme"
                      ? "bg-red-500/10 text-red-400"
                      : fire.severity === "High"
                        ? "bg-orange-500/10 text-orange-400"
                        : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {fire.severity}
                </span>

              </div>

              {/* Title */}
              <h3 className="mt-7 text-2xl font-semibold text-white">
                {fire.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-6 text-white/40">
                {fire.impact}
              </p>

              {/* Data */}
              <div className="mt-7 grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">

                  <p className="text-[10px] uppercase tracking-wider text-white/25">
                    Area affected
                  </p>

                  <p className="mt-2 text-sm font-medium text-white">
                    {fire.area}
                  </p>

                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">

                  <p className="text-[10px] uppercase tracking-wider text-white/25">
                    Location
                  </p>

                  <p className="mt-2 text-xs font-medium text-white">
                    {fire.coordinates}
                  </p>

                </div>

              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">

                <span className="text-xs text-white/25">
                  Wildfire event
                </span>

                <button className="flex items-center gap-1 text-xs font-medium text-orange-400 transition hover:text-orange-300">
                  View details
                  <ArrowUpRight size={14} />
                </button>

              </div>

            </article>
          ))}

        </div>

        {/* Bottom message */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-orange-500/[0.06] to-transparent p-7 md:p-9">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="max-w-2xl">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                Why it matters
              </p>

              <h3 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
                Early detection can reduce the impact.
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Understanding environmental patterns and monitoring
                wildfire activity can help communities and authorities
                respond faster.
              </p>

            </div>

            <a
              href="#predictor"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-400 px-5 py-3 font-semibold text-black transition hover:bg-orange-300"
            >
              Check Fire Risk
              <ArrowUpRight size={17} />
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}