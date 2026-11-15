"""Direct Vercel function route for forest-fire predictions."""

import json
from http.server import BaseHTTPRequestHandler

from ml_service.api import EnvironmentalData, predict_fire


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(content_length))
            result = predict_fire(EnvironmentalData.model_validate(payload))
            self._send_json(200, result)
        except (json.JSONDecodeError, ValueError) as error:
            self._send_json(422, {"detail": str(error)})
        except Exception:
            self._send_json(500, {"detail": "Prediction failed while running the trained models."})

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
