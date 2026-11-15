
import json
from pathlib import Path

import joblib
import pandas as pd

from math import isfinite

from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
    roc_curve,
    precision_recall_curve,
    average_precision_score
)

# ==================================================
# 1. PATH CONFIGURATION
# ==================================================

BASE_DIR = Path(__file__).resolve().parent

DATA_PATH = BASE_DIR / "data" / "forest_fire_environmental_dataset_clean.csv"
MODEL_DIR = BASE_DIR / "models"

MODEL_DIR.mkdir(parents=True, exist_ok=True)


# ==================================================
# 2. LOAD DATASET
# ==================================================

print("\n========== DATASET LOADING ==========")

df = pd.read_csv(DATA_PATH)

print("Dataset Shape:", df.shape)

print("\nFirst 5 Records:")
print(df.head())

print("\nDataset Information:")
df.info()

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDuplicate Records:", df.duplicated().sum())

print("\nFire Distribution:")
print(df["fire_occurred"].value_counts())


# ==================================================
# 3. FEATURE AND TARGET SEPARATION
# ==================================================

print("\n========== FEATURE SELECTION ==========")

X = df.drop(columns=["record_id", "fire_occurred"])
y = df["fire_occurred"]

FEATURE_COLUMNS = X.columns.tolist()

print("Features:", FEATURE_COLUMNS)
print("X Shape:", X.shape)
print("Y Shape:", y.shape)


# ==================================================
# 4. TRAIN, VALIDATION AND TEST SPLIT
# ==================================================

print("\n========== DATA SPLITTING ==========")

# First separate 15% test data
X_temp, X_test, y_temp, y_test = train_test_split(
    X,
    y,
    test_size=0.15,
    random_state=42,
    stratify=y
)

# Separate 15% validation data from the remaining 85%
X_train, X_val, y_train, y_val = train_test_split(
    X_temp,
    y_temp,
    test_size=0.15 / 0.85,
    random_state=42,
    stratify=y_temp
)

print("Training Data:", X_train.shape)
print("Validation Data:", X_val.shape)
print("Testing Data:", X_test.shape)

print("\nTraining Target Distribution:")
print(y_train.value_counts())

print("\nValidation Target Distribution:")
print(y_val.value_counts())

print("\nTesting Target Distribution:")
print(y_test.value_counts())


# ==================================================
# 5. INITIALIZE MODELS
# ==================================================

print("\n========== MODEL INITIALIZATION ==========")

dt_model = DecisionTreeClassifier(
    max_depth=8,
    min_samples_leaf=5,
    class_weight="balanced",
    random_state=42
)

rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=8,
    min_samples_leaf=5,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

lr_model = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", LogisticRegression(
        class_weight="balanced",
        max_iter=1000,
        random_state=42
    ))
])


# ==================================================
# 6. TRAIN ALL MODELS
# ==================================================

print("\n========== MODEL TRAINING ==========")

dt_model.fit(X_train, y_train)
print("Decision Tree Training Completed!")

rf_model.fit(X_train, y_train)
print("Random Forest Training Completed!")

lr_model.fit(X_train, y_train)
print("Logistic Regression Training Completed!")


# ==================================================
# 7. MODEL EVALUATION FUNCTION
# ==================================================

def evaluate_model(model_name, y_true, y_pred, y_prob):

    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(
        y_true, y_pred, zero_division=0
    )
    recall = recall_score(
        y_true, y_pred, zero_division=0
    )
    f1 = f1_score(
        y_true, y_pred, zero_division=0
    )
    roc_auc = roc_auc_score(y_true, y_prob)

    print(f"\n========== {model_name} ==========")

    print("Accuracy:", accuracy)
    print("Precision (Fire):", precision)
    print("Recall (Fire):", recall)
    print("F1 Score (Fire):", f1)
    print("ROC-AUC:", roc_auc)

    print("\nConfusion Matrix:")
    print(confusion_matrix(y_true, y_pred))

    print("\nClassification Report:")
    print(
        classification_report(
            y_true,
            y_pred,
            zero_division=0
        )
    )

    return {
        "Model": model_name,
        "Accuracy": accuracy,
        "Fire_Precision": precision,
        "Fire_Recall": recall,
        "Fire_F1": f1,
        "ROC_AUC": roc_auc
    }


