import { useState, useMemo } from 'react';
import { MOCK_NOTIFICATIONS } from '../config/constants';
import type { NotifTab, Notification } from '../models/notification.model';

export function useNotifications() {
  const [all,         setAll]         = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [tabFilter,   setTabFilter]   = useState<NotifTab>('all');
  const [search,      setSearch]      = useState('');
  const [typeFilter,  setTypeFilter]  = useState('all');
  const [loadingId,   setLoadingId]   = useState<string | null>(null);
  const [selectedId,  setSelectedId]  = useState<string>(MOCK_NOTIFICATIONS[0].id);

  const baseFiltered = useMemo(() => all.filter((n) => {
    const q = search.toLowerCase();
    const matchSearch = !q || n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      (n.userName?.toLowerCase().includes(q) ?? false);
    const matchType = typeFilter === 'all' || n.type === typeFilter;
    return matchSearch && matchType;
  }), [all, search, typeFilter]);

  const tabCounts = useMemo(() => ({
    all:    baseFiltered.length,
    unread: baseFiltered.filter((n) => n.status === 'Non lue').length,
    urgent: baseFiltered.filter((n) => n.priority === 'Urgente').length,
    system: baseFiltered.filter((n) => n.type === 'system').length,
  }), [baseFiltered]);

  const notifications = useMemo(() => baseFiltered.filter((n) => {
    if (tabFilter === 'unread') return n.status === 'Non lue';
    if (tabFilter === 'urgent') return n.priority === 'Urgente';
    if (tabFilter === 'system') return n.type === 'system';
    return true;
  }), [baseFiltered, tabFilter]);

  const selectedNotification = useMemo(
    () => notifications.find((n) => n.id === selectedId) ?? notifications[0] ?? null,
    [notifications, selectedId]
  );

  function markAsRead(id: string) {
    setAll((prev) => prev.map((n) => n.id === id && n.status === 'Non lue' ? { ...n, status: 'Lue' as const } : n));
  }

  function markAllRead() {
    setAll((prev) => prev.map((n) => n.status === 'Non lue' ? { ...n, status: 'Lue' as const } : n));
  }

  function markAsHandled(id: string) {
    setLoadingId(id);
    setTimeout(() => {
      setAll((prev) => prev.map((n) => n.id === id ? { ...n, status: 'Traitée' as const } : n));
      setLoadingId(null);
    }, 600);
  }

  function deleteNotif(id: string) {
    setAll((prev) => prev.filter((n) => n.id !== id));
  }

  return {
    notifications,
    tabFilter, setTabFilter, tabCounts,
    search, setSearch,
    typeFilter, setTypeFilter,
    loadingId,
    markAsRead, markAllRead, markAsHandled, deleteNotif,
    selectedId, setSelectedId,
    selectedNotification,
  };
}
