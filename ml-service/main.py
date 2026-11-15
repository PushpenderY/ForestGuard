"""FastAPI inference endpoint returning separate outputs for every ML model."""
from pathlib import Path
from typing import Dict
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE = Path(__file__).resolve().parent
MODEL_PATH = BASE / "artifacts" / "forestguard_models.joblib"
bundle = joblib.load(MODEL_PATH) if MODEL_PATH.exists() else None

app = FastAPI(title="ForestGuard ML Prediction API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to the production frontend origin before public deployment.
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

def risk_level(p):
    if p >= 0.75: return "EXTREME"
    if p >= 0.50: return "HIGH"
    if p >= 0.25: return "MODERATE"
    return "LOW"

@app.get("/health")
def health():
    return {"status":"ok", "models_loaded":bundle is not None,
            "model_names":list(bundle["models"]) if bundle else []}

@app.post("/predict")
def predict(payload: EnvironmentalInput):
    if bundle is None:
        raise HTTPException(status_code=503, detail="Model bundle missing. Run train_models.py first.")
    row = pd.DataFrame([payload.model_dump()], columns=bundle["features"])
    results: Dict[str, dict] = {}
    for name, model in bundle["models"].items():
        probability = float(model.predict_proba(row)[0][1])
        prediction = int(model.predict(row)[0])
        results[name] = {
            "prediction":prediction,
            "label":"FIRE" if prediction else "NO FIRE",
            "fire_probability":round(probability * 100, 2),
            "risk_level":risk_level(probability),
        }
    return {"models":results,
            "note":"Uncalibrated model estimates from a synthetic educational dataset; not operational wildfire alerts."}
