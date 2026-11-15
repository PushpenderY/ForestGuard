import argparse
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier

FEATURES = [
    "latitude", "longitude", "temperature_c", "relative_humidity_pct",
    "wind_speed_kmh", "rainfall_mm", "drought_index",
    "vegetation_moisture_pct", "month", "day_of_year"
]
TARGET = "fire_occurred"


def build_models():
    tree_prep = ColumnTransformer([
        ("numeric", SimpleImputer(strategy="median"), FEATURES)
    ])
    scaled_prep = ColumnTransformer([
        ("numeric", Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler())
        ]), FEATURES)
    ])
    return {
        "decision_tree": Pipeline([
            ("preprocess", tree_prep),
            ("model", DecisionTreeClassifier(
                max_depth=8, min_samples_leaf=5,
                class_weight="balanced", random_state=42
            ))
        ]),
        "random_forest": Pipeline([
            ("preprocess", tree_prep),
            ("model", RandomForestClassifier(
                n_estimators=300, min_samples_leaf=3,
                class_weight="balanced", random_state=42, n_jobs=-1
            ))
        ]),
        "logistic_regression": Pipeline([
            ("preprocess", scaled_prep),
            ("model", LogisticRegression(
                max_iter=2000, class_weight="balanced", random_state=42
            ))
        ])
    }


def evaluate(model, X_test, y_test):
    pred = model.predict(X_test)
    prob = model.predict_proba(X_test)[:, 1]
    return {
        "accuracy": round(float(accuracy_score(y_test, pred)), 4),
        "precision": round(float(precision_score(y_test, pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, pred, zero_division=0)), 4),
        "f1_score": round(float(f1_score(y_test, pred, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, prob)), 4),
        "confusion_matrix": confusion_matrix(y_test, pred).tolist()
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/forest_fire_environmental_dataset_clean.csv")
    parser.add_argument("--output", default="artifacts")
    args = parser.parse_args()

    df = pd.read_csv(args.data)
    required = FEATURES + [TARGET]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing columns: {missing}")
    df = df[required].copy()
    df[TARGET] = pd.to_numeric(df[TARGET], errors="raise").astype(int)
    if not set(df[TARGET].unique()).issubset({0, 1}):
        raise ValueError("fire_occurred must contain only 0 and 1")

    X_train, X_test, y_train, y_test = train_test_split(
        df[FEATURES], df[TARGET], test_size=0.20,
        random_state=42, stratify=df[TARGET]
    )

    models = build_models()
    metrics = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        metrics[name] = evaluate(model, X_test, y_test)
        print(f"\n{name}: {json.dumps(metrics[name], indent=2)}")

    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    joblib.dump({
        "models": models,
        "features": FEATURES,
        "target": TARGET,
        "dataset_note": "Synthetic educational dataset; not operationally validated."
    }, output / "forestguard_models.joblib")
    (output / "model_metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(f"Saved models and metrics in {output.resolve()}")


if __name__ == "__main__":
    main()
