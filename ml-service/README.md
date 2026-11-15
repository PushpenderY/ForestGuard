# ForestGuard ML Service

This service adds ML predictions alongside the existing JavaScript rule-based predictor. The existing predictor is intentionally retained.

## Models
- Decision Tree
- Random Forest
- Logistic Regression

All three classifiers receive the same ten environmental features and return separate class predictions, estimated fire scores, and risk bands.

## Features
latitude, longitude, temperature_c, relative_humidity_pct, wind_speed_kmh, rainfall_mm, drought_index, vegetation_moisture_pct, month, day_of_year.

## Windows setup
```powershell
cd ml-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python train_models.py --data ..\forest_fire_environmental_dataset_clean.csv
uvicorn main:app --reload --port 8000
```

Open http://localhost:8000/docs for interactive API testing.

## API
POST /predict accepts one shared environmental input and returns results for all three models. GET /health checks whether the model artifact loaded.

## Dataset and limitations
The supplied dataset is synthetic and imbalanced. It is appropriate for demonstrating preprocessing, training, evaluation, and model-serving workflows, but not for real-world wildfire warnings. The returned probabilities are uncalibrated model estimates, not validated real-world fire probabilities. Evaluate recall, precision, F1, and ROC-AUC rather than accuracy alone. Before operational use, validate on real, geographically and temporally independent fire records and calibrate probabilities.
