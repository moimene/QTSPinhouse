# Autenticación y entornos

## Pre-requisitos
- Registrar cuenta developer y solicitar `client_id`, `client_secret` y `login_url` proporcionados por el equipo de Digital Trust.
- Elegir entorno:
  - INT: `https://api.int.gcloudfactory.com/digital-trust/api`
  - PRE: `https://api.pre.gcloudfactory.com/digital-trust`

## Obtener token (client_credentials)
```
POST https://{login_url}?grant_type=client_credentials&client_id={{CLIENT_ID}}&client_secret={{CLIENT_SECRET}}&scope=token
```
Headers: `Accept: application/json`

### Ejemplo con curl
```bash
curl -s -X POST "${LOGIN_URL}?grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&scope=token" \
  -H "Accept: application/json" \
  | python3 -c "import sys, json; d=json.load(sys.stdin); print(d)"
```

Respuesta típica (campos relevantes):
- `access_token`: úsalo en `Authorization: Bearer <token>`
- `token_type`: suele ser `bearer`
- `expires_in`: segundos de validez

## Headers obligatorios
- `Authorization: Bearer <access_token>`
- `Accept: application/json`
- Para POST/PATCH: `Content-Type: application/json`

## Sugerencias
- Guarda `expires_in` y refresca antes de que caduque.
- Si recibes 401/403, revisa token, scopes y entorno (INT vs PRE).
