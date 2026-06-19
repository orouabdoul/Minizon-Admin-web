import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import axios from 'axios';
import { authService } from '../services/auth_service';
import { tokenStore } from '../services/token_store';
import type { LoginCredentials, AuthState, AdminUser } from '../models/auth.model';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  });

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data } = await authService.login(credentials);
      tokenStore.set(data.body.token);
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

  const logout = useCallback(() => {
    authService.logout().catch(() => null);
    tokenStore.clear();
    setState({ isAuthenticated: false, user: null, loading: false, error: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
