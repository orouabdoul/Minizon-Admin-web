import { useState, useCallback }            from 'react';
import { Bell, AlertTriangle, Unlock, Loader } from 'lucide-react';
import { DashboardLayout }                from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }                        from '../../components/Common/AppIcon';
import { NotificationsMetrics }           from './components/NotificationsMetrics';
import { NotificationsFeed }             from './components/NotificationsFeed';
import { NotificationDetail }            from './components/NotificationDetail';
import { SendNotifModal }                 from './components/SendNotifModal';
import { PaymentDetailModal }            from '../Payments/components/PaymentDetailModal';
import { useNotifications }              from '../../hooks/useNotifications';
import { paymentService }                from '../../services/payment_service';
import { mapApiPaymentToPayment }        from '../../models/payment.model';
import type { Payment }                  from '../../models/payment.model';

type PaymentAction = { paymentUuid: string; notifId: string; action: 'release' | 'refund' };

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

  // ── Payment actions from critical review notifications ────────────────
  const [pendingAction,       setPendingAction]       = useState<PaymentAction | null>(null);
  const [paymentActionState,  setPaymentActionState]  = useState<
    Record<string, { loading?: boolean; success?: string; error?: string }>
  >({});

  const setNotifState = (notifId: string, state: { loading?: boolean; success?: string; error?: string }) =>
    setPaymentActionState((prev) => ({ ...prev, [notifId]: state }));

  const executePaymentAction = useCallback(async (action: PaymentAction) => {
    const { paymentUuid, notifId, action: type } = action;
    setNotifState(notifId, { loading: true });
    try {
      if (type === 'release') {
        await paymentService.release(paymentUuid);
        setNotifState(notifId, { success: 'Fonds libérés avec succès.' });
      } else {
        await paymentService.refund(paymentUuid);
        setNotifState(notifId, { success: 'Remboursement effectué avec succès.' });
      }
      markAsHandled(notifId);
    } catch (e) {
      const msg = (e as any)?.response?.data?.message ?? 'Erreur. Veuillez réessayer.';
      setNotifState(notifId, { error: msg });
    }
  }, [markAsHandled]);

  const handleConfirmAction = useCallback(async () => {
    if (!pendingAction) return;
    const action = pendingAction;
    setPendingAction(null);
    await executePaymentAction(action);
  }, [pendingAction, executePaymentAction]);

  // ── View payment modal ────────────────────────────────────────────────
  const [viewPayment,        setViewPayment]        = useState<Payment | null>(null);
  const [viewPaymentLoading, setViewPaymentLoading] = useState(false);
  const [viewNotifId,        setViewNotifId]        = useState<string>('');

  const handleViewPayment = useCallback(async (paymentUuid: string, notifId: string) => {
    setViewNotifId(notifId);
    setViewPaymentLoading(true);
    try {
      const res = await paymentService.getById(paymentUuid);
      setViewPayment(mapApiPaymentToPayment(res.data.body));
    } catch { /* silently fail */ }
    finally { setViewPaymentLoading(false); }
  }, []);

  const handleViewPaymentRefund = useCallback((id: string) => {
    setViewPayment(null);
    setPendingAction({ paymentUuid: id, notifId: viewNotifId, action: 'refund' });
  }, [viewNotifId]);

  const handleViewPaymentRelease = useCallback((id: string) => {
    setViewPayment(null);
    setPendingAction({ paymentUuid: id, notifId: viewNotifId, action: 'release' });
  }, [viewNotifId]);

  const pendingLabel = pendingAction?.action === 'release' ? 'la libération' : 'le remboursement';

  const pendingColor = pendingAction?.action === 'release' ? '#16A34A' : '#E53935';
  const pendingBtnClass = pendingAction?.action === 'release'
    ? 'payments-confirm-dialog__btn--release'
    : 'payments-confirm-dialog__btn--confirm';
  const pendingBtnLabel = pendingAction?.action === 'release' ? 'Libérer les fonds' : 'Confirmer le remboursement';

  return (
    <DashboardLayout title="Notifications">
      <div className="notif-screen">

        {/* ── Confirmation modal for critical review actions ── */}
        {pendingAction && (
          <div className="payments-confirm-overlay">
            <div className="payments-confirm-dialog" role="dialog" aria-modal="true">
              <div
                className="payments-confirm-dialog__icon"
                style={{ background: pendingAction.action === 'release' ? '#F0FDF4' : '#FFF7ED' }}
              >
                <AppIcon icon={pendingAction.action === 'release' ? Unlock : AlertTriangle} size={28} color={pendingColor} />
              </div>
              <h3 className="payments-confirm-dialog__title">
                Confirmer {pendingLabel}
              </h3>
              <p className="payments-confirm-dialog__body">
                {pendingAction.action === 'release'
                  ? 'Voulez-vous libérer les fonds vers le portefeuille du conducteur ?'
                  : 'Voulez-vous rembourser le passager via FedaPay ?'}
              </p>
              <p className="payments-confirm-dialog__warning">
                Cette action est irréversible et sera exécutée immédiatement.
              </p>
              <div className="payments-confirm-dialog__actions">
                <button
                  type="button"
                  className="payments-confirm-dialog__btn payments-confirm-dialog__btn--cancel"
                  onClick={() => setPendingAction(null)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className={`payments-confirm-dialog__btn ${pendingBtnClass}`}
                  onClick={handleConfirmAction}
                >
                  {pendingBtnLabel}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Payment detail modal (from "Voir le paiement") ── */}
        {viewPaymentLoading && (
          <div className="payments-confirm-overlay" style={{ zIndex: 8999 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', padding: '20px 28px', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <AppIcon icon={Loader} size={20} color="#2563EB" />
              <span style={{ fontSize: 14, color: '#374151', fontWeight: 600 }}>Chargement du paiement…</span>
            </div>
          </div>
        )}

        {viewPayment && (
          <PaymentDetailModal
            payment={viewPayment}
            onClose={() => setViewPayment(null)}
            onRefund={handleViewPaymentRefund}
            onRelease={handleViewPaymentRelease}
            onSyncOne={() => {}}
            loadingId={null}
            syncOneLoading={false}
          />
        )}

        {/* ── Send notification button ── */}
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
            onPaymentView={handleViewPayment}
            onPaymentRelease={(uuid, notifId) => setPendingAction({ paymentUuid: uuid, notifId, action: 'release' })}
            onPaymentRefund={(uuid, notifId)  => setPendingAction({ paymentUuid: uuid, notifId, action: 'refund'  })}
            paymentActionState={paymentActionState}
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
