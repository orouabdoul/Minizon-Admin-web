let _token: string | null = null;

export const tokenStore = {
  get: () => _token,
  set: (token: string) => { _token = token; },
  clear: () => { _token = null; },
};
