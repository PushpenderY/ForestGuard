import {
  AlertOctagon,
  ArrowRight,
  Flame,
  Globe2,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Users,
} from "lucide-react";

const nationalOrganizations = [
  {
    name: "National Disaster Response",
    type: "Emergency Response",
    description:
      "Coordinates disaster response, rescue operations and emergency preparedness during major natural disasters.",
    icon: Siren,
  },
  {
    name: "Forest & Wildlife Services",
    type: "Forest Protection",
    description:
      "Responsible for forest monitoring, wildfire prevention, conservation and ecological protection.",
    icon: ShieldCheck,
  },
  {
    name: "Emergency Management Teams",
    type: "Rapid Response",
    description:
      "Supports evacuation, rescue coordination and emergency communication during wildfire incidents.",
    icon: Users,
  },
];

const internationalOrganizations = [
  {
    name: "United Nations",
    type: "International",
    description:
      "Supports international disaster risk reduction, climate resilience and humanitarian coordination.",
    icon: Globe2,
  },
  {
    name: "Global Wildfire Networks",
    type: "Wildfire Monitoring",
    description:
      "Connects wildfire researchers, agencies and experts to improve global fire management.",
    icon: Flame,
  },
  {
    name: "International Relief Agencies",
    type: "Humanitarian Support",
    description:
      "Provides humanitarian assistance and recovery support to communities affected by disasters.",
    icon: ShieldAlert,
  },
];

const safetySteps = [
  {
    number: "01",
    title: "Stay informed",
    description:
      "Follow official emergency alerts and local authorities for the latest wildfire information.",
  },
  {
    number: "02",
    title: "Prepare to evacuate",
    description:
      "Keep essential documents, water, medicines and emergency supplies ready.",
  },
  {
    number: "03",
    title: "Avoid smoke",
    description:
      "Move away from heavy smoke and use protective measures when air quality deteriorates.",
  },
  {
    number: "04",
    title: "Follow evacuation orders",
    description:
      "Leave immediately when authorities issue an evacuation order for your area.",
  },
];

export default function EmergencyResponse() {
  return (
    <section
      id="organizations"
      className="relative overflow-hidden bg-[#07130d] py-28 md:py-36"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute left-[-180px] top-[15%] h-[450px] w-[450px] rounded-full bg-red-500/5 blur-[140px]" />

      <div className="pointer-events-none absolute right-[-180px] bottom-[10%] h-[450px] w-[450px] rounded-full bg-orange-500/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">

        {/* Header */}
        <div className="mb-14 max-w-3xl">

          <div className="mb-5 flex items-center gap-2 text-red-400">
            <AlertOctagon size={18} />

            <span className="text-xs font-semibold uppercase tracking-[0.25em]">
              Emergency Response
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            When fire strikes,
            <br />
            <span className="text-red-400">response matters.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
            Wildfire prevention is a shared responsibility. Learn about
            disaster response organizations, emergency preparedness and
            the actions that can help protect communities.
          </p>

        </div>

        {/* Emergency banner */}
        <div className="mb-12 overflow-hidden rounded-3xl border border-red-400/20 bg-red-500/[0.06]">

          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">

            <div className="flex items-start gap-4">

              <div className="rounded-2xl bg-red-500/10 p-4">
                <Siren
                  size={28}
                  className="text-red-400"
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                  Emergency notice
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white md:text-2xl">
                  In immediate danger? Contact your local emergency services.
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  ForestGuard provides awareness and risk information.
                  Always follow instructions from official authorities.
                </p>
              </div>

            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">

              <Phone
                size={20}
                className="text-red-400"
              />

              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Emergency
                </p>

                <p className="text-lg font-bold text-white">
                  Local Services
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* National organizations */}
        <div className="mb-16">

          <div className="mb-7 flex items-end justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                National Response
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                Organizations on the ground
              </h3>
            </div>

            <MapPin
              size={22}
              className="hidden text-white/20 sm:block"
            />

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {nationalOrganizations.map((organization) => {
              const Icon = organization.icon;

              return (
                <article
                  key={organization.name}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-red-400/20 hover:bg-white/[0.05]"
                >

                  <div className="flex items-start justify-between">

                    <div className="rounded-xl bg-red-400/10 p-3">
                      <Icon
                        size={21}
                        className="text-red-400"
                      />
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-white/20 transition group-hover:translate-x-1 group-hover:text-red-400"
                    />

                  </div>

                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-wider text-red-400/70">
                    {organization.type}
                  </p>

                  <h4 className="mt-2 text-xl font-semibold text-white">
                    {organization.name}
                  </h4>

                  <p className="mt-3 text-sm leading-6 text-white/40">
                    {organization.description}
                  </p>

                  <button className="mt-6 text-xs font-medium text-white/50 transition hover:text-white">
                    Learn more →
                  </button>

                </article>
              );
            })}

          </div>
        </div>

        {/* International organizations */}
        <div className="mb-20">

          <div className="mb-7">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
              Global Response
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
              International organizations
            </h3>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {internationalOrganizations.map((organization) => {
              const Icon = organization.icon;

              return (
                <article
                  key={organization.name}
                  className="group rounded-3xl border border-white/10 bg-[#0b1d15] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20"
                >

                  <div className="flex items-start justify-between">

                    <div className="rounded-xl bg-emerald-400/10 p-3">
                      <Icon
                        size={21}
                        className="text-emerald-400"
                      />
                    </div>

                    <Globe2
                      size={18}
                      className="text-white/10"
                    />

                  </div>

                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-wider text-emerald-400/70">
                    {organization.type}
                  </p>

                  <h4 className="mt-2 text-xl font-semibold text-white">
                    {organization.name}
                  </h4>

                  <p className="mt-3 text-sm leading-6 text-white/40">
                    {organization.description}
                  </p>

                  <button className="mt-6 text-xs font-medium text-white/50 transition hover:text-white">
                    Explore organization →
                  </button>

                </article>
              );
            })}

          </div>
        </div>

        {/* Safety section */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1d15]">

          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

            {/* Left */}
            <div className="relative overflow-hidden border-b border-white/10 p-7 md:p-10 lg:border-b-0 lg:border-r">

              <div className="absolute right-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-red-500/10 blur-[100px]" />

              <div className="relative">

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10">
                  <ShieldAlert
                    size={28}
                    className="text-red-400"
                  />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                  Wildfire Safety
                </p>

                <h3 className="mt-3 text-3xl font-bold text-white">
                  Know what to do
                  <br />
                  before it happens.
                </h3>

                <p className="mt-5 text-sm leading-6 text-white/40">
                  Preparation can make a critical difference during a
                  fast-moving wildfire. Keep yourself informed and
                  follow official instructions.
                </p>

              </div>
            </div>

            {/* Right */}
            <div className="p-7 md:p-10">

              <div className="grid gap-7 sm:grid-cols-2">

                {safetySteps.map((step) => (
                  <div
                    key={step.number}
                    className="group"
                  >

                    <div className="flex items-center gap-3">

                      <span className="text-xs font-bold text-red-400">
                        {step.number}
                      </span>

                      <div className="h-px flex-1 bg-white/5 transition group-hover:bg-red-400/20" />

                    </div>

                    <h4 className="mt-4 text-lg font-semibold text-white">
                      {step.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-white/40">
                      {step.description}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}