# ==================================================
# 8. INITIAL TEST SET COMPARISON
# All models use default 0.5 classification threshold
# ==================================================

print("\n========== INITIAL TEST EVALUATION ==========")

dt_prob = dt_model.predict_proba(X_test)[:, 1]
rf_prob = rf_model.predict_proba(X_test)[:, 1]
lr_prob = lr_model.predict_proba(X_test)[:, 1]

dt_pred = (dt_prob >= 0.5).astype(int)
rf_pred = (rf_prob >= 0.5).astype(int)
lr_pred = (lr_prob >= 0.5).astype(int)

results = []

results.append(
    evaluate_model(
        "Decision Tree",
        y_test,
        dt_pred,
        dt_prob
    )
)

results.append(
    evaluate_model(
        "Random Forest",
        y_test,
        rf_pred,
        rf_prob
    )
)

results.append(
    evaluate_model(
        "Logistic Regression (Threshold 0.5)",
        y_test,
        lr_pred,
        lr_prob
    )
)


# ==================================================
# 9. FEATURE IMPORTANCE
# ==================================================

print("\n========== FEATURE IMPORTANCE ==========")

dt_importance = pd.Series(
    dt_model.feature_importances_,
    index=FEATURE_COLUMNS
).sort_values(ascending=False)

rf_importance = pd.Series(
    rf_model.feature_importances_,
    index=FEATURE_COLUMNS
).sort_values(ascending=False)

print("\nDecision Tree Feature Importance:")
print(dt_importance)

print("\nRandom Forest Feature Importance:")
print(rf_importance)

dt_importance.to_csv(
    MODEL_DIR / "decision_tree_feature_importance.csv"
)

rf_importance.to_csv(
    MODEL_DIR / "random_forest_feature_importance.csv"
)


# ==================================================
# 10. LOGISTIC REGRESSION THRESHOLD TUNING
# Use validation data only
# ==================================================

print("\n========== THRESHOLD TUNING ==========")

val_prob = lr_model.predict_proba(X_val)[:, 1]

thresholds = [0.3, 0.4, 0.5, 0.6, 0.7]

threshold_results = []

for threshold in thresholds:

    val_pred = (val_prob >= threshold).astype(int)

    precision = precision_score(
        y_val,
        val_pred,
        zero_division=0
    )

    recall = recall_score(
        y_val,
        val_pred,
        zero_division=0
    )

    f1 = f1_score(
        y_val,
        val_pred,
        zero_division=0
    )

    threshold_results.append({
        "Threshold": threshold,
        "Precision": precision,
        "Recall": recall,
        "F1_Score": f1
    })

threshold_df = pd.DataFrame(threshold_results)

print("\nValidation Threshold Comparison:")
print(threshold_df.to_string(index=False))

# Select threshold with the highest validation F1-score
best_result = max(
    threshold_results,
    key=lambda item: item["F1_Score"]
)

best_threshold = best_result["Threshold"]

print("\nSelected Threshold:", best_threshold)
print("Validation F1 Score:", best_result["F1_Score"])

threshold_df.to_csv(
    MODEL_DIR / "threshold_comparison.csv",
    index=False
)


# ==================================================
# 11. FINAL LOGISTIC REGRESSION TEST EVALUATION
# ==================================================

print("\n========== TUNED LOGISTIC REGRESSION ==========")

tuned_lr_pred = (
    lr_prob >= best_threshold
).astype(int)

tuned_lr_result = evaluate_model(
    f"Logistic Regression (Threshold {best_threshold})",
    y_test,
    tuned_lr_pred,
    lr_prob
)

results.append(tuned_lr_result)


# ==================================================
# 12. FINAL MODEL COMPARISON
# ==================================================

print("\n========== FINAL MODEL COMPARISON ==========")

comparison_df = pd.DataFrame(results)

print(
    comparison_df.sort_values(
        by="ROC_AUC",
        ascending=False
    ).to_string(index=False)
)

