
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Flame,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";

const factors = [
  {
    key: "temperature",
    label: "Temperature",
    description: "Higher temperatures increase environmental dryness.",
    max: 20,
    color: "bg-orange-400",
  },
  {
    key: "humidity",
    label: "Relative Humidity",
    description: "Lower humidity increases the contribution to fire risk.",
    max: 20,
    color: "bg-blue-400",
  },
  {
    key: "wind",
    label: "Wind Speed",
    description: "Strong winds can support faster fire spread.",
    max: 15,
    color: "bg-cyan-400",
  },
  {
    key: "rainfall",
    label: "Rainfall",
    description: "Lower rainfall contributes to dry environmental conditions.",
    max: 10,
    color: "bg-sky-400",
  },
  {
    key: "drought",
    label: "Drought Index",
    description: "Higher drought index contributes to greater dryness.",
    max: 20,
    color: "bg-yellow-400",
  },
  {
    key: "vegetation",
    label: "Vegetation Moisture",
    description: "Lower vegetation moisture contributes to higher risk.",
    max: 15,
    color: "bg-green-400",
  },
  {
    key: "season",
    label: "Seasonal Contribution",
    description: "A predefined seasonal adjustment based on the selected month.",
    max: 5,
    color: "bg-purple-400",
  },
];

const inputFields = [
  { key: "latitude", label: "Latitude", unit: "°" },
  { key: "longitude", label: "Longitude", unit: "°" },
  { key: "temperature_c", label: "Temperature", unit: "°C" },
  { key: "relative_humidity_pct", label: "Humidity", unit: "%" },
  { key: "wind_speed_kmh", label: "Wind Speed", unit: "km/h" },
  { key: "rainfall_mm", label: "Rainfall", unit: "mm" },
  { key: "drought_index", label: "Drought Index", unit: "" },
  {
    key: "vegetation_moisture_pct",
    label: "Vegetation Moisture",
    unit: "%",
  },
  { key: "month", label: "Month", unit: "" },
  { key: "day_of_year", label: "Day of Year", unit: "" },
];

function getRiskColor(risk: string) {
  switch (risk) {
    case "EXTREME":
      return "text-red-400";
    case "HIGH":
      return "text-orange-400";
    case "MODERATE":
      return "text-yellow-400";
    default:
      return "text-emerald-400";
  }
}

function getRiskBackground(risk: string) {
  switch (risk) {
    case "EXTREME":
      return "border-red-500/20 bg-red-500/10";
    case "HIGH":
      return "border-orange-500/20 bg-orange-500/10";
    case "MODERATE":
      return "border-yellow-500/20 bg-yellow-500/10";
    default:
      return "border-emerald-500/20 bg-emerald-500/10";
  }
}

