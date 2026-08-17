import { useState, useCallback } from 'react';
import {
  Navigation, AlertTriangle, Car, TrendingUp, WifiOff,
  Clock, Map, List, Wrench, Flag, Users, CheckCircle,
} from 'lucide-react';
import { DashboardLayout }   from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }           from '../../components/Common/AppIcon';
import { TrackingMap }       from './components/TrackingMap';
import { TripListPanel }     from './components/TripListPanel';
import { TripDetailPanel }   from './components/TripDetailPanel';
import { IncidentModal }     from './components/IncidentModal';
import { AlertDriverModal }  from './components/AlertDriverModal';
import { useTracking }       from '../../hooks/useTracking';
import type { IncidentType, TrackedTrip } from '../../models/tracking.model';
import '../../tracking.css';

// ── KPI card ──────────────────────────────────────────────────────────────────

interface KpiItem { label: string; value: string | number; color: string; bg: string; icon: typeof Navigation; small?: boolean }
function KpiCard({ label, value, color, bg, icon, small }: KpiItem) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: small ? 8 : 10,
      padding: small ? '8px 12px' : '10px 16px',
      background: '#fff', borderRadius: 10, outline: '1px solid #F3F4F6', flex: 1,
    }}>
      <div style={{ width: small ? 28 : 34, height: small ? 28 : 34, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <AppIcon icon={icon} size={small ? 13 : 16} color={color} />
      </div>
      <div>
        <div style={{ fontSize: small ? 15 : 18, fontWeight: 700, color, lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: 10, color: '#6B7280' }}>{label}</div>
      </div>
    </div>
  );
}

// ── Demo banner ────────────────────────────────────────────────────────────────

function MockBanner({ message }: { message: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 14px', marginBottom: 12,
      background: '#FEF9C3', border: '1px solid #FDE68A',
      borderRadius: 9, fontSize: 12, color: '#92400E',
    }}>
      <AppIcon icon={WifiOff} size={14} color="#D97706" />
      <span><strong>Mode démo</strong> — {message}</span>
    </div>
  );
}

// ── View mode toggle ──────────────────────────────────────────────────────────

