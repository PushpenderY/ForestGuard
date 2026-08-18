"use client";

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Droplets,
  Flame,
  Gauge,
  Loader2,
  Thermometer,
  Wind,
} from "lucide-react";

import { useState } from "react";

type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "EXTREME";

export default function RiskPredictor() {
  const [temperature, setTemperature] = useState(32);
  const [humidity, setHumidity] = useState(45);
  const [windSpeed, setWindSpeed] = useState(18);
  const [rainfall, setRainfall] = useState(5);
  const [dryness, setDryness] = useState(65);

  const [month, setMonth] = useState("May");
  const [day, setDay] = useState(18);

  const [risk, setRisk] = useState<RiskLevel | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const calculateRisk = () => {
    setLoading(true);

    setTimeout(() => {
      let calculatedScore = 0;

      // Temperature
      if (temperature >= 40) calculatedScore += 25;
      else if (temperature >= 35) calculatedScore += 20;
      else if (temperature >= 30) calculatedScore += 14;
      else if (temperature >= 25) calculatedScore += 8;

      // Humidity
      if (humidity <= 20) calculatedScore += 25;
      else if (humidity <= 35) calculatedScore += 20;
      else if (humidity <= 50) calculatedScore += 12;
      else calculatedScore += 5;

      // Wind
      if (windSpeed >= 35) calculatedScore += 20;
      else if (windSpeed >= 25) calculatedScore += 16;
      else if (windSpeed >= 15) calculatedScore += 10;
      else calculatedScore += 5;

      // Rainfall
      if (rainfall <= 2) calculatedScore += 15;
      else if (rainfall <= 10) calculatedScore += 10;
      else if (rainfall <= 25) calculatedScore += 5;

      // Dryness
      if (dryness >= 80) calculatedScore += 15;
      else if (dryness >= 60) calculatedScore += 12;
      else if (dryness >= 40) calculatedScore += 7;
      else calculatedScore += 3;

      calculatedScore = Math.min(calculatedScore, 100);

      let calculatedRisk: RiskLevel;

      if (calculatedScore >= 80) {
        calculatedRisk = "EXTREME";
      } else if (calculatedScore >= 60) {
        calculatedRisk = "HIGH";
      } else if (calculatedScore >= 35) {
        calculatedRisk = "MODERATE";
      } else {
        calculatedRisk = "LOW";
      }

      setScore(calculatedScore);
      setRisk(calculatedRisk);
      setLoading(false);
    }, 800);
  };

  const getRiskColor = () => {
    if (risk === "EXTREME") return "text-red-400";
    if (risk === "HIGH") return "text-orange-400";
    if (risk === "MODERATE") return "text-yellow-400";
    return "text-emerald-400";
  };

  const getRiskBackground = () => {
    if (risk === "EXTREME") return "bg-red-500/10 border-red-500/20";
    if (risk === "HIGH") return "bg-orange-500/10 border-orange-500/20";
    if (risk === "MODERATE") return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-emerald-500/10 border-emerald-500/20";
  };

  const getRiskMessage = () => {
    if (risk === "EXTREME") {
      return "Extreme fire conditions detected. Immediate preventive action is recommended.";
    }

    if (risk === "HIGH") {
      return "High fire probability detected. Monitor the area closely.";
    }

    if (risk === "MODERATE") {
      return "Moderate fire risk detected. Continue monitoring environmental conditions.";
    }

    return "Current environmental conditions indicate a relatively low fire risk.";
  };

  return (
    <section
      id="predictor"
      className="relative overflow-hidden bg-[#08150f] py-28 md:py-36"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute left-[-200px] top-[20%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">

        {/* Heading */}
        <div className="mb-14 max-w-3xl">
          <div className="mb-5 flex items-center gap-2 text-emerald-400">
            <Gauge size={18} />

            <span className="text-xs font-semibold uppercase tracking-[0.25em]">
              Fire Risk Intelligence
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            How likely is a
            <span className="text-emerald-400"> fire?</span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
            Enter environmental conditions for a location and estimate
            its wildfire risk using multiple weather and dryness factors.
          </p>
        </div>

        {/* Main dashboard */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

          {/* INPUT PANEL */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">

            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Environmental Conditions
                </h3>

                <p className="mt-1 text-sm text-white/40">
                  Enter current conditions
                </p>
              </div>

              <div className="rounded-xl bg-emerald-400/10 p-3">
                <Flame className="text-emerald-400" size={22} />
              </div>
            </div>

            {/* Temperature */}
            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                  <Thermometer size={17} className="text-orange-400" />
                  Temperature
                </label>

                <span className="text-sm font-semibold text-emerald-400">
                  {temperature}°C
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="50"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />

              <div className="mt-2 flex justify-between text-xs text-white/30">
                <span>0°C</span>
                <span>50°C</span>
              </div>
            </div>

            {/* Humidity */}
            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                  <Droplets size={17} className="text-blue-400" />
                  Humidity
                </label>

                <span className="text-sm font-semibold text-emerald-400">
                  {humidity}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />

              <div className="mt-2 flex justify-between text-xs text-white/30">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Wind */}
            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                  <Wind size={17} className="text-cyan-400" />
                  Wind Speed
                </label>

                <span className="text-sm font-semibold text-emerald-400">
                  {windSpeed} km/h
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="60"
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />

              <div className="mt-2 flex justify-between text-xs text-white/30">
                <span>0 km/h</span>
                <span>60 km/h</span>
              </div>
            </div>

            {/* Rainfall */}
            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                  <Droplets size={17} className="text-sky-400" />
                  Rainfall
                </label>

                <span className="text-sm font-semibold text-emerald-400">
                  {rainfall} mm
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />

              <div className="mt-2 flex justify-between text-xs text-white/30">
                <span>0 mm</span>
                <span>100 mm</span>
              </div>
            </div>

            {/* Dryness */}
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                  <Gauge size={17} className="text-yellow-400" />
                  Dryness Index
                </label>

                <span className="text-sm font-semibold text-emerald-400">
                  {dryness}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={dryness}
                onChange={(e) => setDryness(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />

              <div className="mt-2 flex justify-between text-xs text-white/30">
                <span>Low</span>
                <span>Extreme</span>
              </div>
            </div>

            {/* Date */}
            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
                  <CalendarDays size={16} className="text-purple-400" />
                  Month
                </label>

                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                >
                  <option>January</option>
                  <option>February</option>
                  <option>March</option>
                  <option>April</option>
                  <option>May</option>
                  <option>June</option>
                  <option>July</option>
                  <option>August</option>
                  <option>September</option>
                  <option>October</option>
                  <option>November</option>
                  <option>December</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Day
                </label>

                <input
                  type="number"
                  min="1"
                  max="31"
                  value={day}
                  onChange={(e) => setDay(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                />
              </div>

            </div>

            {/* Analyze button */}
            <button
              onClick={calculateRisk}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-4 font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing conditions...
                </>
              ) : (
                <>
                  Analyze Fire Risk
                  <Flame size={18} />
                </>
              )}
            </button>
          </div>

          {/* RESULT PANEL */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1d15] p-6 md:p-8">

            <div className="absolute right-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[100px]" />

            <div className="relative">

              <div className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                  Prediction Result
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Fire Risk Assessment
                </h3>
              </div>

              {!risk ? (
                <div className="flex min-h-[450px] flex-col items-center justify-center text-center">

                  <div className="mb-6 rounded-full border border-emerald-400/20 bg-emerald-400/10 p-7">
                    <Gauge
                      size={55}
                      strokeWidth={1.5}
                      className="text-emerald-400"
                    />
                  </div>

                  <h4 className="text-xl font-semibold text-white">
                    Ready to analyze
                  </h4>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/40">
                    Enter environmental conditions on the left and
                    run the analysis to calculate the estimated fire risk.
                  </p>

                </div>
              ) : (
                <div>

                  {/* Risk badge */}
                  <div
                    className={`rounded-2xl border p-5 ${getRiskBackground()}`}
                  >
                    <div className="flex items-center gap-3">

                      {risk === "LOW" ? (
                        <CheckCircle2 className={getRiskColor()} />
                      ) : (
                        <AlertTriangle className={getRiskColor()} />
                      )}

                      <div>
                        <p className="text-xs text-white/40">
                          Current risk level
                        </p>

                        <p
                          className={`text-3xl font-bold ${getRiskColor()}`}
                        >
                          {risk}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Score */}
                  <div className="mt-8">

                    <div className="mb-3 flex items-end justify-between">
                      <div>
                        <p className="text-sm text-white/40">
                          Risk Score
                        </p>

                        <p className="mt-1 text-5xl font-bold text-white">
                          {score}
                        </p>
                      </div>

                      <span className="text-sm text-white/30">
                        / 100
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          risk === "EXTREME"
                            ? "bg-red-500"
                            : risk === "HIGH"
                              ? "bg-orange-500"
                              : risk === "MODERATE"
                                ? "bg-yellow-400"
                                : "bg-emerald-400"
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>

                  </div>

                  {/* Message */}
                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm leading-6 text-white/60">
                      {getRiskMessage()}
                    </p>
                  </div>

                  {/* Conditions */}
                  <div className="mt-6 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-white/[0.03] p-4">
                      <p className="text-xs text-white/30">
                        Temperature
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {temperature}°C
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.03] p-4">
                      <p className="text-xs text-white/30">
                        Humidity
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {humidity}%
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.03] p-4">
                      <p className="text-xs text-white/30">
                        Wind
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {windSpeed} km/h
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.03] p-4">
                      <p className="text-xs text-white/30">
                        Dryness
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {dryness}
                      </p>
                    </div>

                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex gap-3 rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.03] p-5">
          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0 text-yellow-400"
          />

          <p className="text-xs leading-5 text-white/40">
            This prediction is an educational risk assessment and should
            not be used as a substitute for official emergency alerts,
            weather services, or professional wildfire monitoring.
          </p>
        </div>

      </div>
    </section>
  );
}