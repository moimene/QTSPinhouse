# Digital Trust MCP + Skill (GCloudFactory)

![GitHub release](https://img.shields.io/github/v/release/moimene/QTSPinhouse?label=release) ![License](https://img.shields.io/github/license/moimene/QTSPinhouse) ![Node](https://img.shields.io/badge/node-%E2%89%A522.x-brightgreen) ![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-blue) ![MCP](https://img.shields.io/badge/MCP-ready-purple)

Integración lista para usar con la API Digital Trust / Legal App Factory: incluye un Skill para agentes y un servidor MCP en Node/TypeScript con validación automática a partir del OpenAPI oficial.

## ¿Qué es Digital Trust / Legal App Factory?
- **Evidence Manager**: gestiona expedientes (`case-files`), grupos de evidencia y evidencias; permite subir/descargar ficheros, generar thumbnails y sellar la cadena de custodia.
- **Reportes**: genera PDF/ZIP con la evidencia consolidada; soporta previsualizaciones.
- **Signature Manager**: flujo de firma de archivos (`sign-file`) con URL de descarga del documento firmado.
- **Webhooks**: notificaciones cuando se suben ficheros o se completa el sellado de hash.
- **Entornos**: INT (sandbox) y PRE (preproducción). Base-paths y login URL cambian por entorno.

## Problema que resuelve
Muchas organizaciones necesitan recopilar y custodiar evidencias digitales (documentos, fotos, videos, capturas web), generar reportes y firmarlos para trámites legales o de compliance. Hacerlo a mano implica riesgo de errores (subidas sin trazabilidad, formatos inconsistentes, tokens caducados, rutas mal formadas).  
Este repo entrega:
- Un **Skill** que guía a un agente/LLM sobre cómo autenticar, elegir entorno y llamar a los endpoints correctos.
- Un **MCP server** que expone herramientas tipadas y validadas (Zod + OpenAPI) para automatizar llamadas sin redescubrir la API en cada proyecto.

### Casos de uso concretos donde integrar el MCP
- **Onboarding de clientes con documentación legal**: crear un expediente, subir documentos firmados, generar reporte PDF y devolverlo al CRM.
- **Investigaciones internas / auditoría**: agrupar evidencias (capturas, logs, videos), generar paquete ZIP y compartir vía download-url segura.
- **Flujos de firma**: subir un archivo, iniciar `sign-file` y entregar al usuario la URL del documento firmado.
- **Automatizaciones de backoffice**: disparar webhooks en cargas masivas y verificar integridad con `verifyHmac` antes de procesar.
- **Bots/Agentes que asisten a analistas**: el agente usa las tools MCP en tiempo real para crear/consultar expedientes sin que el analista recuerde la API.

## Qué es esto
- **Skill `digital-trust-gcloudfactory`**: guía de uso, referencias de auth/endpoints y OpenAPI para que agentes trabajen con case files, evidencias, reportes y firma de archivos.
- **MCP server `digital-trust`**: expone herramientas sobre stdio para consumir la API (login, case-files, evidences, reports, sign-file, webhooks).

## Enlaces de producto y documentación
- Landing comercial: https://legal-leap-page.lovable.app/
- Portal técnico: https://digitaltrust.gcloudfactory.com/index.html
- Getting started (auth): https://digitaltrust.gcloudfactory.com/getting-started.html
- HTTP standards (headers, base-paths): https://digitaltrust.gcloudfactory.com/api-http-standars.html
- Swagger UI: https://api.gcloudfactory.com/digital-trust/swagger-ui/
- OpenAPI incluido en este repo: `digital-trust-gcloudfactory/assets/digital-trust-api-1.0.yml`

## Estructura del repo
```
./digital-trust-gcloudfactory/   # Skill (SKILL.md, referencias, OpenAPI, script de token)
./digital-trust/                 # MCP server (Node/TS, Zod generado desde OpenAPI)
```

## Flujos habituales (alto nivel)
1) **Autenticarse**: obtener `access_token` con client_credentials (herramienta MCP `login` o script `get_token.py`).
2) **Crear expediente**: `caseFiles.create` → obtén `caseFileId`.
3) **Agregar evidencia**:
   - Crear grupo: `evidence-group` (incluido en case file).
   - Registrar evidencia: `evidences.create`.
   - Subir archivo: pedir `evidences.uploadUrl` (URL prefirmada) y subir el binario al storage que devuelve.
4) **Generar reporte**: `reports.createForCase`, luego descargar PDF/ZIP con `reports.document` o `reports.package`.
5) **Firmar archivo**: `signFile.create` y obtener `signFile.downloadUrl`.
6) **Escuchar eventos**: implementar webhooks `doc-manager/file-uploaded` y `testifier/hash-timestamped`.

## MCP: instalación y uso rápido
Requisitos: Node 22+, npm.
```
cd digital-trust
npm install
npm run generate:openapi   # opcional; regenera los esquemas Zod desde el OpenAPI
npm run build
npm start                  # expone el MCP por stdio
# o modo dev
npm run dev
```

Config (.env, ver `.env.example`):
```
BASE_URL=https://api.int.gcloudfactory.com/digital-trust/api   # o PRE
LOGIN_URL=https://auth.int.gcloudfactory.com/oauth/token       # provisto por Digital Trust
CLIENT_ID=xxx
CLIENT_SECRET=yyy
SCOPE=token
TIMEOUT_MS=10000
```

### Herramientas MCP disponibles (mapeo a funcionalidades)
- Autenticación: `login`
- Expedientes: `caseFiles.list | create | get`
- Evidencias: `evidences.create | uploadUrl | downloadUrl | uploadUrlById | downloadUrlById`
- Firma: `signFile.create | signFile.downloadUrl`
- Reportes: `reports.createForCase | reports.document | reports.package | reports.delete | reports.case.document | reports.case.package`
- Webhooks utilitarios: `webhooks.verifyHmac` (prefijo opcional, sha256/sha1)

Notas:
- `login`
- Las descargas PDF/ZIP se devuelven como JSON `{ contentType, base64 }` para que el cliente MCP las decodifique.
- Las peticiones se validan con Zod generado desde el OpenAPI para reducir errores de contrato.

### Ejemplo de integración (payload MCP)
Subir evidencia (solicitar URL de subida y luego usar la URL prefirmada):
```json
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
Crear reporte y descargar PDF:
```json
{
  "name": "reports.createForCase",
  "arguments": {
    "token": "<ACCESS_TOKEN>",
    "caseFileId": "<uuid>",
    "body": { "reportType": "SUMMARY", "title": "QA Report" }
  }
}
```
```json
{
  "name": "reports.document",
  "arguments": { "token": "<ACCESS_TOKEN>", "reportId": "<reportId>" }
}
```

## Skill (para agentes)
- `SKILL.md` describe flujo de auth, base-paths INT/PRE y tareas por dominio.
- Referencias listas para cargar bajo demanda: `references/auth.md`, `endpoints.md`, `errors.md`.
- Script: `scripts/get_token.py` (login con client_credentials).

## Roadmap
- Añadir endpoints de Chat Manager y Notification Manager cuando se disponga de sus OpenAPI.
- Ajustar verificación de webhooks al esquema oficial de cabeceras/firma cuando el proveedor lo comparta.
- Opcional: soporte de streaming binario si el cliente MCP lo requiere.