type ViewMode = 'list' | 'map';

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div style={{ display: 'flex', border: '1.5px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
      {(['list', 'map'] as ViewMode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
            border: 'none', borderLeft: m === 'map' ? '1.5px solid #E5E7EB' : 'none',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            background: mode === m ? '#1A5FB4' : '#fff',
            color:      mode === m ? '#fff'    : '#6B7280',
          }}
        >
          <AppIcon icon={m === 'list' ? List : Map} size={13} color={mode === m ? '#fff' : '#6B7280'} />
          {m === 'list' ? 'Détails' : 'Carte'}
        </button>
      ))}
    </div>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function TrackingScreen() {
  const {
    trips, allTrips, stats, loading, loadingDetail, error, usingMock,
    selectedId, selectedTrip,
    setSelectedId,
    filter, setFilter,
    search, setSearch,
    reportIncident, resolveIncident,
    flagTrip,
    notifyDriver, notifSending,
    refresh,
  } = useTracking();

  const [viewMode,     setViewMode]     = useState<ViewMode>('list');
  const [incidentTrip, setIncidentTrip] = useState<TrackedTrip | null>(null);
  const [alertTrip,    setAlertTrip]    = useState<TrackedTrip | null>(null);

  // ── Incident modal ────────────────────────────────────────────────────────

  const handleReport = useCallback((tripId: string, _type?: IncidentType) => {
    const trip = allTrips.find((t) => t.id === tripId) ?? null;
    setIncidentTrip(trip);
    setSelectedId(tripId);
  }, [allTrips, setSelectedId]);

  const handleReportFromDetail = useCallback((tripId: string) => {
    const trip = allTrips.find((t) => t.id === tripId) ?? null;
    setIncidentTrip(trip);
  }, [allTrips]);

  const handleSubmitIncident = useCallback((tripId: string, type: IncidentType, notes: string) => {
    reportIncident(tripId, type, notes);
    setIncidentTrip(null);
  }, [reportIncident]);

  // ── Alert driver modal (FCM) ──────────────────────────────────────────────

  const handleAlertDriver = useCallback((trip: TrackedTrip) => {
    setAlertTrip(trip);
  }, []);

  const handleSendNotif = useCallback(async (tripId: string, title: string, message: string) => {
    await notifyDriver(tripId, title, message);
  }, [notifyDriver]);

  return (
    <DashboardLayout title="Suivi des Trajets en Temps Réel">

      {/* Demo banner */}
      {usingMock && error && <MockBanner message={error} />}

      {/* ── KPI row 1 — principaux ──────────────────────────────────────────── */}
      <div className="tracking-stats-bar" style={{ marginBottom: 8 }}>
        <KpiCard label="En cours"          value={stats.activeTrips}   color="#1A5FB4" bg="rgba(26,95,180,0.10)" icon={Navigation}   />
        <KpiCard label="En attente"        value={stats.pendingTrips}  color="#D97706" bg="#FEF9C3"              icon={Clock}         />
        <KpiCard label="Retards"           value={stats.delayedTrips}  color="#F59E0B" bg="#FEF3C7"              icon={Clock}         />
        <KpiCard label="Incidents actifs"  value={stats.incidents}     color="#E53935" bg="#FEE2E2"              icon={AlertTriangle} />
        <KpiCard label="Conducteurs en ligne" value={stats.driversOnline} color="#1A5FB4" bg="#D6E8F7"           icon={Car}           />
        <KpiCard label="Trajets aujourd'hui" value={stats.tripsToday}  color="#1A5FB4" bg="#F3E8FF"              icon={TrendingUp}    />
      </div>

      {/* ── KPI row 2 — secondaires ─────────────────────────────────────────── */}
      <div className="tracking-stats-bar" style={{ marginBottom: 16 }}>
        <KpiCard label="Pannes actives"      value={stats.pannes}          color="#DC2626" bg="#FEE2E2" icon={Wrench}      small />
        <KpiCard label="Terminés aujourd'hui" value={stats.completedToday} color="#059669" bg="#D1FAE5" icon={CheckCircle} small />
        <KpiCard label="Passagers aujourd'hui" value={stats.passengersToday} color="#0891B2" bg="#CFFAFE" icon={Users}    small />
        <KpiCard label="Signalés"            value={stats.flaggedTrips}    color="#1A5FB4" bg="#F3E8FF" icon={Flag}       small />
      </div>

      {/* ── View toggle ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {/* ── Main layout ─────────────────────────────────────────────────────── */}
      <div className="tracking-layout">

        {/* Left: trip list + search */}
        <TripListPanel
          trips={trips}
          selectedId={selectedId}
          filter={filter}
          search={search}
          loading={loading}
          onSelect={setSelectedId}
          onFilter={setFilter}
          onSearchChange={setSearch}
          onReport={handleReport}
          onResolve={resolveIncident}
          onRefresh={refresh}
        />

        {/* Right: detail panel OR map */}
        {viewMode === 'list' ? (
          <TripDetailPanel
            trip={selectedTrip}
            loadingDetail={loadingDetail}
            onAlertDriver={handleAlertDriver}
            onReportIncident={handleReportFromDetail}
            onResolveIncident={resolveIncident}
            onFlagTrip={flagTrip}
          />
        ) : (
          <div className="tracking-map-wrap">
            <TrackingMap
              trips={allTrips}
              selectedId={selectedId}
              selectedTrip={selectedTrip}
              onSelect={setSelectedId}
              onReport={handleReport}
              onResolve={resolveIncident}
            />
            <div className="tracking-legend">
              <span className="tracking-legend__item">🟢 En cours</span>
              <span className="tracking-legend__item">🟡 En attente</span>
              <span className="tracking-legend__item">🔴 Incident</span>
              {selectedTrip && (<>
                <span className="tracking-legend__item" style={{ color: '#059669' }}>D Départ</span>
                <span className="tracking-legend__item" style={{ color: '#DC2626' }}>A Arrivée</span>
                <span className="tracking-legend__item" style={{ color: '#0891B2' }}>▲ Prise</span>
                <span className="tracking-legend__item" style={{ color: '#EA580C' }}>▼ Dépôt</span>
              </>)}
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                {usingMock ? '⚡ Démo' : 'GPS 5s · Liste 15s'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <IncidentModal
        isOpen={incidentTrip !== null}
        trip={incidentTrip}
        initialType={null}
        onClose={() => setIncidentTrip(null)}
        onSubmit={handleSubmitIncident}
      />

      <AlertDriverModal
        isOpen={alertTrip !== null}
        trip={alertTrip}
        sending={notifSending}
        onClose={() => setAlertTrip(null)}
        onSend={handleSendNotif}
      />
    </DashboardLayout>
  );
}
