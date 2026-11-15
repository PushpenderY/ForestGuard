# ForestGuard ML API

This FastAPI service serves the three pre-trained models without retraining them at startup. The model files and matching metadata in `models/` are required at runtime.

## Run locally

From the repository root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r ml_service/requirements.txt
uvicorn ml_service.api:app --host 0.0.0.0 --port 8000
```

Set `NEXT_PUBLIC_ML_API_URL` in the frontend deployment to the public HTTPS URL of this API (for example, `https://forestguard-api.example.com`). The API allows localhost frontend origins by default. Set `FORESTGUARD_CORS_ORIGINS` to a comma-separated list of deployed frontend origins.

The `/health` route reports service status, `/models/status` reports loaded models, and `/docs` provides the interactive API documentation.

The prediction estimates come from a synthetic educational dataset. They are uncalibrated and are not real-world wildfire warnings.
