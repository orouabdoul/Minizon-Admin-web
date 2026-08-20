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
      // Handle multiple response envelope formats from the backend
      const raw   = data as any;
      const token = raw?.body?.token ?? raw?.token ?? raw?.access_token ?? raw?.data?.token;
      const user  = raw?.body?.user  ?? raw?.user  ?? raw?.data?.user  ?? null;
      if (!token) throw new Error('Token manquant dans la réponse du serveur');
      storageService.set('access_token', token);
      setState({ isAuthenticated: true, user, loading: false, error: null });
      return true;
    } catch (err) {
      let message = 'Erreur de connexion';
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          message = 'Le serveur met du temps à répondre (démarrage Render). Réessayez dans 30 secondes.';
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          message = err.response?.data?.message ?? 'Email ou mot de passe incorrect';
        } else if (err.response?.status === 422) {
          message = err.response?.data?.message ?? 'Données invalides';
        } else if (err.response?.data?.message) {
          message = err.response.data.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
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
