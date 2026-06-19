const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000/api';

export const env = {
  apiUrl,
  storageUrl: apiUrl.replace(/\/api$/, '/storage'),
  appEnv: (import.meta.env.VITE_APP_ENV as string | undefined) ?? 'development',
  isDev: import.meta.env.DEV as boolean,
  isProd: import.meta.env.PROD as boolean,
} as const;
