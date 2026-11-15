"""Direct Vercel function health route."""

import json
from http.server import BaseHTTPRequestHandler

from ml_service.api import health


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = json.dumps(health()).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
