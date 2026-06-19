import { useState, useCallback, useEffect } from 'react';
import { platformUserService }      from '../services/platform_user_service';
import { mapApiPlatformUser }        from '../models/user.model';
import type { PlatformUser }         from '../models/user.model';

type ConfirmAction = { id: string; action: 'delete' | 'suspend' | 'unsuspend' };
type NewUserData   = Omit<PlatformUser, 'id' | 'avatar' | 'lastActivity'>;
type RoleFilter    = 0 | 2 | 3;

const PAGE_SIZE = 10;

export function useUsers() {
  const [users,          setUsers]          = useState<PlatformUser[]>([]);
  const [total,          setTotal]          = useState(0);
  const [loading,        setLoading]        = useState(false);
  const [search,         setSearchState]    = useState('');
  const [statusFilter,   setStatusState]    = useState<string>('all');
  const [roleFilter,     setRoleState]      = useState<RoleFilter>(0);
  const [currentPage,    setCurrentPage]    = useState(1);
  const [loadingId,      setLoadingId]      = useState<string | null>(null);
  const [selectedId,     setSelectedId]     = useState<string | null>(null);
  const [editingId,      setEditingId]      = useState<string | null>(null);
  const [isAdding,       setIsAdding]       = useState(false);
  const [confirmAction,  setConfirmAction]  = useState<ConfirmAction | null>(null);

  const fetchUsers = useCallback(async (
    page: number,
    role: RoleFilter,
    status: string,
    q: string,
  ) => {
    setLoading(true);
    try {
      const { data } = await platformUserService.getAll(page, PAGE_SIZE, {
        ...(role   !== 0    ? { role_id: role }  : {}),
        ...(status !== 'all'? { status }          : {}),
        ...(q               ? { search: q }       : {}),
      });
      setUsers(data.body.data.map(mapApiPlatformUser));
      setTotal(data.body.total);
    } catch {
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, roleFilter, statusFilter, search);
  }, [fetchUsers, currentPage, roleFilter, statusFilter, search]);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  const setSearch = useCallback((v: string) => { setSearchState(v); resetPage(); }, [resetPage]);
  const setStatusFilter = useCallback((v: string) => { setStatusState(v); resetPage(); }, [resetPage]);
  const setRoleFilter   = useCallback((v: RoleFilter) => { setRoleState(v); resetPage(); }, [resetPage]);

  const patchLocal = useCallback((id: string, patch: Partial<PlatformUser>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }, []);

  const withLoading = useCallback(async (
    id: string,
    action: () => Promise<unknown>,
    patch: Partial<PlatformUser>,
  ) => {
    setLoadingId(id);
    try {
      await action();
      patchLocal(id, patch);
    } catch {
      patchLocal(id, patch);
    } finally {
      setLoadingId(null);
    }
  }, [patchLocal]);

  const approveKyc = useCallback((id: string) =>
    withLoading(id, () => platformUserService.approveKyc(id), { verification: 'Vérifié' }),
  [withLoading]);

  const rejectKyc = useCallback((id: string) =>
    withLoading(id, () => platformUserService.rejectKyc(id), { verification: 'Rejeté' }),
  [withLoading]);

  const suspend = useCallback((id: string) =>
    withLoading(id, () => platformUserService.suspend(id), { status: 'Suspendu' }),
  [withLoading]);

  const unsuspend = useCallback((id: string) =>
    withLoading(id, () => platformUserService.unsuspend(id), { status: 'Actif' }),
  [withLoading]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      await platformUserService.delete(id);
    } catch { /* ignore */ }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setTotal((t) => Math.max(0, t - 1));
  }, []);

  const addUser = useCallback(async (payload: NewUserData) => {
    try {
      const { data } = await platformUserService.create(payload);
      setUsers((prev) => [mapApiPlatformUser(data.body), ...prev]);
      setTotal((t) => t + 1);
    } catch { /* silently ignore */ }
  }, []);

  const editUser = useCallback(async (id: string, patch: Partial<PlatformUser>) => {
    patchLocal(id, patch);
    try {
      await platformUserService.update(id, patch);
    } catch { /* keep optimistic patch */ }
  }, [patchLocal]);

  const selectedUser = selectedId ? (users.find((u) => u.id === selectedId) ?? null) : null;
  const editingUser  = editingId  ? (users.find((u) => u.id === editingId)  ?? null) : null;

  return {
    users,
    total,
    pageSize: PAGE_SIZE,
    currentPage,
    setCurrentPage,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    loadingId,
    approveKyc,
    rejectKyc,
    suspend,
    unsuspend,
    deleteUser,
    editUser,
    addUser,
    selectedId,
    setSelectedId,
    selectedUser,
    editingId,
    setEditingId,
    editingUser,
    isAdding,
    setIsAdding,
    confirmAction,
    setConfirmAction,
  };
}
