import { useState, useCallback } from 'react';
import { Navigation, AlertTriangle, Car, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }         from '../../components/Common/AppIcon';
import { TrackingMap }     from './components/TrackingMap';
import { TripListPanel }   from './components/TripListPanel';
import { IncidentModal }   from './components/IncidentModal';
import { useTracking }     from '../../hooks/useTracking';
import type { IncidentType, TrackedTrip } from '../../models/tracking.model';
import '../../tracking.css';

// ── Stats KPI bar ─────────────────────────────────────────────────────────────

interface StatItem { label: string; value: string | number; color: string; bg: string; icon: typeof Navigation }
function StatCard({ label, value, color, bg, icon }: StatItem) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: '#fff', borderRadius: 10, outline: '1px solid #F3F4F6', flex: 1 }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <AppIcon icon={icon} size={16} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color, lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: 11, color: '#6B7280' }}>{label}</div>
      </div>
    </div>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function TrackingScreen() {
  const {
    trips, allTrips, stats, loading,
    selectedId, setSelectedId,
    filter, setFilter,
    reportIncident, resolveIncident, refresh,
  } = useTracking();

  // Incident modal state
  const [incidentTrip, setIncidentTrip] = useState<TrackedTrip | null>(null);
  const [pendingType,  setPendingType]  = useState<IncidentType | null>(null);

  const handleReport = useCallback((tripId: string, type: IncidentType) => {
    const trip = allTrips.find((t) => t.id === tripId) ?? null;
    setIncidentTrip(trip);
    setPendingType(type);
    setSelectedId(tripId);
  }, [allTrips, setSelectedId]);

  const handleSubmitIncident = useCallback((tripId: string, type: IncidentType, notes: string) => {
    reportIncident(tripId, type, notes);
    setIncidentTrip(null);
    setPendingType(null);
  }, [reportIncident]);

  const handleCloseModal = useCallback(() => {
    setIncidentTrip(null);
    setPendingType(null);
  }, []);

  return (
    <DashboardLayout title="Suivi des Trajets en Temps Réel">

      {/* Stats bar */}
      <div className="tracking-stats-bar">
        <StatCard
          label="Trajets actifs"
          value={stats?.activeTrips ?? allTrips.filter((t) => t.status === 'actif').length}
          color="#00A86B" bg="rgba(0,168,107,0.10)"
          icon={Navigation}
        />
        <StatCard
          label="Incidents en cours"
          value={stats?.incidents ?? allTrips.filter((t) => t.status === 'incident').length}
          color="#E53935" bg="#FEE2E2"
          icon={AlertTriangle}
        />
        <StatCard
          label="Conducteurs en ligne"
          value={stats?.driversOnline ?? allTrips.length}
          color="#2563EB" bg="#DBEAFE"
          icon={Car}
        />
        <StatCard
          label="Trajets aujourd'hui"
          value={stats?.tripsToday ?? '—'}
          color="#7C3AED" bg="#F3E8FF"
          icon={TrendingUp}
        />
      </div>

      {/* Map + list layout */}
      <div className="tracking-layout">
        {/* Left: trip list */}
        <TripListPanel
          trips={trips}
          selectedId={selectedId}
          filter={filter}
          loading={loading}
          onSelect={setSelectedId}
          onFilter={setFilter}
          onReport={handleReport}
          onResolve={resolveIncident}
          onRefresh={refresh}
        />

        {/* Right: map */}
        <div className="tracking-map-wrap">
          <TrackingMap
            trips={allTrips}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onReport={handleReport}
            onResolve={resolveIncident}
          />

          {/* Map legend */}
          <div className="tracking-legend">
            <span className="tracking-legend__item tracking-legend__item--actif">🟢 Actif</span>
            <span className="tracking-legend__item tracking-legend__item--panne">🔴 Incident</span>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>Actualisé toutes les 15s</span>
          </div>
        </div>
      </div>

      {/* Incident modal */}
      <IncidentModal
        isOpen={incidentTrip !== null}
        trip={incidentTrip}
        initialType={pendingType}
        onClose={handleCloseModal}
        onSubmit={handleSubmitIncident}
      />

    </DashboardLayout>
  );
}
