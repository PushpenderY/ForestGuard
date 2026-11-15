"""Direct Vercel function route for logistic-regression analysis."""

import json
from http.server import BaseHTTPRequestHandler

from ml_service.api import logistic_regression_analysis


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self._send_json(logistic_regression_analysis())

    def _send_json(self, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
