import { useState, useCallback } from 'react';
import axios from 'axios';
import { authService } from '../services/auth_service';
import { storageService } from '../services/storage_service';
import type { LoginCredentials, AuthState } from '../models/auth.model';

export function useAuthController() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: !!storageService.get('access_token'),
    user: null,
    loading: false,
    error: null,
  });

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data } = await authService.login(credentials);
      storageService.set('access_token', data.body.token);
      setState({ isAuthenticated: true, user: data.body.user, loading: false, error: null });
      return true;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? 'Erreur de connexion')
        : 'Erreur de connexion';
      setState({ isAuthenticated: false, user: null, loading: false, error: message });
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout().catch(() => null);
    storageService.remove('access_token');
    setState({ isAuthenticated: false, user: null, loading: false, error: null });
  }, []);

  return { ...state, login, logout };
}