comparison_df.to_csv(
    MODEL_DIR / "model_comparison.csv",
    index=False
)



# ==================================================
# 12.1 SAVE MODEL ANALYSIS ARTIFACTS
# ==================================================

print("\n========== SAVING MODEL ANALYSIS ARTIFACTS ==========")

# Model predictions and probabilities on the TEST set
model_outputs = {
    "decision_tree": {
        "model": dt_model,
        "probabilities": dt_prob,
        "predictions": dt_pred,
        "threshold": 0.5
    },
    "random_forest": {
        "model": rf_model,
        "probabilities": rf_prob,
        "predictions": rf_pred,
        "threshold": 0.5
    },
    "logistic_regression": {
        "model": lr_model,
        "probabilities": lr_prob,
        "predictions": tuned_lr_pred,
        "threshold": best_threshold
    }
}

for model_name, output in model_outputs.items():

    probabilities = output["probabilities"]
    predictions = output["predictions"]

    # Confusion Matrix
    cm = confusion_matrix(y_test, predictions)

    # ROC Curve
    fpr, tpr, roc_thresholds = roc_curve(
        y_test,
        probabilities
    )

    # Precision-Recall Curve
    pr_precision, pr_recall, pr_thresholds = precision_recall_curve(
        y_test,
        probabilities
    )

    # Classification Report
    report = classification_report(
        y_test,
        predictions,
        output_dict=True,
        zero_division=0
    )

    # Feature Importance (Decision Tree / Random Forest)
    importance_data = {}

    if hasattr(output["model"], "feature_importances_"):
        importance_data = {
            feature: float(importance)
            for feature, importance in zip(
                FEATURE_COLUMNS,
                output["model"].feature_importances_
            )
        }

    # Complete model analysis data
    analysis_data = {
        "model_name": model_name,
        "threshold": float(output["threshold"]),

        "confusion_matrix": cm.tolist(),

        "roc_curve": {
            "fpr": fpr.tolist(),
            "tpr": tpr.tolist(),
            "thresholds": [
               float(value) if isfinite(value) else None
               for value in roc_thresholds
            ],
            "auc": float(roc_auc_score(y_test, probabilities))
        },

        "precision_recall_curve": {
            "precision": pr_precision.tolist(),
            "recall": pr_recall.tolist(),
            "thresholds": pr_thresholds.tolist(),
            "average_precision": float(
                average_precision_score(y_test, probabilities)
            )
        },

        "classification_report": report,

        "feature_importance": importance_data,

        "dataset": {
            "total_records": int(len(df)),
            "training_records": int(len(X_train)),
            "validation_records": int(len(X_val)),
            "testing_records": int(len(X_test)),
            "training_fire_cases": int(y_train.sum()),
            "testing_fire_cases": int(y_test.sum()),
            "training_no_fire_cases": int((y_train == 0).sum()),
            "testing_no_fire_cases": int((y_test == 0).sum())
        }
    }

    # Save JSON
    output_path = MODEL_DIR / f"{model_name}_analysis.json"

    with open(output_path, "w") as file:
        json.dump(analysis_data, file, indent=4)

    print(f"Saved: {output_path.name}")

print("All analysis artifacts saved successfully!")


# ==================================================
# 13. SAVE TRAINED MODELS
# ==================================================

print("\n========== SAVING MODELS ==========")

joblib.dump(
    dt_model,
    MODEL_DIR / "decision_tree.pkl"
)

joblib.dump(
    rf_model,
    MODEL_DIR / "random_forest.pkl"
)

joblib.dump(
    lr_model,
    MODEL_DIR / "logistic_regression.pkl"
)

# Save metadata required for future predictions
metadata = {
    "feature_columns": FEATURE_COLUMNS,
    "target_column": "fire_occurred",
    "selected_model": "logistic_regression",
    "selected_threshold": float(best_threshold),
    "dataset_name": DATA_PATH.name
}

with open(MODEL_DIR / "model_metadata.json", "w") as file:
    json.dump(metadata, file, indent=4)

print("All models saved successfully!")
print("Model directory:", MODEL_DIR)

print("\n========== TRAINING PIPELINE COMPLETED ==========")
