
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  ClipboardList,
  Database,
  Flame,
  Gauge,
  Info,
  Leaf,
  Loader2,
  MapPin,
  ShieldAlert,
  Target,
  Thermometer,
  Wind,
  Droplets,
  CalendarDays,
  TreePine,
  Activity,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface Analysis {
  model_name: string;
  threshold: number;
  confusion_matrix: number[][];
  roc_curve: {
    fpr: number[];
    tpr: number[];
    thresholds: (number | null)[];
    auc: number;
  };
  precision_recall_curve: {
    precision: number[];
    recall: number[];
    thresholds: number[];
    average_precision: number;
  };
  classification_report: {
    "0": {
      precision: number;
      recall: number;
      "f1-score": number;
      support: number;
    };
    "1": {
      precision: number;
      recall: number;
      "f1-score": number;
      support: number;
    };
    accuracy: number;
  };
  feature_importance: Record<string, number>;
  dataset: {
    total_records: number;
    training_records: number;
    validation_records: number;
    testing_records: number;
    training_fire_cases: number;
    testing_fire_cases: number;
    training_no_fire_cases: number;
    testing_no_fire_cases: number;
  };
}

interface Environment {
  latitude: string | null;
  longitude: string | null;
  temperature_c: string | null;
  relative_humidity_pct: string | null;
  wind_speed_kmh: string | null;
  rainfall_mm: string | null;
  drought_index: string | null;
  vegetation_moisture_pct: string | null;
  month: string | null;
  day: string | null;
}

