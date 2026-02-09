import { TokenResponse, ClientConfig, Json } from './types.js';

const DEFAULT_TIMEOUT = 10_000;

export class DigitalTrustClient {
  private baseUrl: string;
  private token?: string;
  private timeoutMs: number;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.token = config.token;
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT;
  }

  setToken(token: string) {
    this.token = token;
  }

  async login(params: {
    loginUrl: string;
    clientId: string;
    clientSecret: string;
    scope?: string;
  }): Promise<TokenResponse> {
    const scope = params.scope ?? 'token';
    const url = new URL(params.loginUrl);
    url.searchParams.set('grant_type', 'client_credentials');
    url.searchParams.set('client_id', params.clientId);
    url.searchParams.set('client_secret', params.clientSecret);
    url.searchParams.set('scope', scope);

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Login failed (${res.status}): ${text}`);
    }
    const data = (await res.json()) as TokenResponse;
    this.token = data.access_token;
    return data;
  }

  async get(path: string, query?: Record<string, string | number | boolean | undefined>) {
    const url = new URL(this.baseUrl + path);
    if (query) {
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined) url.searchParams.set(k, String(v));
      });
    }
    return this.request('GET', url.toString());
  }

  async post(path: string, body?: Json) {
    const url = this.baseUrl + path;
    return this.request('POST', url, body);
  }

  async patch(path: string, body?: Json) {
    const url = this.baseUrl + path;
    return this.request('PATCH', url, body);
  }

  async delete(path: string) {
    const url = this.baseUrl + path;
    return this.request('DELETE', url);
  }

  async getBinary(path: string) {
    if (!this.token) throw new Error('Missing bearer token. Call login() first or set token.');
    const url = this.baseUrl + path;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/octet-stream',
        Authorization: `Bearer ${this.token}`,
      },
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    const arrayBuf = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    const base64 = Buffer.from(arrayBuf).toString('base64');
    return { contentType, base64 };
  }

  private async request(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', url: string, body?: Json) {
    if (!this.token) throw new Error('Missing bearer token. Call login() first or set token.');

    const headers: Record<string, string> = {
      Accept: 'application/json',
      Authorization: `Bearer ${this.token}`,
    };
    let payload: string | undefined;
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    const res = await fetch(url, {
      method,
      headers,
      body: payload,
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const text = await res.text();
    const parsed = isJson && text ? safeJson(text) : text;

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
    }
    return parsed;
  }
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
