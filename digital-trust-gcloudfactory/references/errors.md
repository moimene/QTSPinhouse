# Códigos HTTP esperados
Basados en la guía de API HTTP standards.

## Éxito
- 200 OK — petición correcta.
- 201 Created — recurso creado.
- 202 Accepted — proceso asíncrono en curso.

## Errores del cliente
- 400 Bad Request — validaciones o sintaxis.
- 401 Unauthorized — falta token o no autorizado.
- 403 Forbidden — credenciales insuficientes.
- 404 Not Found — recurso inexistente.
- 409 Conflict — estado actual impide la operación (reintentar tras resolver conflicto).

## Errores del servidor
- 500 Internal Server Error — error genérico no específico.
- 503 Service Unavailable — servicio caído temporalmente.