function RuleBasedPageContent() {
  const params = useSearchParams();

  const score = Number(params.get("rule_score") ?? 0);
  const risk = params.get("rule_risk") ?? "LOW";

  const rawContributions = params.get("rule_contributions");

  let contributions: Record<string, number> = {};

  try {
    contributions = rawContributions
      ? JSON.parse(rawContributions)
      : {};
  } catch {
    contributions = {};
  }

  const hasResult = params.has("rule_score");

  const monthNumber = Number(params.get("month") ?? 1);

  const monthName = new Date(
    Date.UTC(2025, monthNumber - 1, 1)
  ).toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });

  const values: Record<string, string> = {
    latitude: params.get("latitude") ?? "—",
    longitude: params.get("longitude") ?? "—",
    temperature_c: params.get("temperature_c") ?? "—",
    relative_humidity_pct:
      params.get("relative_humidity_pct") ?? "—",
    wind_speed_kmh: params.get("wind_speed_kmh") ?? "—",
    rainfall_mm: params.get("rainfall_mm") ?? "—",
    drought_index: params.get("drought_index") ?? "—",
    vegetation_moisture_pct:
      params.get("vegetation_moisture_pct") ?? "—",
    month: monthName,
    day_of_year: params.get("day_of_year") ?? "—",
  };

  const riskMessage: Record<string, string> = {
    LOW: "Environmental conditions currently indicate a relatively low risk score.",
    MODERATE: "Environmental conditions indicate a moderate risk score. Continue monitoring conditions.",
    HIGH: "Several environmental factors are contributing to an elevated risk score.",
    EXTREME: "The rule-based system has calculated a very high risk score. Immediate monitoring is recommended.",
  };

  return (
    <main className="min-h-screen bg-[#08150f] py-16 text-white md:py-24">

      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* Back navigation */}
        <Link
          href="/#predictor"
          className="mb-10 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-emerald-400"
        >
          <ArrowLeft size={17} />
          Back to Fire Risk Predictor
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="mb-5 flex items-center gap-2 text-emerald-400">
            <Gauge size={19} />
            <span className="text-xs font-semibold uppercase tracking-[0.25em]">
              Model Analysis
            </span>
          </div>

          <h1 className="text-4xl font-bold md:text-6xl">
            Rule-Based
            <span className="text-emerald-400"> Model</span>
          </h1>

          <p className="mt-5 max-w-3xl leading-7 text-white/50">
            A manually designed scoring system that evaluates
            environmental conditions using predefined rules
            and thresholds to estimate wildfire risk.
          </p>
        </div>

        {!hasResult && (
          <div className="mb-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">
            <p className="text-sm text-yellow-300">
              No prediction result found. Return to the main
              predictor and run an analysis first.
            </p>
          </div>
        )}

        {/* Prediction summary */}
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_1fr]">

          <div className="rounded-3xl border border-white/10 bg-[#0b1d15] p-7 md:p-9">

            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Current Prediction
            </p>

            <div
              className={`mt-6 rounded-2xl border p-6 ${getRiskBackground(risk)}`}
            >
              <div className="flex items-center gap-3">
                {risk === "LOW" ? (
                  <CheckCircle2
                    size={26}
                    className={getRiskColor(risk)}
                  />
                ) : (
                  <AlertTriangle
                    size={26}
                    className={getRiskColor(risk)}
                  />
                )}

                <div>
                  <p className="text-sm text-white/40">
                    Calculated Risk Level
                  </p>

                  <h2
                    className={`mt-1 text-3xl font-bold ${getRiskColor(risk)}`}
                  >
                    {risk}
                  </h2>
                </div>
              </div>
            </div>

            <div className="mt-9">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-white/40">
                    Total Risk Score
                  </p>

                  <p className="mt-2 text-6xl font-bold">
                    {score}
                  </p>
                </div>

                <span className="pb-2 text-sm text-white/40">
                  / 100
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    risk === "EXTREME"
                      ? "bg-red-500"
                      : risk === "HIGH"
                        ? "bg-orange-500"
                        : risk === "MODERATE"
                          ? "bg-yellow-400"
                          : "bg-emerald-400"
                  }`}
                  style={{
                    width: `${Math.max(0, Math.min(score, 100))}%`,
                  }}
                />
              </div>
            </div>

            <p className="mt-7 text-sm leading-7 text-white/50">
              {riskMessage[risk] ?? riskMessage.LOW}
            </p>

            <p className="mt-4 text-xs text-white/30">
              This is a rule-based risk score, not a calibrated
              fire probability.
            </p>
          </div>

          {/* Model details */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-9">

            <div className="mb-7 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-400/10 p-3">
                <Flame
                  size={23}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Model Overview
                </h3>
                <p className="text-sm text-white/40">
                  Rule-based classification
                </p>
              </div>
            </div>

            <div className="space-y-5">

              {[
                ["Model Type", "Heuristic / Rule-Based"],
                ["Learning Method", "Predefined conditions"],
                ["Training Required", "No"],
                ["Input Features", "10"],
                ["Output", "Risk Score (0–100)"],
                ["Classification", "4 Risk Categories"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-white/5 pb-4"
                >
                  <span className="text-sm text-white/40">
                    {label}
                  </span>

                  <span className="text-right text-sm font-medium text-white">
                    {value}
                  </span>
                </div>
              ))}

            </div>

          </div>
        </section>

        {/* Contribution graph */}
        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-9">

          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Explainability
            </p>

            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              Environmental Factor Contributions
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Each factor contributes a predefined number of
              points according to the selected input conditions.
            </p>
          </div>

          <div className="space-y-7">

            {factors.map((factor) => {
              const contribution =
                contributions[factor.key] ?? 0;

              const percentage =
                (contribution / factor.max) * 100;

              return (
                <div key={factor.key}>

                  <div className="mb-3 flex items-center justify-between gap-4">

                    <div>
                      <p className="font-medium text-white">
                        {factor.label}
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        {factor.description}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-emerald-400">
                      +{contribution} / {factor.max}
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${factor.color}`}
                      style={{
                        width: `${Math.min(100, percentage)}%`,
                      }}
                    />
                  </div>

                </div>
              );
            })}

          </div>

          <div className="mt-9 flex items-center justify-between border-t border-white/10 pt-6">
            <span className="text-sm text-white/50">
              Total Contribution
            </span>

            <span className="text-xl font-bold text-emerald-400">
              {Object.values(contributions).reduce(
                (total, value) => total + value,
                0
              )} / 100
            </span>
          </div>

        </section>

        {/* Formula and thresholds */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

            <h3 className="text-xl font-semibold">
              Risk Calculation Formula
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/45">
              The model adds the contribution of each
              environmental factor to calculate a final score.
            </p>

            <div className="mt-6 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-5">

              <p className="text-center text-sm font-semibold leading-8 text-emerald-300">
                Risk Score = Σ Factor Contributions
              </p>

              <p className="mt-3 text-center text-xs text-white/40">
                Final score is capped at 100.
              </p>

            </div>

            <p className="mt-5 text-sm leading-7 text-white/40">
              Every factor uses predefined threshold conditions.
              The model does not learn these thresholds from
              historical training data.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

            <h3 className="text-xl font-semibold">
              Risk Classification Thresholds
            </h3>

            <div className="mt-6 space-y-4">

              {[
                {
                  name: "LOW",
                  range: "0 – 34",
                  color: "bg-emerald-400",
                  text: "text-emerald-400",
                },
                {
                  name: "MODERATE",
                  range: "35 – 59",
                  color: "bg-yellow-400",
                  text: "text-yellow-400",
                },
                {
                  name: "HIGH",
                  range: "60 – 79",
                  color: "bg-orange-400",
                  text: "text-orange-400",
                },
                {
                  name: "EXTREME",
                  range: "80 – 100",
                  color: "bg-red-400",
                  text: "text-red-400",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl bg-black/20 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${item.color}`}
                    />

                    <span className={`text-sm font-semibold ${item.text}`}>
                      {item.name}
                    </span>
                  </div>

                  <span className="text-sm text-white/50">
                    {item.range}
                  </span>
                </div>
              ))}

            </div>

          </div>

        </section>

        {/* Input conditions */}
        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-9">

          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Input Data
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Environmental Conditions Used
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {inputFields.map((field) => (
              <div
                key={field.key}
                className="rounded-xl border border-white/5 bg-black/20 p-5"
              >
                <p className="text-xs text-white/40">
                  {field.label}
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {values[field.key]} {field.unit}
                </p>
              </div>
            ))}

          </div>

        </section>

        {/* Theory */}
        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-9">

          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-purple-400/10 p-3">
              <Info
                size={22}
                className="text-purple-400"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-400">
                Machine Learning Concepts
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                How Does This Model Work?
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <h3 className="font-semibold text-white">
                1. Rule Evaluation
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/45">
                The model checks environmental values against
                predefined thresholds. For example, a temperature
                of 40°C or above receives 20 points.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                2. Score Aggregation
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/45">
                Contributions from individual factors are added
                together to produce the final risk score.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                3. Classification
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/45">
                The final score is mapped to one of four
                predefined categories: Low, Moderate, High
                or Extreme.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                4. Explainability
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/45">
                Since each rule is explicitly defined, the
                contribution of every factor can be inspected
                and explained.
              </p>
            </div>

          </div>

        </section>

        {/* Limitations */}
        <section className="mb-10 rounded-3xl border border-yellow-400/10 bg-yellow-400/[0.03] p-7">

          <div className="flex items-center gap-3">
            <AlertTriangle
              size={21}
              className="text-yellow-400"
            />

            <h3 className="font-semibold text-yellow-300">
              Model Limitations
            </h3>
          </div>

          <ul className="mt-5 space-y-3 text-sm leading-6 text-white/45">
            <li>
              • This is a manually designed heuristic, not a
              statistically trained machine learning model.
            </li>

            <li>
              • Its thresholds and weights are predefined and
              may not represent real-world wildfire behaviour.
            </li>

            <li>
              • Latitude and longitude are collected but do not
              currently contribute to the scoring formula.
            </li>

            <li>
              • Accuracy, Precision, Recall and ROC-AUC are not
              reported for this rule-based implementation because
              we have not evaluated it against the labelled test set.
            </li>
          </ul>

        </section>

        <Link
          href="/#predictor"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-4 font-semibold text-black transition hover:bg-emerald-300"
        >
          <ArrowLeft size={18} />
          Back to Predictor
        </Link>

      </div>
    </main>
  );
}

export default function RuleBasedPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#07140e]" />}>
      <RuleBasedPageContent />
    </Suspense>
  );
}
