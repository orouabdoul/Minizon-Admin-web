import { useState, useCallback, useEffect } from 'react';
import { platformUserService }       from '../services/platform_user_service';
import { driverService }             from '../services/driver_service';
import { mapApiPlatformUser }        from '../models/user.model';
import { mapApiDriverToDriver }      from '../models/driver.model';
import type { PlatformUser, ApiPlatformUser } from '../models/user.model';
import type { Driver, DriverStatus } from '../models/driver.model';

type ConfirmAction = { id: string; action: 'delete' | 'suspend' | 'unsuspend' };
type NewUserData   = Omit<PlatformUser, 'id' | 'avatar' | 'lastActivity'>;
type RoleFilter    = 0 | 2 | 3;

const PAGE_SIZE = 10;

// Un profil est considéré complet s'il a un vrai nom (pas vide, pas un placeholder auto-généré)
// et un numéro de téléphone. Les comptes fantômes (OTP validé sans profil rempli) sont exclus.
function isProfileComplete(u: PlatformUser): boolean {
  const name = (u.name ?? '').trim();
  if (!name)                         return false;   // nom vide
  if (/^Utilisateur #/i.test(name))  return false;   // placeholder auto-généré
  if (/^User #/i.test(name))         return false;   // variante anglaise
  if (!u.phone || u.phone.trim() === '') return false; // pas de téléphone
  return true;
}

function verificationToDriverStatus(v?: string): DriverStatus {
  if (v === 'Vérifié') return 'Vérifié';
  if (v === 'Rejeté')  return 'Rejeté';
  return 'En attente';
}

export function useUsers() {
  const [users,          setUsers]          = useState<PlatformUser[]>([]);
  const [total,          setTotal]          = useState(0);
  const [hiddenCount,    setHiddenCount]    = useState(0);
  const [loading,        setLoading]        = useState(false);
  const [search,         setSearchState]    = useState('');
  const [statusFilter,   setStatusState]    = useState<string>('all');
  const [roleFilter,     setRoleState]      = useState<RoleFilter>(0);
  const [currentPage,    setCurrentPage]    = useState(1);
  const [loadingId,      setLoadingId]      = useState<string | null>(null);
  const [selectedId,     setSelectedIdState] = useState<string | null>(null);
  const [detailUser,     setDetailUser]     = useState<PlatformUser | null>(null);
  const [detailLoading,  setDetailLoading]  = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [driverLoading,  setDriverLoading]  = useState(false);
  const [editingId,      setEditingId]      = useState<string | null>(null);
  const [isAdding,       setIsAdding]       = useState(false);
  const [confirmAction,  setConfirmAction]  = useState<ConfirmAction | null>(null);
  const [actionMsg,      setActionMsg]      = useState<string | null>(null);

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
      const all      = data.body.data.map(mapApiPlatformUser);
      const mapped   = all.filter(isProfileComplete);
      const excluded = all.length - mapped.length;
      setUsers(mapped);
      setHiddenCount(excluded);
      setTotal(Math.max(0, data.body.total - excluded));
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
    setDetailUser((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
  }, []);

  const flashActionMsg = useCallback((msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 3500);
  }, []);

  const withLoading = useCallback(async (
    id: string,
    action: () => Promise<unknown>,
    patch: Partial<PlatformUser>,
    successMsg?: string,
  ) => {
    setLoadingId(id);
    try {
      await action();
      patchLocal(id, patch);
      if (successMsg) flashActionMsg(successMsg);
    } catch {
      patchLocal(id, patch);
    } finally {
      setLoadingId(null);
    }
  }, [patchLocal, flashActionMsg]);

  const approveKyc = useCallback((id: string) =>
    withLoading(id, () => platformUserService.approveKyc(id), { verification: 'Vérifié' },
      '✓ KYC approuvé — l\'utilisateur a été notifié automatiquement.'),
  [withLoading]);

  const rejectKyc = useCallback((id: string) =>
    withLoading(id, () => platformUserService.rejectKyc(id), { verification: 'Rejeté' },
      '✓ KYC rejeté — l\'utilisateur a été notifié automatiquement.'),
  [withLoading]);

  const suspend = useCallback((id: string) =>
    withLoading(id, () => platformUserService.suspend(id), { status: 'Suspendu' },
      '✓ Compte suspendu — l\'utilisateur a été notifié automatiquement.'),
  [withLoading]);

  const unsuspend = useCallback((id: string) =>
    withLoading(id, () => platformUserService.unsuspend(id), { status: 'Actif' },
      '✓ Compte réactivé — l\'utilisateur a été notifié automatiquement.'),
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

  const setSelectedId = useCallback(async (id: string | null) => {
    setSelectedIdState(id);
    // Reset driver state first
    setSelectedDriver(null);
    setDriverLoading(false);

    if (!id) { setDetailUser(null); return; }

    const basic = users.find((u) => u.id === id) ?? null;
    setDetailUser(basic);
    setDetailLoading(true);

    // For conducteurs: IMMEDIATELY set a minimal Driver shape (synchronous, before any await)
    // This prevents UserDetailModal from flashing before DriverDetailModal loads
    if (basic?.type === 'Conducteur') {
      setSelectedDriver({
        id:       basic.id,
        name:     basic.name,
        driverId: `#DRV-${basic.id.slice(-6).toUpperCase()}`,
        phone:    basic.phone,
        email:    '',
        vehicle:  '',
        plate:    '',
        avatar:   basic.avatar,
        selfies:  basic.selfies,
        idCard:   basic.idCard,
        documents: { permis: 'pending', carteGrise: 'pending', assurance: 'pending', tvmDoc: 'pending', technicalControl: 'pending' },
        score:    0,
        status:   verificationToDriverStatus(basic.verification),
      });
      setDriverLoading(true);
    }

    // Fetch user detail from API (handles passager KYC + supplementary data for conducteurs)
    try {
      const { data } = await platformUserService.getById(id);
      // Handle various API wrapping patterns: body, body.user, body.data
      const rawBody = ((data as unknown as Record<string, unknown>).body ?? data) as Record<string, unknown>;
      const body = (rawBody.user ?? rawBody.data ?? rawBody) as ApiPlatformUser;
      console.log('[User getById] raw body:', JSON.stringify(body, null, 2));
      const detail = mapApiPlatformUser(body);
      console.log('[User getById] mapped selfies:', detail.selfies, 'idCard:', detail.idCard);
      setDetailUser({
        ...detail,
        selfies: detail.selfies ?? basic?.selfies,
        idCard:  detail.idCard  ?? basic?.idCard,
      });
    } catch {
      // keep basic data on error
    } finally {
      setDetailLoading(false);
    }

    // For conducteurs: now fetch the full driver data to update DriverDetailModal
    if (basic?.type === 'Conducteur') {
      try {
        const { data: dData } = await driverService.getById(id);
        const dBody = ((dData as unknown as Record<string, unknown>).body ?? dData) as Parameters<typeof mapApiDriverToDriver>[0];
        setSelectedDriver(mapApiDriverToDriver(dBody));
      } catch {
        // Keep the minimal driver shape already shown — do NOT reset to null
        // (driver detail fetch may fail if IDs differ, but we still want DriverDetailModal)
      } finally {
        setDriverLoading(false);
      }
    }
  }, [users]);

  const validateDriver = useCallback(async (id: string) => {
    setLoadingId(id);
    try { await driverService.validate(id); } catch { /* optimistic */ }
    patchLocal(id, { verification: 'Vérifié' });
    setSelectedDriver((prev) => prev ? { ...prev, status: 'Vérifié' } : prev);
    setLoadingId(null);
  }, [patchLocal]);

  const rejectDriverFromUsers = useCallback(async (id: string) => {
    setLoadingId(id);
    try { await driverService.reject(id); } catch { /* optimistic */ }
    patchLocal(id, { verification: 'Rejeté' });
    setSelectedDriver((prev) => prev ? { ...prev, status: 'Rejeté' } : prev);
    setLoadingId(null);
  }, [patchLocal]);

  const editingUser = editingId ? (users.find((u) => u.id === editingId) ?? null) : null;

  return {
    users,
    total,
    hiddenCount,
    actionMsg,
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
    selectedUser: detailUser,
    detailLoading,
    selectedDriver,
    driverLoading,
    validateDriver,
    rejectDriverFromUsers,
    editingId,
    setEditingId,
    editingUser,
    isAdding,
    setIsAdding,
    confirmAction,
    setConfirmAction,
  };
}
