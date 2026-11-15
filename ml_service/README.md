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

For the Vercel deployment, the root `api/index.py` exposes this FastAPI app at `/api/*` on the same HTTPS domain as the Next.js website. No CORS or public API URL setting is needed. Production frontend requests always use this same-origin path. Check `/api/health` after deployment.

The `/health` route reports service status, `/models/status` reports loaded models, and `/docs` provides the interactive API documentation.

The prediction estimates come from a synthetic educational dataset. They are uncalibrated and are not real-world wildfire warnings.
