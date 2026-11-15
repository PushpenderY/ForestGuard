"""Train and compare ForestGuard classifiers on the cleaned CSV."""
import argparse
import json
from pathlib import Path
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

FEATURES = [
    "latitude", "longitude", "temperature_c", "relative_humidity_pct",
    "wind_speed_kmh", "rainfall_mm", "drought_index",
    "vegetation_moisture_pct", "month", "day_of_year",
]
TARGET = "fire_occurred"

def make_pipeline(model, scale=False):
    steps = [("imputer", SimpleImputer(strategy="median"))]
    if scale:
        steps.append(("scaler", StandardScaler()))
    steps.append(("model", model))
    return Pipeline(steps)

def evaluate(model, X_test, y_test):
    pred = model.predict(X_test)
    prob = model.predict_proba(X_test)[:, 1]
    return {
        "accuracy": round(float(accuracy_score(y_test, pred)), 4),
        "precision": round(float(precision_score(y_test, pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, pred, zero_division=0)), 4),
        "f1_score": round(float(f1_score(y_test, pred, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, prob)), 4),
        "confusion_matrix": confusion_matrix(y_test, pred).tolist(),
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="../forest_fire_environmental_dataset_clean.csv")
    parser.add_argument("--output", default="artifacts")
    args = parser.parse_args()
    df = pd.read_csv(args.data)
    missing = [c for c in FEATURES + [TARGET] if c not in df.columns]
    if missing:
        raise ValueError(f"Missing columns: {missing}")
    X, y = df[FEATURES], df[TARGET].astype(int)
    if not set(y.unique()).issubset({0, 1}):
        raise ValueError("fire_occurred must contain only 0 and 1")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    models = {
        "decision_tree": make_pipeline(DecisionTreeClassifier(
            max_depth=8, min_samples_leaf=5, class_weight="balanced", random_state=42
        )),
        "random_forest": make_pipeline(RandomForestClassifier(
            n_estimators=300, min_samples_leaf=3, class_weight="balanced",
            random_state=42, n_jobs=-1
        )),
        "logistic_regression": make_pipeline(LogisticRegression(
            max_iter=2000, class_weight="balanced", random_state=42
        ), scale=True),
    }
    metrics = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        metrics[name] = evaluate(model, X_test, y_test)
        print(name, json.dumps(metrics[name], indent=2))
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    joblib.dump({
        "models": models,
        "features": FEATURES,
        "target": TARGET,
        "dataset_note": "Synthetic educational dataset; not operationally validated."
    }, out / "forestguard_models.joblib")
    (out / "model_metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(f"Saved model bundle and metrics under {out.resolve()}")

if __name__ == "__main__":
    main()
