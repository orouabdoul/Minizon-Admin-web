const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'https://minizon-api-iubm.onrender.com/api';
const baseUrl = apiUrl.replace(/\/api$/, '');   // https://minizon-api.onrender.com

export const env = {
  apiUrl,
  baseUrl,
  storageUrl: `${baseUrl}/storage`,
  appEnv:  (import.meta.env.VITE_APP_ENV as string | undefined) ?? 'development',
  isDev:   import.meta.env.DEV  as boolean,
  isProd:  import.meta.env.PROD as boolean,
} as const;
