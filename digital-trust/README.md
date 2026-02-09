# MCP Server – Digital Trust (GCloudFactory)

Servidor MCP para invocar la API Digital Trust / Legal App Factory.

## Requisitos
- Node 22+ (trae `fetch` y `AbortSignal.timeout`).
- Variables de entorno (ver `.env.example`):
  - `BASE_URL` (INT o PRE)
  - `LOGIN_URL`, `CLIENT_ID`, `CLIENT_SECRET`, `SCOPE`
  - `TIMEOUT_MS` (opcional)

## Instalación
```
npm install
```

## Build y ejecución
```
npm run build
node dist/index.js   # expone MCP por stdio
```
Modo dev (ts-node):
```
npm run dev
```

## Generar tipos/validaciones desde OpenAPI
```
npm run generate:openapi
```
- Usa `openapi-zod-client` contra el spec en `../../digital-trust-gcloudfactory/assets/digital-trust-api-1.0.yml` y exporta esquemas Zod en `src/gen/client.ts`.

## Herramientas expuestas
- `login`: obtiene `access_token` vía client_credentials.
- `caseFiles.list` | `caseFiles.create` | `caseFiles.get`.
- `evidences.create`: POST con validación Zod (`RegisterEvidenceRequestModel`).
- `evidences.uploadUrl` / `evidences.downloadUrl`: rutas con caseFileId + evidenceGroupId + evidenceId.
- `evidences.uploadUrlById` / `evidences.downloadUrlById`: rutas directas por evidenceId.
- `signFile.create` + `signFile.downloadUrl` (usa `SignFileRequestModel`).
- `reports.createForCase`: POST `/case-files/{caseFileId}/reports` (usa `CaseFileReportRequestModel`).
- `reports.document` | `reports.package` | `reports.delete`.
- `reports.case.document` | `reports.case.package` (descargas base64 de PDF/ZIP).
- `webhooks.verifyHmac`: verificación HMAC configurable (sha256/sha1).

Todas las tools (excepto `login`) requieren `token` en la entrada. Llama `login` primero y reutiliza `access_token`.

## Ejemplo (payload para cliente MCP)
```
{
  "name": "evidences.uploadUrl",
  "arguments": {
    "token": "<ACCESS_TOKEN>",
    "baseUrl": "https://api.int.gcloudfactory.com/digital-trust/api",
    "caseFileId": "<uuid>",
    "evidenceGroupId": "<uuid>",
    "evidenceId": "<uuid>",
    "body": { "fileName": "test.pdf", "fileSize": 12345 }
  }
}
```

## Próximos pasos
- Añadir endpoints de Chat Manager y Notification Manager cuando dispongamos de sus especificaciones OpenAPI.
- Ajustar verificación de webhooks al esquema oficial de cabeceras/firma cuando el proveedor lo comparta.
