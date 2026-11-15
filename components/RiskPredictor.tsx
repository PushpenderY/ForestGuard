
"use client";

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Flame,
  Gauge,
  Loader2,
  MapPin,
  Thermometer,
  Wind,
  Trees,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";

type FormData = {
  latitude: number;
  longitude: number;
  temperature_c: number;
  relative_humidity_pct: number;
  wind_speed_kmh: number;
  rainfall_mm: number;
  drought_index: number;
  vegetation_moisture_pct: number;
  month: number;
  day: number;
};

type ModelPrediction = {
  fire_probability: number;
  prediction: number;
  result: string;
  threshold?: number;
};

type ApiResponse = {
  status: string;
  predictions: {
    decision_tree: ModelPrediction;
    random_forest: ModelPrediction;
    logistic_regression: ModelPrediction;
  };
};

const ML_API_URL = (
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000"
    : "/api"
).replace(/\/$/, "");

type RuleResult = {
  score: number;
  risk: string;
  contributions: Record<string, number>;
};

type ModelCard = {
  name: string;
  description: string;
  href: string;
  prediction: string;
  probability: string;
  color: string;
};

const initialValues: FormData = {
  latitude: 28.1833,
  longitude: 75.8167,
  temperature_c: 32,
  relative_humidity_pct: 45,
  wind_speed_kmh: 18,
  rainfall_mm: 5,
  drought_index: 65,
  vegetation_moisture_pct: 35,
  month: 5,
  day: 18,
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDayOfYear(month: number, day: number) {
  // 2025 is used as a non-leap reference year.
  const date = new Date(Date.UTC(2025, month - 1, day));
  const start = new Date(Date.UTC(2025, 0, 0));

  return Math.floor(
    (date.getTime() - start.getTime()) / 86400000
  );
}

function calculateRuleBasedRisk(
  input: FormData
): RuleResult {
  const contributions: Record<string, number> = {};

  // Temperature contribution: maximum 20
  if (input.temperature_c >= 40) {
    contributions.temperature = 20;
  } else if (input.temperature_c >= 35) {
    contributions.temperature = 16;
  } else if (input.temperature_c >= 30) {
    contributions.temperature = 12;
  } else if (input.temperature_c >= 25) {
    contributions.temperature = 7;
  } else {
    contributions.temperature = 3;
  }

  // Humidity contribution: maximum 20
  if (input.relative_humidity_pct <= 20) {
    contributions.humidity = 20;
  } else if (input.relative_humidity_pct <= 35) {
    contributions.humidity = 16;
  } else if (input.relative_humidity_pct <= 50) {
    contributions.humidity = 12;
  } else if (input.relative_humidity_pct <= 70) {
    contributions.humidity = 7;
  } else {
    contributions.humidity = 3;
  }

  // Wind contribution: maximum 15
  if (input.wind_speed_kmh >= 35) {
    contributions.wind = 15;
  } else if (input.wind_speed_kmh >= 25) {
    contributions.wind = 12;
  } else if (input.wind_speed_kmh >= 15) {
    contributions.wind = 9;
  } else {
    contributions.wind = 4;
  }

  // Rainfall contribution: maximum 10
  if (input.rainfall_mm <= 2) {
    contributions.rainfall = 10;
  } else if (input.rainfall_mm <= 10) {
    contributions.rainfall = 7;
  } else if (input.rainfall_mm <= 25) {
    contributions.rainfall = 4;
  } else {
    contributions.rainfall = 1;
  }

  // Drought contribution: maximum 20
  if (input.drought_index >= 80) {
    contributions.drought = 20;
  } else if (input.drought_index >= 60) {
    contributions.drought = 16;
  } else if (input.drought_index >= 40) {
    contributions.drought = 11;
  } else {
    contributions.drought = 5;
  }

  // Vegetation moisture: lower moisture means higher risk.
  // Maximum contribution: 15
  if (input.vegetation_moisture_pct <= 15) {
    contributions.vegetation = 15;
  } else if (input.vegetation_moisture_pct <= 30) {
    contributions.vegetation = 12;
  } else if (input.vegetation_moisture_pct <= 50) {
    contributions.vegetation = 8;
  } else {
    contributions.vegetation = 3;
  }

  // Seasonal contribution: illustrative heuristic.
  if ([3, 4, 5, 6].includes(input.month)) {
    contributions.season = 5;
  } else {
    contributions.season = 2;
  }

  const score = Math.min(
    100,
    Object.values(contributions).reduce(
      (total, value) => total + value,
      0
    )
  );

  let risk = "LOW";

  if (score >= 80) {
    risk = "EXTREME";
  } else if (score >= 60) {
    risk = "HIGH";
  } else if (score >= 35) {
    risk = "MODERATE";
  }

  return { score, risk, contributions };
}

function getRiskColor(result: string) {
  return result === "Fire"
    ? "text-orange-400"
    : "text-emerald-400";
}

export default function RiskPredictor() {
  const [formData, setFormData] =
    useState<FormData>(initialValues);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [ruleResult, setRuleResult] =
    useState<RuleResult | null>(null);

  const [mlResults, setMlResults] =
    useState<ApiResponse["predictions"] | null>(null);

  const [modelLinks, setModelLinks] =
    useState<Record<string, string>>({});

  function updateField(
    field: keyof FormData,
    value: number
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function analyzeRisk() {
    setLoading(true);
    setError("");

    setRuleResult(null);
    setMlResults(null);
    setModelLinks({});

    try {
      const dayOfYear = getDayOfYear(
        formData.month,
        formData.day
      );

      const rule = calculateRuleBasedRisk(formData);

      const apiInput = {
        latitude: formData.latitude,
        longitude: formData.longitude,
        temperature_c: formData.temperature_c,
        relative_humidity_pct:
          formData.relative_humidity_pct,
        wind_speed_kmh: formData.wind_speed_kmh,
        rainfall_mm: formData.rainfall_mm,
        drought_index: formData.drought_index / 100,
        vegetation_moisture_pct:
          formData.vegetation_moisture_pct,
        month: formData.month,
        day_of_year: dayOfYear,
      };

      const response = await fetch(
        `${ML_API_URL}/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiInput),
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.detail || `Prediction API failed: ${response.status}`
        );
      }

      const data: ApiResponse = await response.json();

      setRuleResult(rule);
      setMlResults(data.predictions);

      // Pass the same input and predictions to individual pages.
      const params = new URLSearchParams();

      Object.entries(apiInput).forEach(([key, value]) => {
        params.set(key, String(value));
      });

      params.set("day", String(formData.day));

      params.set("rule_score", String(rule.score));
      params.set("rule_risk", rule.risk);
      params.set(
        "rule_contributions",
        JSON.stringify(rule.contributions)
      );

      Object.entries(data.predictions).forEach(
        ([modelName, prediction]) => {
          params.set(
            `${modelName}_probability`,
            String(prediction.fire_probability)
          );

          params.set(
            `${modelName}_prediction`,
            String(prediction.prediction)
          );

          if (prediction.threshold !== undefined) {
            params.set(
              `${modelName}_threshold`,
              String(prediction.threshold)
            );
          }
        }
      );

      const query = params.toString();

      setModelLinks({
        rule: `/models/rule-based?${query}`,
        decisionTree: `/models/decision-tree?${query}`,
        randomForest: `/models/random-forest?${query}`,
        logisticRegression: `/models/logistic-regression?${query}`,
      });
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? `${err.message} Check that the ML API is deployed and reachable from this phone.`
          : "Unable to reach the ForestGuard ML API. Check its public URL and deployment status."
      );
    } finally {
      setLoading(false);
    }
  }

  const modelCards: ModelCard[] = [
    {
      name: "Rule-Based Model",
      description:
        "Understand the scoring rules and risk calculation.",
      href: modelLinks.rule,
      prediction: ruleResult?.risk ?? "Not analyzed",
      probability: ruleResult
        ? `${ruleResult.score}/100 Risk Score`
        : "Run analysis first",
      color: "text-emerald-400",
    },
    {
      name: "Decision Tree",
      description:
        "Explore tree structure, splitting and feature importance.",
      href: modelLinks.decisionTree,
      prediction:
        mlResults?.decision_tree.result ?? "Not analyzed",
      probability: mlResults
        ? `${(
            mlResults.decision_tree.fire_probability * 100
          ).toFixed(2)}% Fire Probability`
        : "Run analysis first",
      color: mlResults
        ? getRiskColor(mlResults.decision_tree.result)
        : "text-white",
    },
    {
      name: "Random Forest",
      description:
        "Explore ensemble learning and feature importance.",
      href: modelLinks.randomForest,
      prediction:
        mlResults?.random_forest.result ?? "Not analyzed",
      probability: mlResults
        ? `${(
            mlResults.random_forest.fire_probability * 100
          ).toFixed(2)}% Fire Probability`
        : "Run analysis first",
      color: mlResults
        ? getRiskColor(mlResults.random_forest.result)
        : "text-white",
    },
    {
      name: "Logistic Regression",
      description:
        "Explore sigmoid function, coefficients and threshold.",
      href: modelLinks.logisticRegression,
      prediction:
        mlResults?.logistic_regression.result ??
        "Not analyzed",
      probability: mlResults
        ? `${(
            mlResults.logistic_regression.fire_probability *
            100
          ).toFixed(2)}% Fire Probability`
        : "Run analysis first",
      color: mlResults
        ? getRiskColor(
            mlResults.logistic_regression.result
          )
        : "text-white",
    },
  ];

  const isAnalyzed = Boolean(ruleResult && mlResults);

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
            Enter environmental conditions for a location
            and compare predictions from four different
            fire risk assessment approaches.
          </p>
        </div>

        {/* INPUT PANEL */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Environmental Conditions
              </h3>

              <p className="mt-1 text-sm text-white/40">
                The same input is used by all four models.
              </p>
            </div>

            <div className="rounded-xl bg-emerald-400/10 p-3">
              <Flame className="text-emerald-400" size={22} />
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h4 className="mb-5 flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <MapPin size={17} />
              Geographic Information
            </h4>

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  value={formData.latitude}
                  onChange={(e) =>
                    updateField("latitude", Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  value={formData.longitude}
                  onChange={(e) =>
                    updateField("longitude", Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                />
              </div>
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
                {formData.temperature_c}°C
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="50"
              value={formData.temperature_c}
              onChange={(e) =>
                updateField("temperature_c", Number(e.target.value))
              }
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
                Relative Humidity
              </label>

              <span className="text-sm font-semibold text-emerald-400">
                {formData.relative_humidity_pct}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={formData.relative_humidity_pct}
              onChange={(e) =>
                updateField(
                  "relative_humidity_pct",
                  Number(e.target.value)
                )
              }
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
                {formData.wind_speed_kmh} km/h
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="60"
              value={formData.wind_speed_kmh}
              onChange={(e) =>
                updateField("wind_speed_kmh", Number(e.target.value))
              }
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
                {formData.rainfall_mm} mm
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={formData.rainfall_mm}
              onChange={(e) =>
                updateField("rainfall_mm", Number(e.target.value))
              }
              className="w-full accent-emerald-400"
            />

            <div className="mt-2 flex justify-between text-xs text-white/30">
              <span>0 mm</span>
              <span>100 mm</span>
            </div>
          </div>

          {/* Drought */}
          <div className="mb-7">
            <div className="mb-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <Gauge size={17} className="text-yellow-400" />
                Drought Index
              </label>

              <span className="text-sm font-semibold text-emerald-400">
                {formData.drought_index}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={formData.drought_index}
              onChange={(e) =>
                updateField("drought_index", Number(e.target.value))
              }
              className="w-full accent-emerald-400"
            />

            <div className="mt-2 flex justify-between text-xs text-white/30">
              <span>Low</span>
              <span>Extreme</span>
            </div>
          </div>

          {/* Vegetation */}
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <Trees size={17} className="text-green-400" />
                Vegetation Moisture
              </label>

              <span className="text-sm font-semibold text-emerald-400">
                {formData.vegetation_moisture_pct}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={formData.vegetation_moisture_pct}
              onChange={(e) =>
                updateField(
                  "vegetation_moisture_pct",
                  Number(e.target.value)
                )
              }
              className="w-full accent-emerald-400"
            />

            <div className="mt-2 flex justify-between text-xs text-white/30">
              <span>Dry</span>
              <span>Moist</span>
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
                value={formData.month}
                onChange={(e) =>
                  updateField("month", Number(e.target.value))
                }
                className="w-full rounded-xl border border-white/10 bg-[#0b1d15] px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
              >
                {monthNames.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Day of Month
              </label>

              <input
                type="number"
                min="1"
                max="31"
                value={formData.day}
                onChange={(e) =>
                  updateField("day", Number(e.target.value))
                }
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-white/30">
            Day of Year is automatically calculated and sent
            to the ML models.
          </p>

          {/* Error */}
          {error && (
            <div className="mt-6 flex gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <AlertTriangle
                size={18}
                className="shrink-0 text-red-400"
              />

              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>
          )}

          {/* Analyze button */}
          <button
            onClick={analyzeRisk}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-4 font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing all models...
              </>
            ) : (
              <>
                Analyze Fire Risk
                <Flame size={18} />
              </>
            )}
          </button>

        </div>

        {/* MODEL OPTIONS */}
        <div className="mt-20">

          <div className="mb-10">
            <div className="mb-4 flex items-center gap-2 text-emerald-400">
              <Gauge size={18} />

              <span className="text-xs font-semibold uppercase tracking-[0.25em]">
                Model Intelligence
              </span>
            </div>

            <h3 className="text-3xl font-bold text-white md:text-4xl">
              Explore Prediction Models
            </h3>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/40">
              Compare four different approaches to wildfire
              risk assessment. Select a model to explore its
              theory, configuration, predictions and
              performance evaluation.
            </p>
          </div>

          {!isAnalyzed && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-white/50">
                <Gauge
                  size={17}
                  className="mr-2 inline text-emerald-400"
                />
                Run the analysis first to unlock model-specific
                prediction results.
              </p>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">

            {modelCards.map((model, index) => {
              const enabled = Boolean(model.href);

              return (
                <div
                  key={model.name}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.05] md:p-8"
                >

                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400/60">
                        MODEL 0{index + 1}
                      </span>

                      <h4 className="mt-2 text-xl font-semibold text-white">
                        {model.name}
                      </h4>
                    </div>

                    <div className="rounded-xl bg-emerald-400/10 p-3">
                      <Flame
                        size={22}
                        className="text-emerald-400"
                      />
                    </div>
                  </div>

                  <p className="mb-6 text-sm leading-6 text-white/40">
                    {model.description}
                  </p>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                    <p className="text-xs uppercase tracking-wider text-white/30">
                      Prediction Result
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className={`text-2xl font-bold ${model.color}`}>
                        {model.prediction}
                      </span>

                      {isAnalyzed && (
                        <CheckCircle2
                          size={20}
                          className="text-emerald-400"
                        />
                      )}
                    </div>

                    <p className="mt-2 text-sm text-white/40">
                      {model.probability}
                    </p>
                  </div>

                  <div className="mt-6">
                    {enabled ? (
                      <Link
                        href={model.href}
                        className="flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-5 py-4 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-400/10"
                      >
                        View Model Analysis

                        <ChevronRight
                          size={18}
                          className="transition group-hover:translate-x-1"
                        />
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-sm text-white/30">
                        Analyze to unlock

                        <ChevronRight size={18} />
                      </div>
                    )}
                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 flex gap-3 rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.03] p-5">
          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0 text-yellow-400"
          />

          <p className="text-xs leading-5 text-white/40">
            This system is an educational machine learning
            demonstration using a prepared dataset. Predictions
            should not be used as a substitute for official
            emergency alerts, weather services or professional
            wildfire monitoring.
          </p>
        </div>

      </div>
    </section>
  );
}