const API_URL = (process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000" : "/api").replace(/\/$/, "");

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

// ============================================
// REUSABLE UI COMPONENTS
// ============================================

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "emerald",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  color?: "emerald" | "blue" | "amber" | "purple" | "rose";
}) {
  const colors = {
    emerald: "text-emerald-400 bg-emerald-400/10",
    blue: "text-blue-400 bg-blue-400/10",
    amber: "text-amber-400 bg-amber-400/10",
    purple: "text-purple-400 bg-purple-400/10",
    rose: "text-rose-400 bg-rose-400/10",
  };

  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-[#0d2018] p-5 transition hover:-translate-y-1 hover:border-emerald-400/30">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className={`rounded-xl p-2.5 ${colors[color]}`}>
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 p-4">
      <div className="rounded-lg bg-emerald-400/10 p-2.5 text-emerald-400">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function FormulaCard({
  title,
  formula,
  calculation,
  result,
  explanation,
}: {
  title: string;
  formula: string;
  calculation: string;
  result: string;
  explanation: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0b1c14] p-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm text-emerald-400">{result}</p>
        </div>
        {expanded ? (
          <ChevronUp className="text-slate-500" size={18} />
        ) : (
          <ChevronDown className="text-slate-500" size={18} />
        )}
      </button>

      {expanded && (
        <div className="mt-5 space-y-4 border-t border-white/[0.08] pt-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Formula
            </p>
            <div className="rounded-lg bg-black/30 p-3 font-mono text-sm text-emerald-300">
              {formula}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Actual calculation
            </p>
            <div className="rounded-lg bg-black/30 p-3 font-mono text-sm text-slate-300">
              {calculation}
            </div>
          </div>

          <p className="text-sm leading-6 text-slate-400">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// CHART COMPONENT
// ============================================

function LineChart({
  title,
  subtitle,
  xValues,
  yValues,
  xLabel,
  yLabel,
  referenceDiagonal = false,
  fillArea = false,
}: {
  title: string;
  subtitle: string;
  xValues: number[];
  yValues: number[];
  xLabel: string;
  yLabel: string;
  referenceDiagonal?: boolean;
  fillArea?: boolean;
}) {
  const width = 600;
  const height = 340;
  const left = 58;
  const right = 25;
  const top = 25;
  const bottom = 55;

  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const validPoints = xValues
    .map((x, i) => ({
      x,
      y: yValues[i],
    }))
    .filter(
      (point) =>
        Number.isFinite(point.x) &&
        Number.isFinite(point.y)
    );

  const coordinates = validPoints.map((point) => ({
    x: left + point.x * plotWidth,
    y: top + (1 - point.y) * plotHeight,
  }));

  const linePoints = coordinates
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const areaPoints = [
    `${left},${top + plotHeight}`,
    ...coordinates.map((point) => `${point.x},${point.y}`),
    `${left + plotWidth},${top + plotHeight}`,
  ].join(" ");

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d2018] p-5 md:p-6">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {subtitle}
        </p>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          role="img"
          aria-label={title}
        >
          {/* Grid and tick labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = top + (1 - tick) * plotHeight;
            const x = left + tick * plotWidth;

            return (
              <g key={tick}>
                <line
                  x1={left}
                  y1={y}
                  x2={left + plotWidth}
                  y2={y}
                  stroke="#263b30"
                  strokeDasharray="4 5"
                />

                <line
                  x1={x}
                  y1={top}
                  x2={x}
                  y2={top + plotHeight}
                  stroke="#263b30"
                  strokeDasharray="4 5"
                />

                <text
                  x={left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#84978b"
                  fontSize="11"
                >
                  {tick.toFixed(2)}
                </text>

                <text
                  x={x}
                  y={top + plotHeight + 20}
                  textAnchor="middle"
                  fill="#84978b"
                  fontSize="11"
                >
                  {tick.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* ROC reference diagonal */}
          {referenceDiagonal && (
            <line
              x1={left}
              y1={top + plotHeight}
              x2={left + plotWidth}
              y2={top}
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="7 6"
            />
          )}

          {/* Area under plotted line */}
          {fillArea && (
            <polygon
              points={areaPoints}
              fill="#10b981"
              opacity="0.09"
            />
          )}

          {/* Main curve */}
          <polyline
            points={linePoints}
            fill="none"
            stroke="#34d399"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Axis borders */}
          <line
            x1={left}
            y1={top}
            x2={left}
            y2={top + plotHeight}
            stroke="#64748b"
          />

          <line
            x1={left}
            y1={top + plotHeight}
            x2={left + plotWidth}
            y2={top + plotHeight}
            stroke="#64748b"
          />

          {/* Axis labels */}
          <text
            x={left + plotWidth / 2}
            y={height - 8}
            fill="#a3b3a9"
            fontSize="12"
            textAnchor="middle"
          >
            {xLabel}
          </text>

          <text
            x="15"
            y={top + plotHeight / 2}
            fill="#a3b3a9"
            fontSize="12"
            textAnchor="middle"
            transform={`rotate(-90 15 ${top + plotHeight / 2})`}
          >
            {yLabel}
          </text>
        </svg>
      </div>

      {referenceDiagonal && (
        <div className="mt-3 flex items-center gap-5 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-emerald-400" />
            Model ROC
          </span>
          <span className="flex items-center gap-2">
            <span className="w-5 border-t border-dashed border-slate-500" />
            Random classifier
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

function DecisionTreeDashboard() {
  const searchParams = useSearchParams();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Read live prediction and environmental inputs
  const live = useMemo(() => {
    const probability = Number(
      searchParams.get("decision_tree_probability")
    );

    const prediction = Number(
      searchParams.get("decision_tree_prediction")
    );

    const threshold = Number(
      searchParams.get("decision_tree_threshold") ?? "0.5"
    );

    return {
      probability,
      prediction,
      threshold,
      available:
        searchParams.has("decision_tree_probability") &&
        searchParams.has("decision_tree_prediction") &&
        Number.isFinite(probability) &&
        Number.isFinite(prediction),
    };
  }, [searchParams]);

  const environment: Environment = {
    latitude: searchParams.get("latitude"),
    longitude: searchParams.get("longitude"),
    temperature_c: searchParams.get("temperature_c"),
    relative_humidity_pct: searchParams.get("relative_humidity_pct"),
    wind_speed_kmh: searchParams.get("wind_speed_kmh"),
    rainfall_mm: searchParams.get("rainfall_mm"),
    drought_index: searchParams.get("drought_index"),
    vegetation_moisture_pct: searchParams.get("vegetation_moisture_pct"),
    month: searchParams.get("month"),
    day: searchParams.get("day"),
  };

  // Fetch model analysis from FastAPI
  useEffect(() => {
    async function loadAnalysis() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/models/decision-tree/analysis`
        );

        if (!response.ok) {
          throw new Error(
            `Analysis API returned ${response.status}`
          );
        }

        const result = await response.json();

        if (result.status !== "success" || !result.analysis) {
          throw new Error("Decision Tree analysis data is unavailable.");
        }

        setAnalysis(result.analysis);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load model analysis. Please make sure the Python ML API is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, []);

  // Loading state
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07140e] px-6 text-white">
        <div className="text-center">
          <Loader2
            className="mx-auto mb-4 animate-spin text-emerald-400"
            size={36}
          />
          <h2 className="text-xl font-semibold">
            Loading Decision Tree Analysis
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Fetching model evaluation data...
          </p>
        </div>
      </main>
    );
  }

  // API error state
  if (error || !analysis) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07140e] px-6 text-white">
        <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <CircleAlert className="mx-auto mb-4 text-red-400" size={36} />
          <h2 className="text-xl font-bold">Analysis unavailable</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {error || "Unable to load analysis data."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-black"
          >
            Retry
          </button>
          <Link
            href="/#predictor"
            className="mt-4 block text-sm text-emerald-400"
          >
            Back to Predictor
          </Link>
        </div>
      </main>
    );
  }

  // ============================================
  // METRIC CALCULATIONS
  // ============================================

  const matrix = analysis.confusion_matrix;

  const tn = matrix[0][0];
  const fp = matrix[0][1];
  const fn = matrix[1][0];
  const tp = matrix[1][1];

  const total = tn + fp + fn + tp;

  const accuracy = (tp + tn) / total;
  const precision = tp / (tp + fp);
  const recall = tp / (tp + fn);
  const specificity = tn / (tn + fp);
  const f1 =
    (2 * precision * recall) / (precision + recall);

  const falsePositiveRate = fp / (fp + tn);
  const falseNegativeRate = fn / (fn + tp);

  const formatPercent = (value: number) =>
    `${(value * 100).toFixed(2)}%`;

  // ============================================
  // LIVE RESULT COLOR
  // ============================================

  const probability = live.probability;
  const isFire = live.prediction === 1;

  // These probability bands are display categories,
  // not additional thresholds learned by the model.
  const riskBand =
    !live.available
      ? "Unavailable"
      : probability >= 0.6
        ? "High"
        : probability >= 0.3
          ? "Moderate"
          : "Low";

  const riskStyles =
    riskBand === "High"
      ? {
          text: "text-red-400",
          background: "bg-red-500/10",
          border: "border-red-500/30",
          bar: "bg-red-500",
          icon: "text-red-400",
        }
      : riskBand === "Moderate"
        ? {
            text: "text-amber-400",
            background: "bg-amber-500/10",
            border: "border-amber-500/30",
            bar: "bg-amber-400",
            icon: "text-amber-400",
          }
        : {
            text: "text-emerald-400",
            background: "bg-emerald-500/10",
            border: "border-emerald-500/30",
            bar: "bg-emerald-500",
            icon: "text-emerald-400",
          };

  const features = Object.entries(analysis.feature_importance)
    .sort((a, b) => b[1] - a[1]);

  const dataset = analysis.dataset;

  const hasEnvironment = Object.values(environment).some(
    (value) => value !== null
  );

  const environmentItems = [
    {
      label: "Latitude",
      value: environment.latitude
        ? `${environment.latitude}°`
        : "Not supplied",
      icon: MapPin,
    },
    {
      label: "Longitude",
      value: environment.longitude
        ? `${environment.longitude}°`
        : "Not supplied",
      icon: MapPin,
    },
    {
      label: "Temperature",
      value: environment.temperature_c
        ? `${environment.temperature_c} °C`
        : "Not supplied",
      icon: Thermometer,
    },
    {
      label: "Relative Humidity",
      value: environment.relative_humidity_pct
        ? `${environment.relative_humidity_pct}%`
        : "Not supplied",
      icon: Droplets,
    },
    {
      label: "Wind Speed",
      value: environment.wind_speed_kmh
        ? `${environment.wind_speed_kmh} km/h`
        : "Not supplied",
      icon: Wind,
    },
    {
      label: "Rainfall",
      value: environment.rainfall_mm
        ? `${environment.rainfall_mm} mm`
        : "Not supplied",
      icon: Droplets,
    },
    {
      label: "Drought Index",
      value: environment.drought_index ?? "Not supplied",
      icon: Gauge,
    },
    {
      label: "Vegetation Moisture",
      value: environment.vegetation_moisture_pct
        ? `${environment.vegetation_moisture_pct}%`
        : "Not supplied",
      icon: Leaf,
    },
    {
      label: "Month",
      value: environment.month
        ? MONTHS[Number(environment.month) - 1] ?? "Unknown"
        : "Not supplied",
      icon: CalendarDays,
    },
    {
      label: "Day",
      value: environment.day ?? "Not supplied",
      icon: CalendarDays,
    },
  ];

  // ============================================
  // RENDER
  // ============================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07140e] text-white">

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-emerald-500/[0.07] blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 top-[900px] h-96 w-96 rounded-full bg-green-500/[0.05] blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 md:px-10">

        {/* ================================= */}
        {/* TOP NAVIGATION */}
        {/* ================================= */}

        <header className="flex items-center justify-between border-b border-white/[0.08] py-6">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="rounded-xl bg-emerald-400/10 p-2.5 text-emerald-400">
              <TreePine size={25} />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">
                Forest<span className="text-emerald-400">Guard</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                Environmental Intelligence
              </p>
            </div>
          </Link>

          <Link
            href="/#predictor"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-400"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Predictor</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </header>

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 py-6 text-xs text-slate-500">
          <Link href="/" className="transition hover:text-emerald-400">
            ForestGuard
          </Link>
          <span>/</span>
          <span>Machine Learning</span>
          <span>/</span>
          <span className="text-emerald-400">Decision Tree</span>
        </div>

        {/* ================================= */}
        {/* HERO */}
        {/* ================================= */}

        <section className="mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
              MODEL 02
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400">
              Supervised Learning
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400">
              Classification
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
            Decision Tree
            <span className="block text-emerald-400">
              Model Analysis
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Explore the model&apos;s prediction, understand its
            classification performance, inspect its evaluation
            curves and discover which environmental features
            influence its decisions.
          </p>
        </section>

        {/* ================================= */}
        {/* LIVE PREDICTION */}
        {/* ================================= */}

        <section className="mb-16">
          <SectionHeading
            eyebrow="01 / Live inference"
            title="Your Prediction Result"
            description="Prediction generated using the environmental inputs submitted through the ForestGuard predictor."
          />

          <div
            className={`overflow-hidden rounded-3xl border ${live.available ? riskStyles.border : "border-white/10"} ${live.available ? riskStyles.background : "bg-[#0d2018]"}`}
          >
            <div className="grid lg:grid-cols-[1.25fr_0.75fr]">

              <div className="p-6 md:p-9">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  <Activity size={15} />
                  Decision Tree Classification
                </div>

                {live.available ? (
                  <>
                    <div className="mt-7 flex flex-wrap items-center gap-4">
                      <div className={`rounded-2xl p-4 ${riskStyles.background}`}>
                        {isFire ? (
                          <Flame size={36} className={riskStyles.icon} />
                        ) : (
                          <ShieldAlert size={36} className={riskStyles.icon} />
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                          Model prediction
                        </p>
                        <h3 className={`mt-1 text-3xl font-black md:text-4xl ${riskStyles.text}`}>
                          {isFire ? "Fire Detected" : "No Fire Detected"}
                        </h3>
                        <p className={`mt-2 text-sm font-semibold ${riskStyles.text}`}>
                          {riskBand} probability band
                        </p>
                      </div>
                    </div>

                    <div className="mt-9">
                      <div className="mb-3 flex items-end justify-between">
                        <div>
                          <p className="text-sm text-slate-400">
                            Fire probability
                          </p>
                          <p className="mt-1 text-4xl font-black text-white">
                            {formatPercent(probability)}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500">
                          Threshold: {(live.threshold * 100).toFixed(0)}%
                        </p>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-black/40">
                        <div
                          className={`h-full rounded-full transition-all ${riskStyles.bar}`}
                          style={{
                            width: `${Math.min(100, Math.max(0, probability * 100))}%`,
                          }}
                        />
                      </div>

                      <div className="mt-3 flex justify-between text-[11px] text-slate-500">
                        <span>0% — No fire probability</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="mt-7 rounded-xl border border-white/[0.08] bg-black/20 p-4">
                      <div className="flex items-start gap-3">
                        <Info className="mt-0.5 shrink-0 text-slate-400" size={17} />
                        <p className="text-xs leading-6 text-slate-400">
                          The model predicts Fire when its probability
                          reaches or exceeds the configured classification
                          threshold. The Low, Moderate and High bands are
                          additional display categories, not separate
                          model-trained classes or validated emergency levels.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
                    <CircleAlert className="mb-3 text-amber-400" size={28} />
                    <h3 className="text-xl font-bold text-amber-300">
                      No live prediction available
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      Open the predictor, enter environmental conditions
                      and click Analyze Fire Risk. Then open Decision Tree
                      analysis from the results.
                    </p>
                    <Link
                      href="/#predictor"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
                    >
                      Go to Predictor
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                )}
              </div>

              <div className="border-t border-white/[0.08] bg-black/15 p-6 md:p-9 lg:border-l lg:border-t-0">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Prediction details
                </p>

                <div className="mt-6 space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-400">Model</span>
                    <span className="text-sm font-semibold text-white">
                      Decision Tree
                    </span>
                  </div>

                  <div className="h-px bg-white/[0.07]" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-400">Class output</span>
                    <span className="text-sm font-semibold text-white">
                      {live.available
                        ? isFire
                          ? "1 — Fire"
                          : "0 — No Fire"
                        : "Unavailable"}
                    </span>
                  </div>

                  <div className="h-px bg-white/[0.07]" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-400">Threshold</span>
                    <span className="text-sm font-semibold text-white">
                      {live.available
                        ? live.threshold.toFixed(2)
                        : "—"}
                    </span>
                  </div>

                  <div className="h-px bg-white/[0.07]" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-400">Dataset</span>
                    <span className="text-sm font-semibold text-white">
                      Synthetic demo data
                    </span>
                  </div>

                  <div className="h-px bg-white/[0.07]" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-400">Evaluation records</span>
                    <span className="text-sm font-semibold text-white">
                      {dataset.testing_records}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================================= */}
        {/* ENVIRONMENT INPUTS */}
        {/* ================================= */}

        <section className="mb-16">
          <SectionHeading
            eyebrow="02 / Input context"
            title="Environmental Conditions"
            description="The input values passed from your main predictor to this model's analysis page."
          />

          {hasEnvironment ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {environmentItems.map((item) => (
                <InfoCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-white/10 bg-[#0d2018] p-5 text-sm text-slate-400">
              No environmental input parameters were supplied.
            </p>
          )}
        </section>

        {/* ================================= */}
        {/* PERFORMANCE METRICS */}
        {/* ================================= */}

        <section className="mb-16">
          <SectionHeading
            eyebrow="03 / Model evaluation"
            title="Performance Overview"
            description={`Metrics calculated from the held-out test set of ${total} records. These are evaluation results, not your individual live prediction.`}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <MetricCard
              title="Accuracy"
              value={formatPercent(accuracy)}
              subtitle="Overall correct predictions"
              icon={Target}
              color="emerald"
            />
            <MetricCard
              title="Precision"
              value={formatPercent(precision)}
              subtitle="Correct among predicted fire cases"
              icon={CheckCircle2}
              color="blue"
            />
            <MetricCard
              title="Recall"
              value={formatPercent(recall)}
              subtitle="Actual fire cases detected"
              icon={Activity}
              color="amber"
            />
            <MetricCard
              title="Specificity"
              value={formatPercent(specificity)}
              subtitle="Actual no-fire cases correctly identified"
              icon={ShieldAlert}
              color="purple"
            />
            <MetricCard
              title="F1-score"
              value={formatPercent(f1)}
              subtitle="Harmonic mean of precision and recall"
              icon={Gauge}
              color="rose"
            />
            <MetricCard
              title="ROC-AUC"
              value={formatPercent(analysis.roc_curve.auc)}
              subtitle="Area under ROC curve"
              icon={BarChart3}
              color="emerald"
            />
            <MetricCard
              title="Average Precision"
              value={formatPercent(analysis.precision_recall_curve.average_precision)}
              subtitle="Summary of precision-recall curve"
              icon={Activity}
              color="blue"
            />
            <MetricCard
              title="Test Records"
              value={String(total)}
              subtitle="Total observations in confusion matrix"
              icon={Database}
              color="purple"
            />
          </div>
        </section>

        {/* ================================= */}
        {/* CONFUSION MATRIX */}
        {/* ================================= */}

        <section className="mb-16">
          <SectionHeading
            eyebrow="04 / Classification breakdown"
            title="Confusion Matrix"
            description="A confusion matrix compares actual labels with predicted labels. It helps us understand the kinds of mistakes the classifier makes."
          />

          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">

            <div className="rounded-2xl border border-white/[0.08] bg-[#0d2018] p-5 md:p-7">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-bold text-white">
                  Actual vs Predicted
                </h3>
                <span className="text-xs text-slate-500">
                  Test set · {total} samples
                </span>
              </div>

              <div className="grid grid-cols-[90px_1fr_1fr] gap-2 sm:grid-cols-[130px_1fr_1fr]">
                <div />
                <div className="pb-2 text-center text-xs font-semibold text-slate-400">
                  Predicted No Fire
                </div>
                <div className="pb-2 text-center text-xs font-semibold text-slate-400">
                  Predicted Fire
                </div>

                <div className="flex items-center text-xs font-semibold text-slate-400">
                  Actual No Fire
                </div>

                <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    True Negative
                  </span>
                  <span className="mt-2 text-3xl font-black text-white">
                    {tn}
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    Correct no-fire
                  </span>
                </div>

                <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">
                    False Positive
                  </span>
                  <span className="mt-2 text-3xl font-black text-white">
                    {fp}
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    False alarm
                  </span>
                </div>

                <div className="flex items-center text-xs font-semibold text-slate-400">
                  Actual Fire
                </div>

                <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">
                    False Negative
                  </span>
                  <span className="mt-2 text-3xl font-black text-white">
                    {fn}
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    Missed fire
                  </span>
                </div>

                <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    True Positive
                  </span>
                  <span className="mt-2 text-3xl font-black text-white">
                    {tp}
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    Correct fire
                  </span>
                </div>
              </div>

              <p className="mt-6 text-xs leading-5 text-slate-500">
                TN = correctly predicted no-fire cases · FP = no-fire cases
                incorrectly predicted as fire · FN = missed fire cases ·
                TP = correctly detected fire cases.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0d2018] p-6">
              <h3 className="font-bold text-white">
                What do these numbers tell us?
              </h3>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-3xl font-black text-emerald-400">
                    {tp} / {tp + fn}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Actual fire cases detected
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    The model identified {tp} of the {tp + fn} fire cases.
                  </p>
                </div>

                <div className="h-px bg-white/[0.08]" />

                <div>
                  <p className="text-3xl font-black text-red-400">
                    {fp}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    False fire alarms
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    These no-fire observations were classified as fire.
                  </p>
                </div>

                <div className="h-px bg-white/[0.08]" />

                <div>
                  <p className="text-3xl font-black text-amber-400">
                    {fn}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Missed fire cases
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    These actual fire observations were classified as no-fire.
                  </p>
                </div>

                <div className="h-px bg-white/[0.08]" />

                <div>
                  <p className="text-3xl font-black text-white">
                    {formatPercent(falsePositiveRate)}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    False Positive Rate
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================================= */}
        {/* FORMULAS */}
        {/* ================================= */}

        <section className="mb-16">
          <SectionHeading
            eyebrow="05 / Mathematics behind evaluation"
            title="How Are Metrics Calculated?"
            description="Expand each metric to see its formula, the values from this confusion matrix, and the actual calculation."
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <FormulaCard
              title="Accuracy"
              result={formatPercent(accuracy)}
              formula="(TP + TN) / (TP + TN + FP + FN)"
              calculation={`(${tp} + ${tn}) / (${tp} + ${tn} + ${fp} + ${fn}) = ${tp + tn} / ${total}`}
              explanation="Accuracy measures the proportion of all test observations classified correctly. Because this dataset has many more no-fire records than fire records, accuracy alone can hide poor performance on the minority fire class."
            />

            <FormulaCard
              title="Precision"
              result={formatPercent(precision)}
              formula="TP / (TP + FP)"
              calculation={`${tp} / (${tp} + ${fp}) = ${tp} / ${tp + fp}`}
              explanation="Precision answers: among all observations predicted as fire, how many were actually fire? Low precision means a large proportion of fire alerts are false alarms."
            />

            <FormulaCard
              title="Recall / Sensitivity"
              result={formatPercent(recall)}
              formula="TP / (TP + FN)"
              calculation={`${tp} / (${tp} + ${fn}) = ${tp} / ${tp + fn}`}
              explanation="Recall answers: among all actual fire cases, how many did the model detect? It is particularly important when missing a fire event has a high cost."
            />

            <FormulaCard
              title="Specificity"
              result={formatPercent(specificity)}
              formula="TN / (TN + FP)"
              calculation={`${tn} / (${tn} + ${fp}) = ${tn} / ${tn + fp}`}
              explanation="Specificity measures how effectively the model identifies actual no-fire observations. Higher specificity means fewer false fire alarms."
            />

            <FormulaCard
              title="F1-score"
              result={formatPercent(f1)}
              formula="2 × (Precision × Recall) / (Precision + Recall)"
              calculation={`2 × (${precision.toFixed(4)} × ${recall.toFixed(4)}) / (${precision.toFixed(4)} + ${recall.toFixed(4)})`}
              explanation="F1-score is the harmonic mean of precision and recall. It gives a single measure that balances missed fire cases and false alarms."
            />

            <FormulaCard
              title="False Positive Rate"
              result={formatPercent(falsePositiveRate)}
              formula="FP / (FP + TN)"
              calculation={`${fp} / (${fp} + ${tn}) = ${fp} / ${fp + tn}`}
              explanation="FPR is the proportion of actual no-fire observations incorrectly classified as fire. It forms the horizontal axis of the ROC curve."
            />

            <FormulaCard
              title="False Negative Rate"
              result={formatPercent(falseNegativeRate)}
              formula="FN / (FN + TP)"
              calculation={`${fn} / (${fn} + ${tp}) = ${fn} / ${fn + tp}`}
              explanation="FNR measures the proportion of actual fire observations that the model failed to detect. It is equal to 1 minus recall."
            />
          </div>

          <div className="mt-6 rounded-xl border border-blue-400/20 bg-blue-400/[0.05] p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 shrink-0 text-blue-400" size={19} />
              <div>
                <h3 className="font-semibold text-blue-300">
                  Why are the metrics different?
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Each metric answers a different question. Accuracy considers
                  all predictions, precision focuses on predicted fire cases,
                  and recall focuses on actual fire cases. Therefore, they
                  should not be interpreted as interchangeable percentages.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================= */}
        {/* ROC CURVE */}
        {/* ================================= */}

        <section className="mb-16">
          <SectionHeading
            eyebrow="06 / Threshold-independent evaluation"
            title="ROC Curve Analysis"
            description="The Receiver Operating Characteristic curve plots the True Positive Rate against the False Positive Rate at different classification thresholds."
          />

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <LineChart
              title="Receiver Operating Characteristic"
              subtitle="Each point represents the model's performance at a different probability threshold."
              xValues={analysis.roc_curve.fpr}
              yValues={analysis.roc_curve.tpr}
              xLabel="False Positive Rate (FPR)"
              yLabel="True Positive Rate (TPR)"
              referenceDiagonal
              fillArea
            />

            <div className="rounded-2xl border border-white/[0.08] bg-[#0d2018] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                ROC-AUC Score
              </p>

              <p className="mt-5 text-5xl font-black text-emerald-400">
                {analysis.roc_curve.auc.toFixed(3)}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Area Under the ROC Curve measures how well the model
                separates positive and negative classes across thresholds.
              </p>

              <div className="mt-6 space-y-4 border-t border-white/[0.08] pt-5">
                <div>
                  <p className="text-sm font-semibold text-white">
                    X-axis: False Positive Rate
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Fraction of actual no-fire cases predicted as fire.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Y-axis: True Positive Rate
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Fraction of actual fire cases correctly detected.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Dashed diagonal
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Reference line for a random-ranking classifier.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#0d2018] p-5">
            <h3 className="font-semibold text-white">
              How is ROC-AUC calculated?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              The ROC curve is constructed by varying the classification
              threshold and calculating TPR and FPR at each threshold.
              The AUC is the area under this plotted curve, numerically
              calculated by the model evaluation library. It is not calculated
              from the single confusion matrix shown above.
            </p>
          </div>
        </section>

        {/* ================================= */}
        {/* PRECISION RECALL CURVE */}
        {/* ================================= */}

        <section className="mb-16">
          <SectionHeading
            eyebrow="07 / Minority class evaluation"
            title="Precision-Recall Curve"
            description="This curve shows how precision changes as recall changes across different probability thresholds."
          />

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <LineChart
              title="Precision vs Recall"
              subtitle="Each plotted point comes from the precision-recall coordinates returned by the trained model evaluation."
              xValues={analysis.precision_recall_curve.recall}
              yValues={analysis.precision_recall_curve.precision}
              xLabel="Recall"
              yLabel="Precision"
              fillArea
            />

            <div className="rounded-2xl border border-white/[0.08] bg-[#0d2018] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Average Precision
              </p>

              <p className="mt-5 text-5xl font-black text-amber-400">
                {analysis.precision_recall_curve.average_precision.toFixed(3)}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Average Precision summarizes the precision-recall curve
                using a weighted sum over recall increments.
              </p>

              <div className="mt-6 border-t border-white/[0.08] pt-5">
                <p className="text-sm font-semibold text-white">
                  Baseline positive-class prevalence
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {formatPercent(
                    dataset.testing_fire_cases / dataset.testing_records
                  )}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  This is the fire-class proportion in the test dataset.
                  A random ranking baseline for average precision is
                  approximately this prevalence.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 shrink-0 text-amber-400" size={18} />
              <p className="text-sm leading-6 text-slate-400">
                Precision-Recall analysis is especially useful here because
                fire cases are the minority class. The test set contains
                {` ${dataset.testing_fire_cases} `}fire cases out of
                {` ${dataset.testing_records} `}total records. Average
                Precision should be interpreted relative to this class
                prevalence.
              </p>
            </div>
          </div>
        </section>

        {/* ================================= */}
        {/* FEATURE IMPORTANCE */}
        {/* ================================= */}

        <section className="mb-16">
          <SectionHeading
            eyebrow="08 / Model interpretability"
            title="Feature Importance"
            description="A ranking of environmental features according to their relative importance in the trained Decision Tree."
          />

          <div className="rounded-2xl border border-white/[0.08] bg-[#0d2018] p-6 md:p-8">
            <div className="mb-7 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white">
                  Feature contribution ranking
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Sorted from highest to lowest importance
                </p>
              </div>
              <BarChart3 className="text-emerald-400" size={23} />
            </div>

            <div className="space-y-6">
              {features.map(([name, value], index) => (
                <div key={name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="w-6 text-xs font-bold text-slate-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate text-sm font-medium text-slate-200">
                        {name.replaceAll("_", " ")}
                      </span>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-emerald-400">
                      {(value * 100).toFixed(2)}%
                    </span>
                  </div>

                  <div className="ml-9 h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full rounded-full ${
                        index === 0
                          ? "bg-emerald-400"
                          : "bg-emerald-700"
                      }`}
                      style={{
                        width: `${Math.max(0, Math.min(100, value * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Key finding
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Drought Index is the most influential feature in this
                trained Decision Tree, contributing approximately
                {" "}
                {(analysis.feature_importance.drought_index * 100).toFixed(2)}%
                {" "}of the model&apos;s total feature importance.
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Feature importance indicates how the fitted model uses features
            for its splits. It does not establish causation, and it does
            not mean that a feature causes that percentage of forest fires.
          </p>
        </section>

        {/* ================================= */}
        {/* DATASET */}
        {/* ================================= */}

        <section className="mb-16">
          <SectionHeading
            eyebrow="09 / Training data"
            title="Dataset & Training Information"
            description="The dataset was divided into training, validation and testing subsets."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Records"
              value={String(dataset.total_records)}
              subtitle="Complete prepared dataset"
              icon={Database}
            />
            <MetricCard
              title="Training"
              value={String(dataset.training_records)}
              subtitle="Used to fit the model"
              icon={Activity}
              color="blue"
            />
            <MetricCard
              title="Validation"
              value={String(dataset.validation_records)}
              subtitle="Used during model selection"
              icon={ClipboardList}
              color="amber"
            />
            <MetricCard
              title="Testing"
              value={String(dataset.testing_records)}
              subtitle="Held-out evaluation subset"
              icon={Target}
              color="purple"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0d2018] p-6">
            <h3 className="mb-5 font-bold text-white">
              Class distribution
            </h3>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">
                    Training — Fire
                  </span>
                  <span className="font-semibold text-red-400">
                    {dataset.training_fire_cases}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-red-400"
                    style={{
                      width: `${dataset.training_fire_cases / dataset.training_records * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {formatPercent(dataset.training_fire_cases / dataset.training_records)}
                </p>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">
                    Training — No Fire
                  </span>
                  <span className="font-semibold text-emerald-400">
                    {dataset.training_no_fire_cases}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${dataset.training_no_fire_cases / dataset.training_records * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {formatPercent(dataset.training_no_fire_cases / dataset.training_records)}
                </p>
              </div>

              <div className="h-px bg-white/[0.08]" />

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">
                    Testing — Fire
                  </span>
                  <span className="font-semibold text-red-400">
                    {dataset.testing_fire_cases}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-red-400"
                    style={{
                      width: `${dataset.testing_fire_cases / dataset.testing_records * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {formatPercent(dataset.testing_fire_cases / dataset.testing_records)}
                </p>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">
                    Testing — No Fire
                  </span>
                  <span className="font-semibold text-emerald-400">
                    {dataset.testing_no_fire_cases}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${dataset.testing_no_fire_cases / dataset.testing_records * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {formatPercent(dataset.testing_no_fire_cases / dataset.testing_records)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================= */}
        {/* MODEL CONFIGURATION */}
        {/* ================================= */}

        <section className="mb-16">
          <SectionHeading
            eyebrow="10 / Model configuration"
            title="Decision Tree Architecture"
            description="The configuration used during model training."
          />

          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d2018]">
            {[
              ["Algorithm", "DecisionTreeClassifier"],
              ["Maximum depth", "8"],
              ["Minimum samples per leaf", "5"],
              ["Class weighting", "balanced"],
              ["Random state", "42"],
              ["Classification threshold", analysis.threshold.toString()],
              ["Input features", "10 environmental features"],
              ["Output classes", "0 = No Fire, 1 = Fire"],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${
                  index !== 7 ? "border-b border-white/[0.06]" : ""
                }`}
              >
                <span className="text-sm text-slate-400">{label}</span>
                <span className="text-sm font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================================= */}
        {/* INTERPRETATION */}
        {/* ================================= */}

        <section className="mb-16">
          <SectionHeading
            eyebrow="11 / Model interpretation"
            title="What Do These Results Mean?"
            description="A practical interpretation of the Decision Tree's current test-set performance."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">
              <CheckCircle2 className="mb-4 text-emerald-400" size={25} />
              <h3 className="text-lg font-bold text-white">
                What the model does well
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                It correctly classified {tn} no-fire observations and
                detected {tp} fire observations in the test set.
                Its recall of {formatPercent(recall)} means it detected
                around seven out of every ten actual fire cases in
                this particular evaluation.
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.04] p-6">
              <CircleAlert className="mb-4 text-red-400" size={25} />
              <h3 className="text-lg font-bold text-white">
                Where it needs improvement
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Its fire precision is only {formatPercent(precision)}.
                It generated {fp} false alarms and missed {fn} actual
                fire cases. Improving the balance between precision
                and recall is an important next step.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#0d2018] p-6">
            <h3 className="font-bold text-white">
              Important model limitations
            </h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-400">
              <li>
                The dataset is synthetic and intended for educational
                demonstration, not operational forecasting.
              </li>
              <li>
                The test dataset has an imbalanced class distribution,
                so accuracy alone is insufficient.
              </li>
              <li>
                Feature importance describes model behaviour and
                should not be interpreted as causal evidence.
              </li>
              <li>
            The model&apos;s probability estimates are not necessarily
                calibrated real-world fire probabilities.
              </li>
              <li>
                The selected classification threshold affects the
                confusion matrix and threshold-dependent metrics.
              </li>
            </ul>
          </div>
        </section>

        {/* ================================= */}
        {/* FOOTER */}
        {/* ================================= */}

        <footer className="border-t border-white/[0.08] pt-8">
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-black">
                Forest<span className="text-emerald-400">Guard</span>
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                Machine Learning Model Evaluation
              </p>
            </div>

            <Link
              href="/#predictor"
              className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-5 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-400/10"
            >
              <ArrowLeft size={16} />
              Back to Fire Risk Predictor
            </Link>
          </div>

          <p className="mt-8 border-t border-white/[0.06] pt-5 text-xs leading-6 text-slate-600">
            ForestGuard is an educational machine learning project
            using a prepared synthetic dataset. It is not a certified
            wildfire detection or emergency alert system. Do not use
            its predictions for real-world emergency decisions.
          </p>
        </footer>

      </div>
    </main>
  );
}

// Suspense boundary for Next.js useSearchParams
export default function DecisionTreePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#07140e] text-white">
          <Loader2 className="animate-spin text-emerald-400" size={32} />
        </main>
      }
    >
      <DecisionTreeDashboard />
    </Suspense>
  );
}
