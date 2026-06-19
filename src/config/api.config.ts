import { env } from './env';

export const apiConfig = {
  baseURL: env.apiUrl,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;
