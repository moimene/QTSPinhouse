import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { DigitalTrustClient } from './client.js';
import { Json } from './types.js';
import { schemas } from './gen/client.js';

const DEFAULT_BASE = process.env.BASE_URL || 'https://api.int.gcloudfactory.com/digital-trust/api';
const DEFAULT_TIMEOUT = parseInt(process.env.TIMEOUT_MS || '10000', 10);

const server = new McpServer({ name: 'digital-trust', version: '0.1.0' });

const loginSchema = z.object({
  loginUrl: z.string().url().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  scope: z.string().default('token'),
});

const baseSchema = z.object({
  baseUrl: z.string().url().optional(),
  token: z.string(),
  timeoutMs: z.number().int().positive().optional(),
});

function makeClient(input: { baseUrl?: string; token: string; timeoutMs?: number }) {
  const client = new DigitalTrustClient({
    baseUrl: input.baseUrl || DEFAULT_BASE,
    token: input.token,
    timeoutMs: input.timeoutMs || DEFAULT_TIMEOUT,
  });
  return client;
}

server.registerTool('login', {
  description: 'Obtiene access_token vía client_credentials',
  inputSchema: loginSchema,
}, async (args) => {
  const loginUrl = args.loginUrl || process.env.LOGIN_URL;
  const clientId = args.clientId || process.env.CLIENT_ID;
  const clientSecret = args.clientSecret || process.env.CLIENT_SECRET;
  if (!loginUrl || !clientId || !clientSecret) {
    throw new Error('loginUrl, clientId y clientSecret son obligatorios (env o argumentos)');
  }
  const client = new DigitalTrustClient({ baseUrl: DEFAULT_BASE, timeoutMs: DEFAULT_TIMEOUT });
  const token = await client.login({ loginUrl, clientId, clientSecret, scope: args.scope });
  return { content: [{ type: 'text', text: JSON.stringify(token, null, 2) }] };
});

