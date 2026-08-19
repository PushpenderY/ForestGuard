"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  GraduationCap,
  Heart,
  Leaf,
  Target,
  UserRound,
} from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#040d08]"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0">
        <Image
          src="/forest-background.png"
          alt="Forest landscape"
          fill
          priority
          className="object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Green overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-[#040d08]/95 via-[#07130d]/80 to-[#040d08]/70" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-[#07130d] to-transparent" />
      </div>

      {/* =====================================================
          DECORATIVE GLOW
      ====================================================== */}

      <div className="pointer-events-none absolute -left-45 top-[20%] h-125 w-125 rounded-full bg-emerald-500/10 blur-[150px]" />

      <div className="pointer-events-none absolute -right-37.5 top-[15%] h-125 w-125 rounded-full bg-emerald-400/10 blur-[150px]" />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-20 pt-32 md:px-10">

        <div className="grid w-full items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">

          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div className="max-w-2xl">

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 backdrop-blur-md">

              <Leaf
                size={15}
                className="text-emerald-400"
              />

              <span className="text-xs font-medium tracking-wide text-emerald-300">
                AI Powered • Data Driven • Impact Focused
              </span>

            </div>

            {/* Main heading */}
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">

              Predict.
              <br />

              Prevent.
              <br />

              <span className="text-emerald-400">
                Protect.
              </span>

            </h1>

            {/* Small line */}
            <div className="mt-8 h-1 w-14 rounded-full bg-emerald-400" />

            {/* Description */}
            <p className="mt-7 max-w-xl text-base leading-7 text-white/60 md:text-lg">
              Forest fire risk prediction powered by environmental
              data and intelligent analysis. Together, we can protect
              our forests, wildlife and future.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <a
                href="#predictor"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-black transition hover:-translate-y-1 hover:bg-emerald-300"
              >
                Explore Fire Risk

                <ArrowUpRight
                  size={17}
                  className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              <a
                href="/donate"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-black/20 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-emerald-400/10"
              >
                <Heart
                  size={17}
                  className="transition group-hover:fill-emerald-400 group-hover:text-emerald-400"
                />

                Support ForestGuard
              </a>

            </div>

            {/* Donation encouragement */}
            <div className="mt-10 max-w-xl rounded-3xl border border-emerald-400/10 bg-black/30 p-5 backdrop-blur-xl">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">

                  <Leaf
                    size={27}
                    className="text-emerald-400"
                  />

                </div>

                <div>

                  <p className="text-base font-semibold text-emerald-300">
                    Help protect our forests.
                  </p>

                  <p className="mt-1 text-lg font-bold text-white">
                    Even ₹9 can make a difference.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Your support helps spread awareness,
                    prevention and conservation.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE — CREATOR CARD
          ================================================== */}

          <div className="relative ml-auto w-full max-w-5xl ">

            {/* Outer glow */}
            <div className="absolute -inset-3 rounded-4xl bg-emerald-400/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-4xl border border-emerald-400/25 bg-[#06120b]/90 p-6 shadow-[0_0_80px_rgba(16,185,129,0.08)] backdrop-blur-xl md:p-8">

              {/* Decorative dots */}
              <div className="absolute right-8 top-8 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              <div className="absolute left-8 top-20 h-1.5 w-1.5 rounded-full bg-emerald-300/60" />

              {/* =================================================
                  PROFILE IMAGE
              ================================================== */}

              <div className="relative mx-auto h-52 w-52 md:h-64 md:w-64">

                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30" />

                {/* Glow */}
                <div className="absolute -inset-3 rounded-full bg-emerald-400/10 blur-xl" />

                {/* Image border */}
                <div className="absolute inset-2 overflow-hidden rounded-full border-4 border-emerald-400 bg-[#07130d]">

                  <Image
                    src="/pushpender.jpg"
                    alt="Pushpender Yadav"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-[4%_3%]"
                  />

                </div>

                {/* Bottom leaf decoration */}
                <div className="absolute -bottom-2 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-emerald-400/30 bg-[#07130d]">

                  <Leaf
                    size={17}
                    className="text-emerald-400"
                  />

                </div>

              </div>

              {/* =================================================
                  NAME
              ================================================== */}

              <div className="mt-8 text-center">

                <p className="text-3xl font-bold text-white md:text-4xl">
                  Pushpender
                  <span className="text-emerald-400">
                    {" "}Yadav
                  </span>
                </p>

                <div className="mx-auto mt-4 h-px w-40 bg-linear-to-r from-transparent via-emerald-400/50 to-transparent" />

              </div>

              {/* =================================================
                  COLLEGE
              ================================================== */}

              <div className="mt-7 flex items-start gap-4">

                <div className="rounded-xl bg-emerald-400/10 p-3">
                  <GraduationCap
                    size={20}
                    className="text-emerald-400"
                  />
                </div>

                <div>

                  <p className="text-sm font-semibold text-emerald-400">
                    Army Institute of Technology, Pune
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/40">
                    Electronics & Telecommunication Engineering
                  </p>

                </div>

              </div>

              {/* =================================================
                  ABOUT
              ================================================== */}

              <div className="mt-7 flex items-start gap-4">

                <div className="rounded-xl bg-emerald-400/10 p-3">
                  <UserRound
                    size={19}
                    className="text-emerald-400"
                  />
                </div>

                <div>

                  <p className="text-sm font-semibold text-emerald-400">
                    About Me
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    I&apos;m an engineering student passionate about
                    technology, web development and AI. I enjoy
                    building meaningful solutions that solve
                    real-world problems.
                  </p>

                </div>

              </div>

              {/* =================================================
                  OBJECTIVE
              ================================================== */}

              <div className="mt-7 flex items-start gap-4">

                <div className="rounded-xl bg-emerald-400/10 p-3">
                  <Target
                    size={19}
                    className="text-emerald-400"
                  />
                </div>

                <div>

                  <p className="text-sm font-semibold text-emerald-400">
                    Objective
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    To leverage technology, data and innovation to
                    create awareness, predict wildfire risks and
                    help protect forests and our environment.
                  </p>

                </div>

              </div>

              {/* =================================================
                  WHY FORESTGUARD
                  ================================================= */}

              <div className="mt-7 rounded-2xl border border-emerald-400/10 bg-emerald-400/4 p-5">

                <div className="flex items-start gap-3">

                  <Leaf
                    size={18}
                    className="mt-1 shrink-0 text-emerald-400"
                  />

                  <div>

                    <p className="text-sm font-semibold text-emerald-400">
                      Why I built ForestGuard
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/45">
                      I wanted to combine my interest in AI and
                      full-stack development with an environmental
                      problem that affects forests, wildlife and
                      communities.
                    </p>

                  </div>

                </div>

              </div>

              {/* Quote */}
              <div className="mt-5 rounded-2xl border border-white/5 bg-white/2 px-5 py-4 text-center">

                <p className="text-sm font-medium leading-6 text-white/60">
                  &quot;A small step today can protect thousands
                  of forests tomorrow.&quot;
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            BOTTOM STATS
        ====================================================== */}

        <div className="mt-12 grid grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-black/25 backdrop-blur-xl md:grid-cols-4">

          <div className="border-b border-white/10 p-5 text-center md:border-b-0 md:border-r">
            <p className="text-2xl font-bold text-emerald-400">
              80+
            </p>

            <p className="mt-1 text-xs text-white/35">
              Regions Monitored
            </p>
          </div>

          <div className="border-b border-white/10 p-5 text-center md:border-b-0 md:border-r">
            <p className="text-2xl font-bold text-orange-400">
              1,200+
            </p>

            <p className="mt-1 text-xs text-white/35">
              Fire Incidents Tracked
            </p>
          </div>

          <div className="border-white/10 p-5 text-center md:border-b-0 md:border-r">
            <p className="text-2xl font-bold text-emerald-400">
              4.2M+
            </p>

            <p className="mt-1 text-xs text-white/35">
              Hectares Affected
            </p>
          </div>

          <div className="border-white/10 p-5 text-center">
            <p className="text-2xl font-bold text-cyan-400">
              Millions
            </p>

            <p className="mt-1 text-xs text-white/35">
              People Impacted
            </p>
          </div>

        </div>

        {/* Scroll indicator */}
        <a
          href="#fire-map"
          className="mx-auto mt-10 flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/30 text-emerald-400 transition hover:-translate-y-1 hover:bg-emerald-400/10"
          aria-label="Scroll to fire map"
        >
          <ArrowDown
            size={18}
            className="animate-bounce"
          />
        </a>

      </div>

    </section>
  );
}