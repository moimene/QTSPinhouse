# Endpoints principales (API v1 Private)
Las rutas son relativas a la base elegida (INT/PRE). Sustituye los identificadores `{...}`.

## Case Files
- `GET /api/v1/private/case-files` — listar/buscar con filtros.
- `POST /api/v1/private/case-files` — crear caso.
- `PATCH /api/v1/private/case-files` — actualizar campos masivos.
- `GET /api/v1/private/case-files/{caseFileId}` — obtener caso.
- `PATCH /api/v1/private/case-files/{caseFileId}` — actualizar caso puntual.
- `GET /api/v1/private/case-files/{caseFileId}/status` — ver estado.
- `GET /api/v1/private/case-files/{caseFileId}/relationship` — ver relaciones.
- `GET /api/v1/private/case-files/{caseFileId}/report-preview` — previsualizar reporte.
- `GET /api/v1/private/case-files/{caseFileId}/reports` — listar reportes.
- `GET /api/v1/private/case-files/{caseFileId}/reports/{reportId}/document` — PDF.
- `GET /api/v1/private/case-files/{caseFileId}/reports/{reportId}/package` — ZIP.

## Evidence Groups
- `POST /api/v1/private/case-files/{caseFileId}/evidence-groups` — crear grupo.
- `GET /api/v1/private/case-files/{caseFileId}/evidence-groups/{evidenceGroupId}` — detalle.
- `PATCH /api/v1/private/case-files/{caseFileId}/evidence-groups/{evidenceGroupId}` — actualizar.
- `DELETE /api/v1/private/case-files/{caseFileId}/evidence-groups/{evidenceGroupId}` — descartar.
- `POST /api/v1/private/case-files/{caseFileId}/evidence-groups/{evidenceGroupId}/close` — cerrar grupo.

## Evidences
- `POST /api/v1/private/case-files/{caseFileId}/evidence-groups/{evidenceGroupId}/evidences` — registrar evidencia.
- `GET /api/v1/private/case-files/{caseFileId}/evidence-groups/{evidenceGroupId}/evidences/{evidenceId}` — detalle.
- `DELETE /api/v1/private/case-files/{caseFileId}/evidence-groups/{evidenceGroupId}/evidences/{evidenceId}` — eliminar.
- `GET /api/v1/private/case-files/{caseFileId}/evidence-groups/{evidenceGroupId}/evidences/{evidenceId}/download-url` — URL de descarga.
- `POST /api/v1/private/case-files/{caseFileId}/evidence-groups/{evidenceGroupId}/evidences/{evidenceId}/upload-url` — URL de subida.
- `GET /api/v1/private/case-files/{caseFileId}/evidence-groups/{groupId}/evidences/{evidenceId}/thumbnail-url/{thumbnailSize}` — thumbnail.

## Reports (global)
- `GET /api/v1/private/reports/{reportId}/document` — PDF de reporte.
- `GET /api/v1/private/reports/{reportId}/package` — ZIP de reporte.
- `DELETE /api/v1/private/reports/{reportId}` — eliminar reporte.

## Signature / Files
- `POST /api/v1/private/sign-file` — iniciar firmado de archivo.
- `GET /api/v1/private/sign-file/{fileId}/download-url` — URL de descarga del archivo firmado.

## Uploads temporales
- `POST /api/v1/private/uploads/{evidenceId}/{fileName}` — URL multipart upload temporal.
- `GET|POST|DELETE /api/v1/private/uploads/{evidenceId}/{filename}/{uploadId}` — completar/gestionar multipart upload.

## Webhooks
- `POST /api/v1/webhook/doc-manager/file-uploaded` — notificación de archivo subido.
- `POST /api/v1/webhook/testifier/hash-timestamped` — hash sellado.
- `POST /api/v1/webhook/testifier/hash-timestamping-failed` — fallo de sellado.
