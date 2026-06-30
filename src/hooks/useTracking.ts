import { useState, useEffect, useCallback, useRef } from 'react';
import { trackingService } from '../services/tracking_service';
import type { TrackedTrip, TrackingStats, IncidentType } from '../models/tracking.model';

const POLL_MS = 15_000;

// ── Realistic mock data (Bénin / West Africa) ────────────────────────────────
const MOCK_TRIPS: TrackedTrip[] = [
  {
    id: 't1', tripId: '#TRJ-8472',
    driverName: 'Koffi Mensah', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 97 45 67 89',
    passengerCount: 3, from: 'Cotonou', to: 'Parakou',
    fromCoords: [6.3703, 2.3912], toCoords: [9.3370, 2.6274],
    startedAt: '14:30', estimatedArrival: '19:45',
    status: 'actif',
    position: { lat: 7.2114, lng: 2.2277, heading: 15, speed: 78, updatedAt: new Date().toISOString() },
  },
  {
    id: 't2', tripId: '#TRJ-8473',
    driverName: 'Adjovi Sèna', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 96 12 34 56',
    passengerCount: 2, from: 'Porto-Novo', to: 'Cotonou',
    fromCoords: [6.4965, 2.6289], toCoords: [6.3703, 2.3912],
    startedAt: '14:10', estimatedArrival: '14:55',
    status: 'actif',
    position: { lat: 6.4402, lng: 2.5143, heading: 220, speed: 55, updatedAt: new Date().toISOString() },
  },
  {
    id: 't3', tripId: '#TRJ-8474',
    driverName: 'Jean-Baptiste Hounkpè', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 95 78 90 12',
    passengerCount: 1, from: 'Cotonou', to: 'Abomey',
    fromCoords: [6.3703, 2.3912], toCoords: [7.1803, 1.9908],
    startedAt: '13:00', estimatedArrival: '15:30',
    status: 'incident',
    position: { lat: 6.8902, lng: 2.1100, heading: 330, speed: 0, updatedAt: new Date().toISOString() },
    incident: {
      id: 'inc1', type: 'panne',
      notes: 'Pneu crevé sur la N1 km 52',
      reportedAt: '14:18', resolved: false,
    },
  },
  {
    id: 't4', tripId: '#TRJ-8475',
    driverName: 'Aminata Diallo', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 94 56 78 90',
    passengerCount: 4, from: 'Cotonou', to: 'Porto-Novo',
    fromCoords: [6.3703, 2.3912], toCoords: [6.4965, 2.6289],
    startedAt: '14:45', estimatedArrival: '15:20',
    status: 'actif',
    position: { lat: 6.4102, lng: 2.5003, heading: 40, speed: 62, updatedAt: new Date().toISOString() },
  },
  {
    id: 't5', tripId: '#TRJ-8476',
    driverName: 'Moussa Traoré', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 93 45 67 89',
    passengerCount: 2, from: 'Parakou', to: 'Cotonou',
    fromCoords: [9.3370, 2.6274], toCoords: [6.3703, 2.3912],
    startedAt: '10:00', estimatedArrival: '15:30',
    status: 'actif',
    position: { lat: 7.7400, lng: 2.4800, heading: 185, speed: 91, updatedAt: new Date().toISOString() },
  },
];

const MOCK_STATS: TrackingStats = {
  activeTrips: 4, incidents: 1, driversOnline: 12, tripsToday: 47,
};

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useTracking() {
  const [trips,      setTrips]      = useState<TrackedTrip[]>([]);
  const [stats,      setStats]      = useState<TrackingStats | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter,     setFilter]     = useState<'all' | 'actif' | 'incident'>('all');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadTrips = useCallback(async () => {
    try {
      const [tripsRes, statsRes] = await Promise.all([
        trackingService.getActiveTrips(),
        trackingService.getStats(),
      ]);
      if (tripsRes.data.body) setTrips(tripsRes.data.body);
      if (statsRes.data.body) setStats(statsRes.data.body);
    } catch {
      // Fallback to mock data if API is not ready
      setTrips(MOCK_TRIPS);
      setStats(MOCK_STATS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
    pollRef.current = setInterval(loadTrips, POLL_MS);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [loadTrips]);

  const reportIncident = useCallback(async (
    tripId: string, type: IncidentType, notes: string,
  ) => {
    // Optimistic update
    setTrips((prev) => prev.map((t) =>
      t.id === tripId
        ? { ...t, status: 'incident' as const, incident: { id: `inc-${Date.now()}`, type, notes, reportedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), resolved: false } }
        : t,
    ));
    setStats((s) => s ? { ...s, incidents: s.incidents + 1, activeTrips: Math.max(0, s.activeTrips - 1) } : s);
    try {
      await trackingService.reportIncident(tripId, type, notes);
    } catch { /* keep optimistic */ }
  }, []);

  const resolveIncident = useCallback(async (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip?.incident) return;
    // Optimistic update
    setTrips((prev) => prev.map((t) =>
      t.id === tripId
        ? { ...t, status: 'actif' as const, incident: t.incident ? { ...t.incident, resolved: true } : undefined }
        : t,
    ));
    setStats((s) => s ? { ...s, incidents: Math.max(0, s.incidents - 1), activeTrips: s.activeTrips + 1 } : s);
    try {
      await trackingService.resolveIncident(tripId, trip.incident.id);
    } catch { /* keep optimistic */ }
  }, [trips]);

  const filteredTrips = trips.filter((t) => {
    if (filter === 'actif')    return t.status === 'actif';
    if (filter === 'incident') return t.status === 'incident';
    return true;
  });

  return {
    trips: filteredTrips,
    allTrips: trips,
    stats,
    loading,
    selectedId,
    setSelectedId,
    filter,
    setFilter,
    reportIncident,
    resolveIncident,
    refresh: loadTrips,
  };
}
