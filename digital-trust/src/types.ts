export interface TokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
}

export interface ClientConfig {
  baseUrl: string;
  token?: string;
  timeoutMs?: number;
}

export type Json = Record<string, unknown>;
