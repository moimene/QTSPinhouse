# Digital Trust MCP + Skill (GCloudFactory)

Repositorio listo para publicar en GitHub que empaqueta:
- **Skill** `digital-trust-gcloudfactory` para Codex/Antigravity (instrucciones, referencias y OpenAPI).
- **MCP server** `mcp/digital-trust` para invocar la API Digital Trust / Legal App Factory.

## Estructura
```
./digital-trust-gcloudfactory/       # Skill con SKILL.md, referencias y OpenAPI
./digital-trust/                     # MCP server Node/TypeScript
```

## Documentación oficial de la API
- Portal: https://digitaltrust.gcloudfactory.com/index.html
- Getting started (auth): https://digitaltrust.gcloudfactory.com/getting-started.html
- HTTP standards (headers, base-paths): https://digitaltrust.gcloudfactory.com/api-http-standars.html
- Swagger UI: https://api.gcloudfactory.com/digital-trust/swagger-ui/
- OpenAPI usado en este repo: `digital-trust-gcloudfactory/assets/digital-trust-api-1.0.yml`

## Skill (digital-trust-gcloudfactory)
- Frontmatter descriptivo + guía de uso rápido.
- Referencias: autenticación, endpoints clave, códigos de error.
- Script utilitario: `scripts/get_token.py` (client_credentials).

## MCP Server (digital-trust)
- Node 22+, TypeScript.
- Herramientas expuestas (todas con validación Zod generada desde OpenAPI):
  - `login`
  - `caseFiles.list | create | get`
  - `evidences.create | uploadUrl | downloadUrl | uploadUrlById | downloadUrlById`
  - `signFile.create | signFile.downloadUrl`
  - `reports.createForCase | reports.document | reports.package | reports.delete | reports.case.document | reports.case.package`
  - `webhooks.verifyHmac` (prefijo de firma opcional, sha256/sha1)
- Descargas de PDF/ZIP se devuelven en JSON `{ contentType, base64 }` para que el cliente MCP decodifique.

### Configuración
Variables en `.env` (ver `.env.example`):
```
BASE_URL=https://api.int.gcloudfactory.com/digital-trust/api   # o PRE
LOGIN_URL=https://auth.int.gcloudfactory.com/oauth/token       # provisto por Digital Trust
CLIENT_ID=xxx
CLIENT_SECRET=yyy
SCOPE=token
TIMEOUT_MS=10000
```

### Instalación y build
```
cd digital-trust
npm install
npm run generate:openapi   # (si se quiere regenerar Zod desde el spec)
npm run build
npm start                  # expone MCP por stdio
# o modo dev
npm run dev
```

### Ejemplo de llamada (payload MCP)
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

## Publicación en GitHub
1. Posiciónate en este directorio: `cd /Users/moisesmenendez/Dropbox/Codigo/agent/digital-trust-mcp`
2. Inicializa git y agrega remoto de tu repo:
```
git init
git add .
git commit -m "feat: add digital-trust skill and mcp server"
git remote add origin git@github.com:<tu_usuario>/<repo>.git
git push -u origin main
```

## Pendientes opcionales
- Añadir endpoints de Chat Manager y Notification Manager cuando tengamos sus OpenAPI.
- Ajustar verificación de webhooks a las cabeceras/algoritmo oficiales cuando el proveedor lo comparta.
- Soporte de streaming binario si el cliente MCP lo requiere.
