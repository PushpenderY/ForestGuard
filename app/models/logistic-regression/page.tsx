
"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CircleDot,
  Database,
  Flame,
  Info,
  Layers,
  Loader2,
  ShieldCheck,
  Target,
  Trees,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Link from "next/link";

type AnalysisData = {
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
    "macro avg": {
      precision: number;
      recall: number;
      "f1-score": number;
      support: number;
    };
    "weighted avg": {
      precision: number;
      recall: number;
      "f1-score": number;
      support: number;
    };
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
};

const API_URL = (process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000").replace(/\/$/, "");

const COLORS = {
  green: "#34d399",
  darkGreen: "#059669",
  red: "#f87171",
  yellow: "#fbbf24",
  muted: "#94a3b8",
  grid: "#253b32",
};

const FEATURES = [
  {
    name: "Latitude",
    description: "Geographical latitude of the observation.",
  },
  {
    name: "Longitude",
    description: "Geographical longitude of the observation.",
  },
  {
    name: "Temperature",
    description: "Ambient temperature in Celsius.",
  },
  {
    name: "Relative Humidity",
    description: "Percentage of moisture present in the air.",
  },
  {
    name: "Wind Speed",
    description: "Wind speed measured in km/h.",
  },
  {
    name: "Rainfall",
    description: "Recorded rainfall in millimeters.",
  },
  {
    name: "Drought Index",
    description: "Indicator of drought severity.",
  },
  {
    name: "Vegetation Moisture",
    description: "Moisture percentage in vegetation.",
  },
  {
    name: "Month",
    description: "Month of the recorded observation.",
  },
  {
    name: "Day of Year",
    description: "Day number within the calendar year.",
  },
];

function percent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function decimal(value: number) {
  return value.toFixed(4);
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  accent = "green",
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  accent?: "green" | "red" | "yellow";
}) {
  const accentClasses = {
    green: "text-emerald-400 bg-emerald-400/10",
    red: "text-red-400 bg-red-400/10",
    yellow: "text-amber-400 bg-amber-400/10",
  };

  return (
    <div className="rounded-2xl border border-[#244438] bg-[#10251d] p-5 transition hover:border-emerald-500/50">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>
        <div className={`rounded-xl p-2 ${accentClasses[accent]}`}>
          <Icon size={19} />
        </div>
      </div>

      <h3 className="mt-4 text-3xl font-bold text-white">{value}</h3>
      <p className="mt-2 text-xs text-gray-500">{description}</p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
        {description}
      </p>
    </div>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#244438] bg-[#10251d] p-5 md:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default function LogisticRegressionPage() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchAnalysis() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/models/logistic-regression/analysis`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load analysis. Server returned ${response.status}.`
          );
        }

        const result = await response.json();

        if (result.status !== "success" || !result.analysis) {
          throw new Error("Invalid analysis response from backend.");
        }

        if (active) {
          setAnalysis(result.analysis);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading analysis."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchAnalysis();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#081711]">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-emerald-400" size={38} />
          <p className="mt-4 text-sm text-gray-400">
            Loading Logistic Regression analysis...
          </p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#081711] px-5">
        <div className="max-w-lg rounded-2xl border border-red-500/30 bg-[#10251d] p-8 text-center">
          <AlertTriangle className="mx-auto text-red-400" size={40} />
          <h2 className="mt-4 text-xl font-bold text-white">
            Analysis could not be loaded
          </h2>
          <p className="mt-3 text-sm text-gray-400">{error}</p>
          <p className="mt-3 text-xs text-gray-500">
            Check that the FastAPI server is running and the analysis endpoint
            is available.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black hover:bg-emerald-400"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const report = analysis.classification_report;
  const dataset = analysis.dataset;
  const matrix = analysis.confusion_matrix;

  const tn = matrix[0][0];
  const fp = matrix[0][1];
  const fn = matrix[1][0];
  const tp = matrix[1][1];

  const rocData = analysis.roc_curve.fpr.map((value, index) => ({
    fpr: value,
    tpr: analysis.roc_curve.tpr[index],
  }));

  const prData = analysis.precision_recall_curve.recall
    .map((value, index) => ({
      recall: value,
      precision: analysis.precision_recall_curve.precision[index],
    }))
    .filter(
      (point) =>
        Number.isFinite(point.recall) &&
        Number.isFinite(point.precision)
    );

  const classData = [
    { name: "No Fire", value: dataset.testing_no_fire_cases },
    { name: "Fire", value: dataset.testing_fire_cases },
  ];

  const specificity = tn / (tn + fp);
  const sensitivity = tp / (tp + fn);

  return (
    <main className="min-h-screen bg-[#081711] text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-b border-[#244438] bg-[#0b1d15]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <Trees className="text-emerald-400" size={25} />
            <span>Forest<span className="text-emerald-400">Guard</span></span>
          </Link>

          <Link
            href="/models"
            className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-emerald-400"
          >
            <ArrowLeft size={16} />
            All Models
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-5 py-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#123c2b] via-[#10291e] to-[#0d2118] p-7 md:p-10">
          <div className="pointer-events-none absolute -right-10 -top-16 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <CircleDot size={13} />
              MACHINE LEARNING MODEL
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Logistic Regression
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
              A probabilistic classification model that estimates the
              likelihood of a forest fire using environmental and geographical
              parameters. The model converts its probability output into a
              prediction using a selected decision threshold.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-xs text-gray-400">Selected Threshold</p>
                <p className="mt-1 text-xl font-bold text-emerald-300">
                  {analysis.threshold.toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-xs text-gray-400">ROC-AUC</p>
                <p className="mt-1 text-xl font-bold text-white">
                  {decimal(analysis.roc_curve.auc)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-xs text-gray-400">Testing Records</p>
                <p className="mt-1 text-xl font-bold text-white">
                  {dataset.testing_records}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-5 right-7 hidden opacity-10 md:block">
            <Flame size={180} />
          </div>
        </section>

        {/* Metrics */}
        <section className="mt-10">
          <SectionHeading
            eyebrow="Model Performance"
            title="Performance Overview"
            description="Evaluation results calculated on the testing dataset using the selected classification threshold."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Accuracy"
              value={percent(report.accuracy)}
              description="Overall correct predictions"
              icon={Target}
            />
            <MetricCard
              title="Fire Precision"
              value={percent(report["1"].precision)}
              description="Correct fire predictions among predicted fires"
              icon={ShieldCheck}
              accent="yellow"
            />
            <MetricCard
              title="Fire Recall"
              value={percent(report["1"].recall)}
              description="Actual fire cases correctly detected"
              icon={Flame}
              accent="red"
            />
            <MetricCard
              title="Fire F1-Score"
              value={decimal(report["1"]["f1-score"])}
              description="Balance between precision and recall"
              icon={Activity}
            />
          </div>
        </section>

        {/* Classification report */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="Detailed Evaluation"
            title="Classification Report"
            description="Class-wise precision, recall, F1-score and support for the test dataset."
          />

          <Panel>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#294438] text-gray-400">
                    <th className="px-4 py-4">Class</th>
                    <th className="px-4 py-4">Precision</th>
                    <th className="px-4 py-4">Recall</th>
                    <th className="px-4 py-4">F1-Score</th>
                    <th className="px-4 py-4">Support</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    { label: "No Fire (0)", item: report["0"] },
                    { label: "Fire (1)", item: report["1"] },
                    { label: "Macro Average", item: report["macro avg"] },
                    { label: "Weighted Average", item: report["weighted avg"] },
                  ].map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-[#20382d] last:border-0"
                    >
                      <td className="px-4 py-4 font-medium text-white">
                        {row.label}
                      </td>
                      <td className="px-4 py-4 text-emerald-300">
                        {percent(row.item.precision)}
                      </td>
                      <td className="px-4 py-4 text-emerald-300">
                        {percent(row.item.recall)}
                      </td>
                      <td className="px-4 py-4 text-white">
                        {decimal(row.item["f1-score"])}
                      </td>
                      <td className="px-4 py-4 text-gray-400">
                        {row.item.support}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </section>

        {/* Confusion Matrix */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="Prediction Analysis"
            title="Confusion Matrix"
            description="The matrix shows how many fire and no-fire cases were classified correctly and incorrectly."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel>
              <h3 className="mb-5 font-semibold text-white">
                Actual vs Predicted
              </h3>

              <div className="mx-auto max-w-md">
                <p className="mb-3 text-center text-xs text-gray-400">
                  Predicted Class
                </p>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-[#1a382a] py-2 text-xs text-gray-300">
                      No Fire (0)
                    </div>
                    <div className="rounded-lg bg-[#1a382a] py-2 text-xs text-gray-300">
                      Fire (1)
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/20 p-6">
                      <p className="text-3xl font-bold text-emerald-300">
                        {tn}
                      </p>
                      <p className="mt-2 text-xs text-gray-300">
                        True Negative
                      </p>
                    </div>
                    <div className="rounded-xl border border-red-400/20 bg-red-500/20 p-6">
                      <p className="text-3xl font-bold text-red-300">{fn}</p>
                      <p className="mt-2 text-xs text-gray-300">
                        False Negative
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="rounded-xl border border-red-400/20 bg-red-500/20 p-6">
                      <p className="text-3xl font-bold text-red-300">{fp}</p>
                      <p className="mt-2 text-xs text-gray-300">
                        False Positive
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/20 p-6">
                      <p className="text-3xl font-bold text-emerald-300">
                        {tp}
                      </p>
                      <p className="mt-2 text-xs text-gray-300">
                        True Positive
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-center text-xs text-gray-400">
                  Actual Class: No Fire / Fire
                </p>
              </div>
            </Panel>

            <Panel>
              <h3 className="mb-5 font-semibold text-white">
                Confusion Matrix Insights
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-[#173529] p-4">
                  <div>
                    <p className="text-sm text-gray-300">True Negatives</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Correctly identified no-fire cases
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-300">{tn}</p>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#173529] p-4">
                  <div>
                    <p className="text-sm text-gray-300">True Positives</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Correctly detected fire cases
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-300">{tp}</p>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#173529] p-4">
                  <div>
                    <p className="text-sm text-gray-300">False Positives</p>
                    <p className="mt-1 text-xs text-gray-500">
                      No-fire cases incorrectly flagged as fire
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-red-300">{fp}</p>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#173529] p-4">
                  <div>
                    <p className="text-sm text-gray-300">False Negatives</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Actual fire cases missed by the model
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-red-300">{fn}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className="text-xs text-gray-400">Specificity</p>
                    <p className="mt-1 text-xl font-bold text-white">
                      {percent(specificity)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Sensitivity</p>
                    <p className="mt-1 text-xl font-bold text-white">
                      {percent(sensitivity)}
                    </p>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </section>

        {/* ROC Curve */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="Threshold Evaluation"
            title="ROC Curve"
            description="The ROC curve illustrates the trade-off between the true positive rate and false positive rate across different classification thresholds."
          />

          <Panel>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-400">Area Under Curve</p>
                <p className="mt-1 text-3xl font-bold text-emerald-300">
                  {decimal(analysis.roc_curve.auc)}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-400/10 px-4 py-2 text-xs text-emerald-300">
                ROC-AUC Score
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rocData}>
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="4 4" />
                  <XAxis
                    dataKey="fpr"
                    type="number"
                    domain={[0, 1]}
                    tickFormatter={(v) => v.toFixed(1)}
                    stroke={COLORS.muted}
                    label={{
                      value: "False Positive Rate",
                      position: "insideBottom",
                      offset: -5,
                      fill: COLORS.muted,
                    }}
                  />
                  <YAxis
                    type="number"
                    domain={[0, 1]}
                    tickFormatter={(v) => v.toFixed(1)}
                    stroke={COLORS.muted}
                    label={{
                      value: "True Positive Rate",
                      angle: -90,
                      position: "insideLeft",
                      fill: COLORS.muted,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#10251d",
                      border: "1px solid #315442",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                    formatter={(value: unknown) => [
                      Number(value).toFixed(4),
                      "Rate",
                    ]}
                  />
                  <Line
                    type="stepAfter"
                    dataKey="tpr"
                    stroke={COLORS.green}
                    strokeWidth={3}
                    dot={false}
                    name="ROC Curve"
                  />
                  <Line
                    type="linear"
                    data={[
                      { fpr: 0, tpr: 0 },
                      { fpr: 1, tpr: 1 },
                    ]}
                    dataKey="tpr"
                    stroke="#64748b"
                    strokeDasharray="6 6"
                    dot={false}
                    name="Random Classifier"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-4 text-xs leading-6 text-gray-500">
              A higher ROC-AUC indicates better ranking ability between fire
              and no-fire observations. The diagonal line represents random
              classification.
            </p>
          </Panel>
        </section>

        {/* Precision Recall */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="Class Imbalance Evaluation"
            title="Precision-Recall Curve"
            description="Precision and recall are especially useful when fire cases are much fewer than no-fire cases."
          />

          <Panel>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-400">Average Precision</p>
                <p className="mt-1 text-3xl font-bold text-emerald-300">
                  {decimal(analysis.precision_recall_curve.average_precision)}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-400/10 px-4 py-2 text-xs text-emerald-300">
                PR-AUC / Average Precision
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prData}>
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="4 4" />
                  <XAxis
                    dataKey="recall"
                    type="number"
                    domain={[0, 1]}
                    tickFormatter={(v) => v.toFixed(1)}
                    stroke={COLORS.muted}
                    label={{
                      value: "Recall",
                      position: "insideBottom",
                      offset: -5,
                      fill: COLORS.muted,
                    }}
                  />
                  <YAxis
                    type="number"
                    domain={[0, 1]}
                    tickFormatter={(v) => v.toFixed(1)}
                    stroke={COLORS.muted}
                    label={{
                      value: "Precision",
                      angle: -90,
                      position: "insideLeft",
                      fill: COLORS.muted,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#10251d",
                      border: "1px solid #315442",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                    formatter={(value: unknown) => [
                      Number(value).toFixed(4),
                      "Score",
                    ]}
                  />
                  <Line
                    type="stepAfter"
                    dataKey="precision"
                    stroke={COLORS.green}
                    strokeWidth={3}
                    dot={false}
                    name="Precision-Recall"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-4 text-xs leading-6 text-gray-500">
              Average Precision summarizes the precision-recall curve. It
              helps evaluate the model&apos;s ability to identify the minority
              fire class.
            </p>
          </Panel>
        </section>

        {/* Dataset */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="Training Information"
            title="Dataset Overview"
            description="Dataset distribution used during model development and evaluation."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel>
              <div className="mb-5 flex items-center gap-3">
                <Database className="text-emerald-400" size={22} />
                <h3 className="font-semibold">Dataset Distribution</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Total Records", dataset.total_records],
                  ["Training Records", dataset.training_records],
                  ["Validation Records", dataset.validation_records],
                  ["Testing Records", dataset.testing_records],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-[#173529] p-4">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {Number(value).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-gray-400">Training</span>
                    <span className="text-gray-300">
                      {percent(
                        dataset.training_records / dataset.total_records
                      )}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#294438]">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{
                        width: `${
                          (dataset.training_records / dataset.total_records) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-gray-400">Validation</span>
                    <span className="text-gray-300">
                      {percent(
                        dataset.validation_records / dataset.total_records
                      )}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#294438]">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{
                        width: `${
                          (dataset.validation_records /
                            dataset.total_records) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-gray-400">Testing</span>
                    <span className="text-gray-300">
                      {percent(
                        dataset.testing_records / dataset.total_records
                      )}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#294438]">
                    <div
                      className="h-full rounded-full bg-sky-400"
                      style={{
                        width: `${
                          (dataset.testing_records / dataset.total_records) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Panel>

            <Panel>
              <div className="mb-5 flex items-center gap-3">
                <Layers className="text-emerald-400" size={22} />
                <h3 className="font-semibold">Testing Class Distribution</h3>
              </div>

              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={88}
                      paddingAngle={4}
                    >
                      <Cell fill="#34d399" />
                      <Cell fill="#f87171" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#10251d",
                        border: "1px solid #315442",
                        borderRadius: "10px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 flex justify-center gap-6">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  No Fire: {dataset.testing_no_fire_cases}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  Fire: {dataset.testing_fire_cases}
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 shrink-0 text-amber-300" size={17} />
                  <p className="text-xs leading-6 text-gray-400">
                    The testing dataset contains fewer fire cases than
                    no-fire cases. This class imbalance makes fire-class
                    precision and recall important evaluation metrics.
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        </section>

        {/* Features */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="Model Inputs"
            title="Features Used by the Model"
            description="The Logistic Regression model receives ten environmental and geographical input features."
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.name}
                className="flex items-start gap-3 rounded-xl border border-[#244438] bg-[#10251d] p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-xs font-bold text-emerald-300">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Theory */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="How It Works"
            title="Understanding Logistic Regression"
            description="A brief explanation of the classification process used by this model."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel>
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <Activity className="text-emerald-400" size={20} />
                Logistic Function
              </h3>

              <div className="rounded-xl bg-[#091b13] p-5 text-center">
                <p className="text-lg font-semibold text-emerald-300">
                  σ(z) = 1 / (1 + e⁻ᶻ)
                </p>
                <p className="mt-3 text-xs text-gray-500">
                  The sigmoid function converts a linear score into a
                  probability between 0 and 1.
                </p>
              </div>

              <p className="mt-4 text-sm leading-7 text-gray-400">
                The model combines input features with learned coefficients
                to calculate a score. The sigmoid function transforms this
                score into a probability of the positive class.
              </p>
            </Panel>

            <Panel>
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <Target className="text-emerald-400" size={20} />
                Classification Threshold
              </h3>

              <div className="rounded-xl bg-[#091b13] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Selected threshold
                  </span>
                  <span className="text-2xl font-bold text-emerald-300">
                    {analysis.threshold}
                  </span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#294438]">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${analysis.threshold * 100}%` }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>0.0</span>
                  <span>1.0</span>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm text-gray-400">
                <p>
                  <span className="font-semibold text-emerald-300">
                    Probability ≥ {analysis.threshold}
                  </span>
                  {" "}→ Fire
                </p>
                <p>
                  <span className="font-semibold text-gray-200">
                    Probability &lt; {analysis.threshold}
                  </span>
                  {" "}→ No Fire
                </p>
              </div>
            </Panel>
          </div>
        </section>

        {/* Feature Importance Notice */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="Explainability"
            title="Feature Importance"
            description="Feature contribution information supplied with the current analysis file."
          />

          <Panel>
            {Object.keys(analysis.feature_importance || {}).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(analysis.feature_importance)
                  .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                  .map(([feature, value]) => (
                    <div key={feature}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-gray-300">{feature}</span>
                        <span className="text-emerald-300">
                          {Number(value).toFixed(4)}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#294438]">
                        <div
                          className="h-full rounded-full bg-emerald-400"
                          style={{
                            width: `${
                              (Math.abs(value) /
                                Math.max(
                                  ...Object.values(
                                    analysis.feature_importance
                                  ).map((v) => Math.abs(v)),
                                  0.0001
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Info className="mx-auto text-amber-300" size={30} />
                <h3 className="mt-4 font-semibold text-white">
                  Feature importance data not available
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-400">
                  The supplied analysis JSON contains an empty
                  feature_importance object. Logistic Regression coefficients
                  or feature-importance values have not been provided, so
                  they are not displayed as invented results.
                </p>
              </div>
            )}
          </Panel>
        </section>

        {/* Final Summary */}
        <section className="mt-12">
          <Panel className="border-emerald-500/30 bg-gradient-to-br from-[#123c2b] to-[#10251d]">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-400/10 p-3">
                <ShieldCheck className="text-emerald-300" size={25} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Model Evaluation Summary
                </h2>
                <p className="mt-3 text-sm leading-7 text-gray-300">
                  The Logistic Regression model achieved an accuracy of{" "}
                  <strong className="text-emerald-300">
                    {percent(report.accuracy)}
                  </strong>{" "}
                  and a ROC-AUC score of{" "}
                  <strong className="text-emerald-300">
                    {decimal(analysis.roc_curve.auc)}
                  </strong>
                  . At the selected threshold of{" "}
                  <strong className="text-emerald-300">
                    {analysis.threshold}
                  </strong>
                  , it detected {tp} out of {tp + fn} actual fire cases.
                  Its fire-class recall is{" "}
                  <strong className="text-emerald-300">
                    {percent(report["1"].recall)}
                  </strong>
                  .
                </p>
                <p className="mt-3 text-sm leading-7 text-gray-400">
                  The model also produced {fp} false fire alarms and missed{" "}
                  {fn} actual fire cases. These results should be considered
                  when evaluating the model for practical forest-fire
                  monitoring.
                </p>
              </div>
            </div>
          </Panel>
        </section>

        {/* Footer */}
        <footer className="mt-14 border-t border-[#244438] py-7 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-300">
            <Trees className="text-emerald-400" size={19} />
            ForestGuard
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Forest Fire Prediction and Monitoring System
          </p>
        </footer>
      </div>
    </main>
  );
}
