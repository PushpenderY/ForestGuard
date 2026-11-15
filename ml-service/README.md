# ForestGuard ML Service

Separate Python inference service. The original JavaScript rule-based predictor remains active in the Next.js frontend.

## Models
- Decision Tree
- Random Forest
- Logistic Regression

All three models receive the same ten environmental features and return separate class predictions and estimated fire probabilities.

## Dataset
Place the cleaned file at:
`ml-service/data/forest_fire_environmental_dataset_clean.csv`

The cleaned CSV is supplied in the downloadable ForestGuard ML starter bundle. It contains 3,000 records after removing 12 exact duplicate rows and imputing missing numeric feature values with medians.

**Dataset limitation:** the supplied dataset is synthetic and imbalanced. It supports an educational ML demonstration, not operational wildfire prediction.

## Setup (Windows PowerShell)
```powershell
cd ml-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python train_models.py
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

Set the frontend environment variable if the API is hosted elsewhere:
`NEXT_PUBLIC_ML_API_URL=http://localhost:8000`

## POST /predict input
Send latitude, longitude, temperature_c, relative_humidity_pct, wind_speed_kmh, rainfall_mm, drought_index, vegetation_moisture_pct, month and day_of_year.

## Initial holdout results
Stratified 80/20 split, random_state=42:

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC |
|---|---:|---:|---:|---:|---:|
| Decision Tree | 0.7817 | 0.2642 | 0.7500 | 0.3907 | 0.7791 |
| Random Forest | 0.8967 | 0.4286 | 0.3214 | 0.3673 | 0.8333 |
| Logistic Regression | 0.7950 | 0.2810 | 0.7679 | 0.4115 | 0.8380 |

These are preliminary results from the supplied synthetic dataset. Do not choose a model based on accuracy alone; examine recall, precision, F1 and ROC-AUC. Probability outputs are uncalibrated model estimates and must not be presented as real-world fire chances.
