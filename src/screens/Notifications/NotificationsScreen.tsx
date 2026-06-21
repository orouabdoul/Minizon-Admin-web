import { DashboardLayout }       from '../../components/Layout/DashboardLayout/DashboardLayout';
import { NotificationsMetrics } from './components/NotificationsMetrics';
import { NotificationsFeed }    from './components/NotificationsFeed';
import { NotificationDetail }   from './components/NotificationDetail';
import { useNotifications }     from '../../hooks/useNotifications';

export function NotificationsScreen() {
  const {
    metrics, metricsLoading,
    notifications, loading, fetchError,
    tabFilter, setTabFilter, tabCounts,
    search,     setSearch,
    typeFilter, setTypeFilter,
    selectedId, setSelectedId,
    selectedNotification,
    loadingId,
    markAsRead, markAllRead, markAsHandled, deleteNotif,
  } = useNotifications();

  return (
    <DashboardLayout title="Notifications">
      <div className="notif-screen">

        <NotificationsMetrics metrics={metrics} loading={metricsLoading} />

        <div className="notif-layout">
          <NotificationsFeed
            notifications={notifications}
            tabFilter={tabFilter}   setTabFilter={setTabFilter}
            tabCounts={tabCounts}
            search={search}         setSearch={setSearch}
            typeFilter={typeFilter} setTypeFilter={setTypeFilter}
            selectedId={selectedId} setSelectedId={setSelectedId}
            onMarkRead={markAsRead}
            onMarkAllRead={markAllRead}
            onDelete={deleteNotif}
            loading={loading}
            fetchError={fetchError}
          />

          <NotificationDetail
            notification={selectedNotification}
            loadingId={loadingId}
            onHandle={markAsHandled}
          />
        </div>

      </div>
    </DashboardLayout>
  );
}