server.registerTool('caseFiles.list', {
  description: 'Lista case-files con filtros opcionales',
  inputSchema: baseSchema.extend({ query: z.record(z.string(), z.any()).optional() }),
}, async (args) => {
  const client = makeClient(args);
  const result = await client.get('/api/v1/private/case-files', args.query as Record<string, string> | undefined);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('caseFiles.create', {
  description: 'Crea un case-file',
  inputSchema: baseSchema.extend({ body: schemas.CreateCaseFileRequestModel }),
}, async (args) => {
  const client = makeClient(args);
  const result = await client.post('/api/v1/private/case-files', args.body as Json);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('caseFiles.get', {
  description: 'Obtiene un case-file por ID',
  inputSchema: baseSchema.extend({ caseFileId: z.string() }),
}, async (args) => {
  const client = makeClient(args);
  const result = await client.get(`/api/v1/private/case-files/${args.caseFileId}`);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('evidences.create', {
  description: 'Registra una evidencia dentro de un evidence group',
  inputSchema: baseSchema.extend({
    caseFileId: z.string(),
    evidenceGroupId: z.string(),
    body: schemas.RegisterEvidenceRequestModel,
  }),
}, async (args) => {
  const client = makeClient(args);
  const path = `/api/v1/private/case-files/${args.caseFileId}/evidence-groups/${args.evidenceGroupId}/evidences`;
  const result = await client.post(path, args.body as Json);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('evidences.uploadUrl', {
  description: 'Genera upload-url para una evidencia (ruta caseFile/evidenceGroup/evidence)',
  inputSchema: baseSchema.extend({
    caseFileId: z.string(),
    evidenceGroupId: z.string(),
    evidenceId: z.string(),
    body: schemas.createUploadUrl_Body,
  }),
}, async (args) => {
  const client = makeClient(args);
  const path = `/api/v1/private/case-files/${args.caseFileId}/evidence-groups/${args.evidenceGroupId}/evidences/${args.evidenceId}/upload-url`;
  const result = await client.post(path, args.body as Json);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('evidences.downloadUrl', {
  description: 'Genera download-url para una evidencia (ruta caseFile/evidenceGroup/evidence)',
  inputSchema: baseSchema.extend({
    caseFileId: z.string(),
    evidenceGroupId: z.string(),
    evidenceId: z.string(),
  }),
}, async (args) => {
  const client = makeClient(args);
  const path = `/api/v1/private/case-files/${args.caseFileId}/evidence-groups/${args.evidenceGroupId}/evidences/${args.evidenceId}/download-url`;
  const result = await client.get(path);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('evidences.downloadUrlById', {
  description: 'Genera download-url para una evidencia por ID directo',
  inputSchema: baseSchema.extend({
    evidenceId: z.string(),
  }),
}, async (args) => {
  const client = makeClient(args);
  const path = `/api/v1/private/evidences/${args.evidenceId}/download-url`;
  const result = await client.get(path);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('evidences.uploadUrlById', {
  description: 'Genera upload-url para evidencia por ID directo',
  inputSchema: baseSchema.extend({
    evidenceId: z.string(),
    body: schemas.createUploadUrl_Body,
  }),
}, async (args) => {
  const client = makeClient(args);
  const path = `/api/v1/private/evidences/${args.evidenceId}/upload-url`;
  const result = await client.post(path, args.body as Json);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('signFile.create', {
  description: 'Inicia un proceso de firmado de archivo (sign-file)',
  inputSchema: baseSchema.extend({ body: schemas.SignFileRequestModel }),
}, async (args) => {
  const client = makeClient(args);
  const result = await client.post('/api/v1/private/sign-file', args.body as Json);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('signFile.downloadUrl', {
  description: 'Obtiene download-url de un archivo firmado',
  inputSchema: baseSchema.extend({ fileId: z.string() }),
}, async (args) => {
  const client = makeClient(args);
  const result = await client.get(`/api/v1/private/sign-file/${args.fileId}/download-url`);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('reports.createForCase', {
  description: 'Crea un reporte para un case-file',
  inputSchema: baseSchema.extend({
    caseFileId: z.string(),
    body: schemas.CaseFileReportRequestModel,
  }),
}, async (args) => {
  const client = makeClient(args);
  const path = `/api/v1/private/case-files/${args.caseFileId}/reports`;
  const result = await client.post(path, args.body as Json);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('reports.document', {
  description: 'Descarga el PDF de un reporte por ID (base64)',
  inputSchema: baseSchema.extend({
    reportId: z.string(),
  }),
}, async (args) => {
  const client = makeClient(args);
  const path = `/api/v1/private/reports/${args.reportId}/document`;
  const result = await client.getBinary(path);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('reports.package', {
  description: 'Descarga el ZIP de un reporte por ID (base64)',
  inputSchema: baseSchema.extend({
    reportId: z.string(),
  }),
}, async (args) => {
  const client = makeClient(args);
  const path = `/api/v1/private/reports/${args.reportId}/package`;
  const result = await client.getBinary(path);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('reports.delete', {
  description: 'Elimina un reporte por ID',
  inputSchema: baseSchema.extend({
    reportId: z.string(),
  }),
}, async (args) => {
  const client = makeClient(args);
  const path = `/api/v1/private/reports/${args.reportId}`;
  const result = await client.delete(path);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('webhooks.verifyHmac', {
  description: 'Verifica firma HMAC de un webhook (proporciona secret, payload y firma)',
  inputSchema: z.object({
    secret: z.string(),
    payload: z.string(),
    signature: z.string(),
    signaturePrefix: z.string().optional(), // ej: "sha256="
    algorithm: z.enum(['sha256', 'sha1']).default('sha256'),
  }),
}, async (args) => {
  const { createHmac } = await import('crypto');
  const provided = args.signaturePrefix
    ? args.signature.replace(args.signaturePrefix, '')
    : args.signature;
  const computed = createHmac(args.algorithm, args.secret).update(args.payload).digest('hex');
  const ok = timingSafeEqual(computed, provided);
  return { content: [{ type: 'text', text: JSON.stringify({ valid: ok, computed, provided: args.signature }, null, 2) }] };
});

server.registerTool('reports.case.document', {
  description: 'Descarga PDF de reporte de un case-file específico (base64)',
  inputSchema: baseSchema.extend({
    caseFileId: z.string(),
    reportId: z.string(),
  }),
}, async (args) => {
  const client = makeClient(args);
  const path = `/api/v1/private/case-files/${args.caseFileId}/reports/${args.reportId}/document`;
  const result = await client.getBinary(path);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.registerTool('reports.case.package', {
  description: 'Descarga ZIP de reporte de un case-file específico (base64)',
  inputSchema: baseSchema.extend({
    caseFileId: z.string(),
    reportId: z.string(),
  }),
}, async (args) => {
  const client = makeClient(args);
  const path = `/api/v1/private/case-files/${args.caseFileId}/reports/${args.reportId}/package`;
  const result = await client.getBinary(path);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

// Entrypoint
const transport = new StdioServerTransport();
server.connect(transport).catch((err) => {
  console.error('Failed to start MCP server', err);
  process.exit(1);
});
