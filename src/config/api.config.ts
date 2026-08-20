import { env } from './env';

export const apiConfig = {
  baseURL: env.apiUrl,
  timeout: 60_000,  // 60s — Render free tier cold start can take 50+ seconds
  headers: {
    'Content-Type': 'application/json',
  },
} as const;
