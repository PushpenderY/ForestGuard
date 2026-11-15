"use client";

import { useState } from "react";

type ModelResult = {
  prediction: number;
  label: "FIRE" | "NO FIRE";
  fire_probability: number;
  risk_level: "LOW" | "MODERATE" | "HIGH" | "EXTREME";
};

type Props = {
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  dryness: number;
  vegetationMoisture: number;
  month: string;
  day: number;
};

const MODEL_LABELS: Record<string, string> = {
  decision_tree: "Decision Tree",
  random_forest: "Random Forest",
  logistic_regression: "Logistic Regression",
};

const API_URL = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000";

export default function MLModelComparison(props: Props) {
  const [results, setResults] = useState<Record<string, ModelResult> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runModels() {
    setLoading(true);
    setError("");
    try {
      const monthNumber = new Date(`${props.month} 1, 2025`).getMonth() + 1;
      const date = new Date(2025, monthNumber - 1, props.day);
      const dayOfYear = Math.floor(
        (date.getTime() - new Date(2025, 0, 0).getTime()) / 86400000
      );

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: props.latitude,
          longitude: props.longitude,
          temperature_c: props.temperature,
          relative_humidity_pct: props.humidity,
          wind_speed_kmh: props.windSpeed,
          rainfall_mm: props.rainfall,
          drought_index: props.dryness / 100,
          vegetation_moisture_pct: props.vegetationMoisture,
          month: monthNumber,
          day_of_year: dayOfYear,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.detail || `Prediction API failed (${response.status})`);
      }

      const body = await response.json();
      setResults(body.models);
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message}. Make sure the ForestGuard ML API is running.`
          : "Could not connect to the ML prediction service."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10 rounded-3xl border border-emerald-400/15 bg-[#0b1d15] p-6 md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Machine Learning Lab
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            Compare ML predictions
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
            The same environmental input is sent to all three independently trained models.
            Your existing JavaScript rule-based prediction remains unchanged.
          </p>
        </div>
        <button
          type="button"
          onClick={runModels}
          disabled={loading}
          className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Running models..." : "Run all ML models"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </p>
      )}

      {results && (
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {Object.entries(results).map(([key, result]) => (
            <article key={key} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-sm font-medium text-white/55">
                {MODEL_LABELS[key] || key}
              </p>
              <p className={`mt-4 text-2xl font-bold ${result.prediction === 1 ? "text-orange-300" : "text-emerald-300"}`}>
                {result.label}
              </p>
              <p className="mt-1 text-sm text-white/45">
                {result.fire_probability.toFixed(2)}% estimated fire probability
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{ width: `${result.fire_probability}%` }}
                />
              </div>
              <p className="mt-4 text-xs uppercase tracking-wider text-white/35">
                Risk category: <span className="font-semibold text-white/75">{result.risk_level}</span>
              </p>
            </article>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs leading-5 text-white/35">
        Probabilities are uncalibrated model estimates from a synthetic educational dataset.
        They are not validated real-world wildfire probabilities or emergency alerts.
      </p>
    </section>
  );
}
