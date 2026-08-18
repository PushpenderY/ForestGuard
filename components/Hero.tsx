import {
  ArrowDown,
  ArrowRight,
  Flame,
  ShieldCheck,
  Trees,
} from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=85')",
        }}
      />

      {/* Dark overlays */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-[#07130d]" />

      <div className="absolute inset-0 bg-linear-to-r from-[#07130d] via-[#07130d]/70 to-transparent" />

      {/* Decorative glow */}
      <div className="-left-37.5 absolute top-[30%] h-100 w-100 rounded-full bg-emerald-500/10 blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-40 md:px-10">
        
        {/* Badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 backdrop-blur-md">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

          <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
            Forest Intelligence Platform
          </span>
        </div>

        {/* Heading */}
        <h1 className="max-w-5xl text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl md:text-8xl">
          Predict.
          <br />

          <span className="text-emerald-400">Prevent.</span>
          <br />

          Protect.
        </h1>

        {/* Description */}
        <p className="mt-8 max-w-xl text-base leading-7 text-white/65 md:text-lg">
          A data-driven platform that analyzes environmental conditions
          to estimate forest fire risk and help communities prepare
          before disaster strikes.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href="#predictor"
            className="group inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-3.5 font-semibold text-black transition hover:bg-emerald-300"
          >
            Predict Fire Risk

            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>

          <a
            href="#fire-map"
            className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-medium text-white backdrop-blur-md transition hover:bg-white/10"
          >
            Explore Fire Map
          </a>
        </div>

        {/* Mini stats */}
        <div className="mt-16 flex flex-wrap gap-8 border-t border-white/10 pt-7">
          
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-2.5">
              <Flame size={18} className="text-orange-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Real-time
              </p>
              <p className="text-xs text-white/40">
                Risk assessment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-2.5">
              <Trees size={18} className="text-emerald-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Forest focused
              </p>
              <p className="text-xs text-white/40">
                Environmental data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-2.5">
              <ShieldCheck size={18} className="text-blue-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Prevention first
              </p>
              <p className="text-xs text-white/40">
                Early awareness
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#fire-map"
        className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition hover:text-white"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">
          Scroll to explore
        </span>

        <ArrowDown size={18} className="animate-bounce" />
      </a>
    </section>
  );
}