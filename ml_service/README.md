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

For a deployed website or phone, deploy this service on a Python host and set `NEXT_PUBLIC_ML_API_URL` in the frontend host to this service's public HTTPS URL (for example, `https://forestguard-api.example.com`). Rebuild/redeploy the frontend after setting it because Next.js embeds public environment variables at build time. The API accepts requests from all browser origins by default; set `FORESTGUARD_CORS_ORIGINS` to a comma-separated allowlist to restrict access.

The `/health` route reports service status, `/models/status` reports loaded models, and `/docs` provides the interactive API documentation.

The prediction estimates come from a synthetic educational dataset. They are uncalibrated and are not real-world wildfire warnings.
