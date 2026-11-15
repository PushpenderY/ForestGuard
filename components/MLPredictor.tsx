
"use client";

import { useState } from "react";

interface PredictionResult {
  fire_probability: number;
  prediction: number;
  result: string;
}

interface APIResponse {
  status: string;
  predictions: {
    decision_tree: PredictionResult;
    random_forest: PredictionResult;
    logistic_regression: PredictionResult & {
      threshold: number;
    };
  };
}

const ML_API_URL = (
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000"
    : "/api"
).replace(/\/$/, "");

function ModelCard({ title, data }: { title: string; data: PredictionResult }) {
  return (
    <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-3xl font-bold">
        {(data.fire_probability * 100).toFixed(2)}%
      </p>
      <p className="text-sm text-gray-500">Estimated Fire Probability</p>
      <div className="mt-3">
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            data.prediction === 1
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {data.result}
        </span>
      </div>
    </div>
  );
}

export default function MLPredictor() {

  const [formData, setFormData] = useState({
    latitude: 28.1833,
    longitude: 75.8167,
    temperature_c: 38,
    relative_humidity_pct: 25,
    wind_speed_kmh: 30,
    rainfall_mm: 0,
    drought_index: 85,
    vegetation_moisture_pct: 15,
    month: 5,
    day_of_year: 125,
  });

  const [result, setResult] = useState<APIResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  async function handlePrediction() {

    setLoading(true);
    setError("");
    setResult(null);

    try {

      const response = await fetch(
        `${ML_API_URL}/predict`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...formData,
            drought_index: formData.drought_index / 100,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data: APIResponse = await response.json();

      setResult(data);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  }

  const fields = [
    { name: "latitude", label: "Latitude" },
    { name: "longitude", label: "Longitude" },
    { name: "temperature_c", label: "Temperature (°C)" },
    { name: "relative_humidity_pct", label: "Humidity (%)" },
    { name: "wind_speed_kmh", label: "Wind Speed (km/h)" },
    { name: "rainfall_mm", label: "Rainfall (mm)" },
    { name: "drought_index", label: "Drought Index" },
    { name: "vegetation_moisture_pct", label: "Vegetation Moisture (%)" },
    { name: "month", label: "Month (1-12)" },
    { name: "day_of_year", label: "Day of Year (1-366)" },
  ] as const;

  return (

    <section className="mx-auto max-w-6xl space-y-8 p-6">

      <div>

        <h2 className="text-3xl font-bold">
          ForestGuard ML Predictor
        </h2>

        <p className="mt-2 text-gray-500">
          Predict forest fire risk using three trained
          machine learning algorithms.
        </p>

      </div>


      {/* Environmental Inputs */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {fields.map((field) => (

          <div key={field.name}>

            <label className="mb-2 block text-sm font-medium">
              {field.label}
            </label>

            <input
              type="number"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />

          </div>

        ))}

      </div>


      {/* Predict Button */}

      <button
        onClick={handlePrediction}
        disabled={loading}
        className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
      >

        {loading ? "Predicting..." : "Predict Forest Fire"}

      </button>


      {/* Error */}

      {error && (

        <p className="text-red-600">
          {error}
        </p>

      )}


      {/* Prediction Results */}

      {result && (

        <div className="space-y-5">

          <h2 className="text-2xl font-bold">
            ML Prediction Results
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            <ModelCard
              title="Decision Tree"
              data={result.predictions.decision_tree}
            />

            <ModelCard
              title="Random Forest"
              data={result.predictions.random_forest}
            />

            <ModelCard
              title="Logistic Regression"
              data={result.predictions.logistic_regression}
            />

          </div>

        </div>

      )}

    </section>

  );

}
