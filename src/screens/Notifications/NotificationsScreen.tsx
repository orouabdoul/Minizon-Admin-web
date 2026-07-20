import { useState }               from 'react';
import { Bell }                    from 'lucide-react';
import { DashboardLayout }         from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }                 from '../../components/Common/AppIcon';
import { NotificationsMetrics }    from './components/NotificationsMetrics';
import { NotificationsFeed }       from './components/NotificationsFeed';
import { NotificationDetail }      from './components/NotificationDetail';
import { SendNotifModal }          from './components/SendNotifModal';
import { useNotifications }        from '../../hooks/useNotifications';

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
    sending, sendMsg, sendNotification,
  } = useNotifications();

  const [showSendModal, setShowSendModal] = useState(false);

  return (
    <DashboardLayout title="Notifications">
      <div className="notif-screen">

        {/* ── Send notification button + toast ─────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          {sendMsg && (
            <div style={{ flex: 1, padding: '9px 14px', background: '#DCFCE7', borderRadius: 10, border: '1px solid #BBF7D0', fontSize: 13, fontWeight: 600, color: '#16A34A', marginRight: 12 }}>
              {sendMsg}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowSendModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, border: 'none', background: '#2563EB', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}
          >
            <AppIcon icon={Bell} size={15} color="#fff" />
            Envoyer une notification push
          </button>
        </div>

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

      {showSendModal && (
        <SendNotifModal
          onClose={() => setShowSendModal(false)}
          sending={sending}
          onSend={(data) => {
            sendNotification(data);
            setShowSendModal(false);
          }}
        />
      )}

    </DashboardLayout>
  );
}
