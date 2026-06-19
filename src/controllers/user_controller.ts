import { useState, useCallback } from 'react';
import { userService } from '../services/user_service';
import type { User } from '../models/user.model';

interface UserState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
}

export function useUserController() {
  const [state, setState] = useState<UserState>({
    users: [],
    total: 0,
    loading: false,
    error: null,
  });

  const fetchUsers = useCallback(async (page = 1, limit = 20) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data } = await userService.getAll(page, limit);
      setState({ users: data.data, total: data.total, loading: false, error: null });
    } catch {
      setState((s) => ({ ...s, loading: false, error: 'Erreur de chargement des utilisateurs' }));
    }
  }, []);

  return { ...state, fetchUsers };
}
