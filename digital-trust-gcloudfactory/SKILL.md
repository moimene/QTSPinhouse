---
name: digital-trust-gcloudfactory
description: "Integración con la API Digital Trust de GCloudFactory: autenticación OAuth2 client_credentials y operaciones core (case-files, evidencias, reportes, sign-file, webhooks) en entornos INT/PRE. Úsalo cuando necesites construir, probar o depurar llamadas a `/api/v1/private/*` de Legal App Factory."
---

# Digital Trust Gcloudfactory

## Overview
Guía compacta para autenticarse y operar la API Digital Trust (Legal App Factory) de GCloudFactory: elegir entorno (INT/PRE), obtener token y ejecutar operaciones de case files, evidencias, reportes, firmado (`sign-file`) y webhooks.

## Quick Start
1) Elige entorno base (INT: `https://api.int.gcloudfactory.com/digital-trust/api`, PRE: `https://api.pre.gcloudfactory.com/digital-trust`).  
2) Obtén credenciales (`client_id`, `client_secret`, `login_url`).  
3) Pide token `client_credentials` (ver `references/auth.md` o `scripts/get_token.py`).  
4) Incluye headers: `Authorization: Bearer <token>`, `Accept: application/json`; para POST/PATCH añade `Content-Type: application/json`.  
5) Llama a rutas `/api/v1/private/...` según la sección de abajo o `references/endpoints.md`.

## Playbook por tarea
### Case files y evidencias
- Crear caso → `POST /api/v1/private/case-files`; guarda `caseFileId`.
- Crear evidence group → `POST /api/v1/private/case-files/{caseFileId}/evidence-groups`.
- Registrar evidencia → `POST /api/v1/private/case-files/{caseFileId}/evidence-groups/{evidenceGroupId}/evidences`; si necesitas binarios, solicita `upload-url` y usa multipart.
- Descargar/thumbnail → `download-url` / `thumbnail-url/{size}`.
- Cerrar grupo → `POST .../evidence-groups/{id}/close`.
- Reportes de caso → `GET .../reports`, `/report-preview`, `/reports/{reportId}/document|package`.

### Firmado de archivos
- `POST /api/v1/private/sign-file` para iniciar; recupera `fileId`.
- `GET /api/v1/private/sign-file/{fileId}/download-url` para obtener el archivo firmado.

### Webhooks
- Configura consumer para `doc-manager/file-uploaded` y eventos `testifier` (hash timestamped / failed).
- Si necesitas validación de firma/HMAC, coordina con el proveedor (no descrito en el spec público).

## Utilidades del skill
- `scripts/get_token.py`: obtiene y muestra el token usando env vars `LOGIN_URL`, `CLIENT_ID`, `CLIENT_SECRET` (opcional `SCOPE`).  
  Ejemplo: `LOGIN_URL=... CLIENT_ID=... CLIENT_SECRET=... ./scripts/get_token.py`
- `references/auth.md`: flujo de login y headers estándar.
- `references/endpoints.md`: lista de rutas clave por dominio.
- `references/errors.md`: tabla rápida de códigos HTTP esperados.
- `assets/digital-trust-api-1.0.yml`: OpenAPI oficial para generar clientes/tipos.

## Consejos de operación
- Paginación/filtros: los listados aceptan filtros; revisa el OpenAPI para parámetros exactos.
- Tiempos: maneja `202 Accepted` en procesos asíncronos (p.ej., generación de reportes).
- Errores: consulta `references/errors.md` para respuestas comunes; reintenta solo operaciones idempotentes.
