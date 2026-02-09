#!/usr/bin/env python3
"""Simple client_credentials login for Digital Trust.

Environment variables required:
- LOGIN_URL (provided by Digital Trust team)
- CLIENT_ID
- CLIENT_SECRET
Optional:
- SCOPE (default: token)
"""
import json
import os
import sys
import urllib.parse
import urllib.request

login_url = os.getenv("LOGIN_URL")
client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")
scope = os.getenv("SCOPE", "token")

missing = [name for name, val in {
    "LOGIN_URL": login_url,
    "CLIENT_ID": client_id,
    "CLIENT_SECRET": client_secret,
}.items() if not val]

if missing:
    sys.stderr.write(f"Missing env vars: {', '.join(missing)}\n")
    sys.stderr.write("Usage: LOGIN_URL=... CLIENT_ID=... CLIENT_SECRET=... [SCOPE=token] ./get_token.py\n")
    sys.exit(1)

params = {
    "grant_type": "client_credentials",
    "client_id": client_id,
    "client_secret": client_secret,
    "scope": scope,
}
url = f"{login_url}?{urllib.parse.urlencode(params)}"
req = urllib.request.Request(url, method="POST", headers={"Accept": "application/json"})

try:
    with urllib.request.urlopen(req) as resp:
        payload = resp.read()
        content_type = resp.headers.get("Content-Type", "")
        if "application/json" in content_type:
            data = json.loads(payload.decode("utf-8"))
            print(json.dumps(data, indent=2))
        else:
            sys.stdout.buffer.write(payload)
except Exception as exc:  # keep simple for CLI use
    sys.stderr.write(f"Request failed: {exc}\n")
    sys.exit(2)
