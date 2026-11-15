
from pathlib import Path
import json
import os

import joblib
import pandas as pd

from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


# ==========================================
# 1. CREATE FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="ForestGuard ML API",
    description="Machine Learning API for Forest Fire Prediction",
    version="1.0.0"
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("FORESTGUARD_CORS_ORIGINS", "*").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ==========================================
# 2. DEFINE PATHS
# ==========================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_DIR = BASE_DIR / "models"

DECISION_TREE_ANALYSIS_FILE = MODEL_DIR / "decision_tree_analysis.json"


# ==========================================
# 3. LOAD TRAINED MODELS
# ==========================================

dt_model = joblib.load(
    MODEL_DIR / "decision_tree.pkl"
)

rf_model = joblib.load(
    MODEL_DIR / "random_forest.pkl"
)

lr_model = joblib.load(
    MODEL_DIR / "logistic_regression.pkl"
)


# Load model metadata from JSON
with open(MODEL_DIR / "model_metadata.json", "r") as file:
    metadata = json.load(file)


FEATURE_COLUMNS = metadata["feature_columns"]

LR_THRESHOLD = metadata["selected_threshold"]

print("All ML models loaded successfully!")


# ==========================================
# 4. DEFINE INPUT DATA STRUCTURE
# ==========================================

class EnvironmentalData(BaseModel):

    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)

    temperature_c: float = Field(ge=-60, le=60)
    relative_humidity_pct: float = Field(ge=0, le=100)
    wind_speed_kmh: float = Field(ge=0, le=250)

    rainfall_mm: float = Field(ge=0, le=1000)
    drought_index: float = Field(ge=0, le=1)
    vegetation_moisture_pct: float = Field(ge=0, le=100)

    month: int = Field(ge=1, le=12)
    day_of_year: int = Field(ge=1, le=366)


# ==========================================
# 5. HOME ROUTE
# ==========================================

@app.get("/")
def home():

    return {
        "message": "ForestGuard ML API is running!",
        "status": "success"
    }


@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": True}


# ==========================================
# 6. MODEL STATUS ROUTE
# ==========================================

@app.get("/models/status")
def model_status():

    return {
        "decision_tree": "Loaded",
        "random_forest": "Loaded",
        "logistic_regression": "Loaded"
    }


# ==========================================
# 7. PREDICTION ROUTE
# ==========================================

@app.post("/predict")
def predict_fire(data: EnvironmentalData):

    # Convert incoming input into dictionary
    input_data = data.model_dump()

    # Arrange features in the same order as training
    input_df = pd.DataFrame(
        [input_data],
        columns=FEATURE_COLUMNS
    )

    # Get fire probabilities from all models
    dt_probability = dt_model.predict_proba(input_df)[0][1]

    rf_probability = rf_model.predict_proba(input_df)[0][1]

    lr_probability = lr_model.predict_proba(input_df)[0][1]

    # Apply classification thresholds
    dt_prediction = int(dt_probability >= 0.5)

    rf_prediction = int(rf_probability >= 0.5)

    lr_prediction = int(lr_probability >= LR_THRESHOLD)

    # Prepare response
    return {

        "status": "success",

        "input_features": input_data,

        "predictions": {

            "decision_tree": {
                "fire_probability": round(float(dt_probability), 4),
                "prediction": dt_prediction,
                "result": "Fire" if dt_prediction == 1 else "No Fire"
            },

            "random_forest": {
                "fire_probability": round(float(rf_probability), 4),
                "prediction": rf_prediction,
                "result": "Fire" if rf_prediction == 1 else "No Fire"
            },

            "logistic_regression": {
                "fire_probability": round(float(lr_probability), 4),
                "threshold": LR_THRESHOLD,
                "prediction": lr_prediction,
                "result": "Fire" if lr_prediction == 1 else "No Fire"
            }

        }

    }



# ==========================================
# 8. DECISION TREE ANALYSIS ROUTE
# ==========================================

@app.get("/models/decision-tree/analysis")
def decision_tree_analysis():

    # Check whether analysis file exists
    if not DECISION_TREE_ANALYSIS_FILE.exists():
        return {
            "status": "error",
            "message": "Decision Tree analysis file not found."
        }

    # Load analysis JSON
    with open(DECISION_TREE_ANALYSIS_FILE, "r") as file:
        analysis_data = json.load(file)

    return {
        "status": "success",
        "analysis": analysis_data
    }


@app.get("/models/random-forest/analysis")
def random_forest_analysis():
    analysis_path = MODEL_DIR / "random_forest_analysis.json"

    if not analysis_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Random Forest analysis file not found"
        )

    with open(analysis_path, "r") as file:
        analysis = json.load(file)

    return {
        "status": "success",
        "analysis": analysis
    }



@app.get("/models/logistic-regression/analysis")
def logistic_regression_analysis():

    analysis_path = MODEL_DIR / "logistic_regression_analysis.json"

    if not analysis_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Logistic Regression analysis file not found"
        )

    with open(analysis_path, "r") as file:
        analysis = json.load(file)

    return {
        "status": "success",
        "analysis": analysis
    }
