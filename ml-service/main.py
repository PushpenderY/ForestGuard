from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

MODEL_PATH = Path(__file__).resolve().parent / "artifacts" / "forestguard_models.joblib"
bundle = joblib.load(MODEL_PATH) if MODEL_PATH.exists() else None

app = FastAPI(title="ForestGuard ML Prediction API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to the deployed frontend origin before production.
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class EnvironmentalInput(BaseModel):
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


def risk_level(probability):
    if probability >= 0.75:
        return "EXTREME"
    if probability >= 0.50:
        return "HIGH"
    if probability >= 0.25:
        return "MODERATE"
    return "LOW"


@app.get("/health")
def health():
    return {
        "status": "ok",
        "models_loaded": bundle is not None,
        "model_names": list(bundle["models"]) if bundle else []
    }


@app.post("/predict")
def predict(payload: EnvironmentalInput):
    if bundle is None:
        raise HTTPException(503, "Model artifact missing. Run train_models.py first.")

    row = pd.DataFrame([payload.model_dump()], columns=bundle["features"])
    results = {}
    for name, model in bundle["models"].items():
        probability = float(model.predict_proba(row)[0][1])
        prediction = int(model.predict(row)[0])
        results[name] = {
            "prediction": prediction,
            "label": "FIRE" if prediction else "NO FIRE",
            "fire_probability": round(probability * 100, 2),
            "risk_level": risk_level(probability)
        }

    return {
        "models": results,
        "note": (
            "Probabilities are uncalibrated estimates from a synthetic educational dataset; "
            "not validated real-world wildfire probabilities or emergency alerts."
        )
    }
