import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { trackingService } from '../services/tracking_service';
import type {
  TrackedTrip, TrackingStats, IncidentType,
  TrackingFilter, PassengerStop, LivePosition,
} from '../models/tracking.model';

const POLL_TRIPS_MS = 15_000;   // liste + stats
const POLL_LIVE_MS  =  5_000;   // positions GPS carte
const DELAY_THRESHOLD_MINUTES = 5;

// ── Map TrackingFilter → API params ──────────────────────────────────────────

function filterToParams(f: TrackingFilter): Record<string, string> {
  if (f === 'all')        return {};
  if (f === 'actif')      return { filter: 'actif' };
  if (f === 'en_attente') return { status: 'pending' };
  if (f === 'incident')   return { filter: 'incident' };
  if (f === 'retard')     return { filter: 'en_retard' };
  if (f === 'panne')      return { filter: 'panne' };
  if (f === 'flagged')    return { filter: 'flagged' };
  return {};
}

// ── Delay detection (client-side fallback when server doesn't compute is_late) ─

function enrichTrip(trip: TrackedTrip): TrackedTrip {
  const serverLate = trip.isLate === true;
  if ((trip.status === 'en_attente' || trip.status === 'retard') && trip.scheduledAt) {
    const delay = Math.floor((Date.now() - new Date(trip.scheduledAt).getTime()) / 60000);
    if (delay > DELAY_THRESHOLD_MINUTES || serverLate) {
      return { ...trip, status: 'retard', delayMinutes: delay > 0 ? delay : trip.delayMinutes ?? 0, isLate: true };
    }
    return { ...trip, delayMinutes: 0, isLate: false };
  }
  return trip;
}

// ── Normalize API response → TrackedTrip ─────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePassenger(raw: any): PassengerStop {
  return {
    ...raw,
    id:             raw.id ?? raw.uuid ?? '',
    name:           raw.name ?? raw.passenger_name ?? '',
    phone:          raw.phone ?? raw.passenger_phone,
    avatar:         raw.avatar ?? raw.passenger_avatar,
    seats:          raw.seats ?? raw.seats_count ?? 1,
    pickedUp:       raw.pickedUp ?? raw.picked_up ?? false,
    pickupAddress:  raw.pickupAddress ?? raw.pickup?.address ?? raw.pickup_address ?? '',
    pickupCoords:   raw.pickupCoords
      ?? (raw.pickup?.lat != null ? [raw.pickup.lat, raw.pickup.lng] as [number, number] : undefined),
    pickup:         raw.pickup,
    dropoffAddress: raw.dropoffAddress ?? raw.dropoff?.address ?? raw.dropoff_address ?? '',
    dropoffCoords:  raw.dropoffCoords
      ?? (raw.dropoff?.lat != null ? [raw.dropoff.lat, raw.dropoff.lng] as [number, number] : undefined),
    dropoff:        raw.dropoff,
    bookingStatus:  raw.bookingStatus ?? raw.booking_status ?? 'confirmé',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeTrip(raw: any): TrackedTrip {
  const normalized: TrackedTrip = {
    ...raw,
    id:              raw.id ?? raw.uuid ?? '',
    tripId:          raw.tripId ?? raw.trip_id ?? raw.id ?? '',
    driverName:      raw.driverName ?? raw.driver_name ?? raw.driver?.name ?? 'Conducteur',
    driverAvatar:    raw.driverAvatar ?? raw.driver_avatar ?? raw.driver?.avatar ?? 'https://placehold.co/40x40',
    driverPhone:     raw.driverPhone ?? raw.driver_phone ?? raw.driver?.phone ?? '',
    driverUuid:      raw.driverUuid ?? raw.driver_uuid ?? raw.driver?.uuid,
    passengerCount:  raw.passengerCount ?? raw.passenger_count ?? raw.passengers_count ?? 0,
    totalSeats:      raw.totalSeats ?? raw.total_seats ?? raw.seats,
    from:            raw.from ?? raw.departure ?? raw.origin ?? '',
    to:              raw.to ?? raw.destination ?? raw.arrival ?? '',
    fromCoords:      raw.fromCoords ?? raw.from_coords,
    toCoords:        raw.toCoords ?? raw.to_coords,
    departurePoint:  raw.departurePoint ?? raw.departure_point,
    arrivalPoint:    raw.arrivalPoint ?? raw.arrival_point,
    scheduledAt:     raw.scheduledAt ?? raw.scheduled_at ?? raw.departure_time ?? raw.planned_at,
    startedAt:       raw.startedAt ?? raw.started_at ?? raw.start_time,
    estimatedArrival: raw.estimatedArrival ?? raw.estimated_arrival ?? raw.eta ?? '—',
    price:           raw.price,
    priceUnit:       raw.priceUnit ?? raw.price_unit ?? 'FCFA',
    status:          raw.status ?? 'en_attente',
    position: (() => {
      const rawPos = raw.position;
      return {
        lat:       rawPos?.lat   ?? 0,
        lng:       rawPos?.lng   ?? 0,
        speed:     rawPos?.speed ?? 0,
        heading:   rawPos?.heading,
        updatedAt: raw.location_updated_at ?? rawPos?.updatedAt,
        hasGps:    rawPos?.lat != null && rawPos?.lng != null,
      };
    })(),
    incident: raw.incident
      ? { ...raw.incident, id: raw.incident.uuid ?? raw.incident.id ?? '' }
      : undefined,
    passengers: Array.isArray(raw.passengers) ? raw.passengers.map(normalizePassenger) : undefined,
    isLate:          raw.isLate ?? raw.is_late ?? false,
    isFlagged:       raw.isFlagged ?? raw.is_flagged ?? false,
    moderationNote:  raw.moderationNote ?? raw.moderation_note,
    vehicle:         raw.vehicle,
    timeline:        raw.timeline,
    waypoints:       raw.waypoints,
    delayMinutes:    raw.delayMinutes ?? raw.delay_minutes,
  };
  return enrichTrip(normalized);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTrips(data: any): TrackedTrip[] | null {
  const candidates = [
    data?.body?.trips,
    data?.trips,
    data?.body?.data,
    data?.data?.trips,
    data?.data,
  ];
  for (const c of candidates) {
    // Accept empty arrays — empty means "API replied: no results" (not a format error)
    if (Array.isArray(c)) return c.map(normalizeTrip);
  }
  return null; // format totally unrecognized → fall back to mock
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractLivePositions(data: any): LivePosition[] {
  const raw = data?.body?.positions ?? data?.positions ?? [];
  if (!Array.isArray(raw)) return [];
  return raw.map((p: any) => ({
    uuid:               p.uuid ?? p.id ?? '',
    lat:                p.lat ?? 0,
    lng:                p.lng ?? 0,
    speed:              p.speed,
    status:             p.status ?? 'actif',
    hasIncident:        p.hasIncident ?? p.has_incident ?? false,
    incidentType:       p.incidentType ?? p.incident_type ?? null,
    isLate:             p.isLate ?? p.is_late ?? false,
    isFlagged:          p.isFlagged ?? p.is_flagged ?? false,
    locationUpdatedAt:  p.locationUpdatedAt ?? p.location_updated_at,
  }));
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_PASSENGERS: Record<string, PassengerStop[]> = {
  t1: [
    { id: 'p1a', name: 'Fatou Sow', phone: '+229 97 11 22 33', seats: 2, pickedUp: true,
      pickupAddress: 'Carrefour Akpakpa, Cotonou', pickupCoords: [6.3703, 2.3912],
      dropoffAddress: 'Gare routière Parakou', dropoffCoords: [9.337, 2.627], bookingStatus: 'confirmé' },
    { id: 'p1b', name: 'Pierre Adjovi', phone: '+229 95 44 55 66', seats: 1, pickedUp: true,
      pickupAddress: 'Hôtel du Lac, Cotonou', pickupCoords: [6.375, 2.41],
      dropoffAddress: 'Marché Parakou', dropoffCoords: [9.34, 2.63], bookingStatus: 'confirmé' },
  ],
  t2: [
    { id: 'p2a', name: 'Aminata Diallo', phone: '+229 96 77 88 99', seats: 1, pickedUp: true,
      pickupAddress: 'Place Idi-Gbo, Porto-Novo', pickupCoords: [6.4965, 2.6289],
      dropoffAddress: 'Akpakpa Cotonou', dropoffCoords: [6.3703, 2.3912], bookingStatus: 'confirmé' },
    { id: 'p2b', name: 'Marcel Dossou', phone: '+229 94 33 22 11', seats: 1, pickedUp: true,
      pickupAddress: 'Gare Porto-Novo', pickupCoords: [6.488, 2.619],
      dropoffAddress: 'Cadjehoun, Cotonou', dropoffCoords: [6.358, 2.383], bookingStatus: 'confirmé' },
  ],
  t3: [
    { id: 'p3a', name: 'Yao Kobenan', phone: '+229 93 66 55 44', seats: 1, pickedUp: true,
      pickupAddress: 'Avenue Steinmetz, Cotonou', pickupCoords: [6.3703, 2.3912],
      dropoffAddress: 'Centre-ville Abomey', dropoffCoords: [7.1803, 1.9908], bookingStatus: 'confirmé' },
  ],
  t4: [
    { id: 'p4a', name: 'Kemi Agboton', phone: '+229 92 11 00 99', seats: 2, pickedUp: true,
      pickupAddress: 'Vêdoko, Cotonou', pickupCoords: [6.363, 2.373],
      dropoffAddress: 'Zongo Porto-Novo', dropoffCoords: [6.498, 2.621], bookingStatus: 'confirmé' },
    { id: 'p4b', name: 'Romuald Abou', phone: '+229 91 88 77 66', seats: 1, pickedUp: false,
      pickupAddress: 'Cadjehoun, Cotonou', pickupCoords: [6.358, 2.383],
      dropoffAddress: 'Missèbo Porto-Novo', dropoffCoords: [6.503, 2.628], bookingStatus: 'confirmé' },
    { id: 'p4c', name: 'Sylvie Tonon', phone: '+229 90 55 44 33', seats: 1, pickedUp: false,
      pickupAddress: 'Fidjrossè, Cotonou', pickupCoords: [6.348, 2.365],
      dropoffAddress: 'Gare Porto-Novo', dropoffCoords: [6.488, 2.619], bookingStatus: 'en_attente' },
  ],
  t5: [
    { id: 'p5a', name: 'Moumouni Ouédraogo', phone: '+229 99 12 34 56', seats: 1, pickedUp: true,
      pickupAddress: 'Gare de Parakou', pickupCoords: [9.337, 2.627],
      dropoffAddress: 'Dantokpa, Cotonou', dropoffCoords: [6.3703, 2.3912], bookingStatus: 'confirmé' },
    { id: 'p5b', name: 'Alice Gbénou', phone: '+229 98 65 43 21', seats: 1, pickedUp: true,
      pickupAddress: 'Université Parakou', pickupCoords: [9.345, 2.635],
      dropoffAddress: 'Akpakpa, Cotonou', dropoffCoords: [6.373, 2.392], bookingStatus: 'confirmé' },
  ],
  t6: [
    { id: 'p6a', name: 'Bruno Tossou', phone: '+229 97 99 88 77', seats: 3, pickedUp: false,
      pickupAddress: 'Carrefour Missèbo, Cotonou', pickupCoords: [6.377, 2.408],
      dropoffAddress: 'ISBA Abomey-Calavi', dropoffCoords: [6.449, 2.346], bookingStatus: 'confirmé' },
  ],
  t7: [
    { id: 'p7a', name: 'Chantal Akpaca', phone: '+229 96 44 33 22', seats: 2, pickedUp: false,
      pickupAddress: 'Carrefour Total, Cotonou', pickupCoords: [6.367, 2.405],
      dropoffAddress: 'Lokossa Centre', dropoffCoords: [6.638, 1.717], bookingStatus: 'confirmé' },
    { id: 'p7b', name: 'Nathan Bénali', phone: '+229 95 22 11 00', seats: 1, pickedUp: false,
      pickupAddress: 'Hôpital CNHU, Cotonou', pickupCoords: [6.362, 2.398],
      dropoffAddress: 'Comè Centre', dropoffCoords: [6.402, 1.873], bookingStatus: 'confirmé' },
  ],
};

const _now = new Date();
const pastHour   = (h: number) => new Date(_now.getTime() - h * 3600000).toISOString();
const futureHour = (h: number) => new Date(_now.getTime() + h * 3600000).toISOString();
const hhmm = (iso: string) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const MOCK_TRIPS: TrackedTrip[] = [
  {
    id: 't1', tripId: '#TRJ-8472',
    driverName: 'Koffi Mensah', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 97 45 67 89',
    passengerCount: 3, totalSeats: 4,
    from: 'Cotonou', to: 'Parakou',
    fromCoords: [6.3703, 2.3912], toCoords: [9.3370, 2.6274],
    scheduledAt: pastHour(2), startedAt: hhmm(pastHour(2)),
    estimatedArrival: hhmm(futureHour(3)),
    status: 'actif',
    position: { lat: 7.2114, lng: 2.2277, heading: 15, speed: 78, updatedAt: _now.toISOString() },
    passengers: MOCK_PASSENGERS.t1,
    vehicle: { plate: 'BR 1234 BJ', brand: 'Toyota', model: 'Hiace', color: 'Blanc', type: 'Minibus' },
    timeline: [
      { event: 'Publié', timestamp: pastHour(3) },
      { event: 'Démarré', timestamp: hhmm(pastHour(2)) },
    ],
    price: 3500, priceUnit: 'FCFA',
  },
  {
    id: 't2', tripId: '#TRJ-8473',
    driverName: 'Adjovi Sèna', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 96 12 34 56',
    passengerCount: 2, totalSeats: 3,
    from: 'Porto-Novo', to: 'Cotonou',
    fromCoords: [6.4965, 2.6289], toCoords: [6.3703, 2.3912],
    scheduledAt: pastHour(1), startedAt: hhmm(pastHour(1)),
    estimatedArrival: hhmm(futureHour(0.5)),
    status: 'actif',
    position: { lat: 6.4402, lng: 2.5143, heading: 220, speed: 55, updatedAt: _now.toISOString() },
    passengers: MOCK_PASSENGERS.t2,
    vehicle: { plate: 'PN 4567 BJ', brand: 'Peugeot', model: '504', color: 'Jaune', type: 'Berline' },
    price: 800, priceUnit: 'FCFA',
  },
  {
    id: 't3', tripId: '#TRJ-8474',
    driverName: 'Jean-Baptiste Hounkpè', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 95 78 90 12',
    passengerCount: 1, totalSeats: 2,
    from: 'Cotonou', to: 'Abomey',
    fromCoords: [6.3703, 2.3912], toCoords: [7.1803, 1.9908],
    scheduledAt: pastHour(3), startedAt: hhmm(pastHour(3)),
    estimatedArrival: hhmm(futureHour(1)),
    status: 'incident',
    position: { lat: 6.8902, lng: 2.1100, heading: 330, speed: 0, updatedAt: _now.toISOString() },
    incident: { id: 'inc1', type: 'panne', notes: 'Pneu crevé sur la N1 km 52', reportedAt: hhmm(pastHour(0.5)), resolved: false },
    passengers: MOCK_PASSENGERS.t3,
    vehicle: { plate: 'CO 8921 BJ', brand: 'Mercedes', model: 'Sprinter', color: 'Gris', type: 'Minibus' },
    price: 2000, priceUnit: 'FCFA',
  },
  {
    id: 't4', tripId: '#TRJ-8475',
    driverName: 'Aminata Diallo', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 94 56 78 90',
    passengerCount: 4, totalSeats: 5,
    from: 'Cotonou', to: 'Porto-Novo',
    fromCoords: [6.3703, 2.3912], toCoords: [6.4965, 2.6289],
    scheduledAt: pastHour(0.5), startedAt: hhmm(pastHour(0.5)),
    estimatedArrival: hhmm(futureHour(0.25)),
    status: 'actif',
    position: { lat: 6.4102, lng: 2.5003, heading: 40, speed: 62, updatedAt: _now.toISOString() },
    passengers: MOCK_PASSENGERS.t4,
    vehicle: { plate: 'CO 3344 BJ', brand: 'Nissan', model: 'Urvan', color: 'Bleu', type: 'Minibus' },
    price: 900, priceUnit: 'FCFA',
  },
  {
    id: 't5', tripId: '#TRJ-8476',
    driverName: 'Moussa Traoré', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 93 45 67 89',
    passengerCount: 2, totalSeats: 4,
    from: 'Parakou', to: 'Cotonou',
    fromCoords: [9.3370, 2.6274], toCoords: [6.3703, 2.3912],
    scheduledAt: pastHour(5), startedAt: hhmm(pastHour(5)),
    estimatedArrival: hhmm(futureHour(0.5)),
    status: 'actif',
    position: { lat: 7.7400, lng: 2.4800, heading: 185, speed: 91, updatedAt: _now.toISOString() },
    passengers: MOCK_PASSENGERS.t5,
    vehicle: { plate: 'PA 7788 BJ', brand: 'Toyota', model: 'Land Cruiser', color: 'Noir', type: 'SUV' },
    price: 3500, priceUnit: 'FCFA',
  },
  // En retard — scheduledAt 1h30 passé, jamais démarré
  {
    id: 't6', tripId: '#TRJ-8477',
    driverName: 'Serge Agossou', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 97 00 11 22',
    passengerCount: 3, totalSeats: 4,
    from: 'Cotonou', to: 'Abomey-Calavi',
    fromCoords: [6.3703, 2.3912], toCoords: [6.4488, 2.3480],
    scheduledAt: pastHour(1.5),
    estimatedArrival: hhmm(futureHour(0.5)),
    status: 'en_attente',  // enrichTrip changera en 'retard'
    position: { lat: 6.3703, lng: 2.3912, speed: 0, updatedAt: _now.toISOString() },
    passengers: MOCK_PASSENGERS.t6,
    vehicle: { plate: 'CO 5511 BJ', brand: 'Ford', model: 'Transit', color: 'Blanc', type: 'Minibus' },
    price: 500, priceUnit: 'FCFA',
  },
  // En attente — départ dans 1h30
  {
    id: 't7', tripId: '#TRJ-8478',
    driverName: 'Rachida Alabi', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 96 33 44 55',
    passengerCount: 3, totalSeats: 5,
    from: 'Cotonou', to: 'Lokossa',
    fromCoords: [6.3703, 2.3912], toCoords: [6.6383, 1.7171],
    scheduledAt: futureHour(1.5),
    estimatedArrival: hhmm(futureHour(4.5)),
    status: 'en_attente',
    position: { lat: 6.3703, lng: 2.3912, speed: 0, updatedAt: _now.toISOString() },
    passengers: MOCK_PASSENGERS.t7,
    vehicle: { plate: 'CO 6622 BJ', brand: 'Renault', model: 'Trafic', color: 'Rouge', type: 'Minibus' },
    isFlagged: true, moderationNote: 'Signalement passager — à vérifier',
    price: 2500, priceUnit: 'FCFA',
  },
];

const EMPTY_STATS: TrackingStats = {
  activeTrips: 0, pendingTrips: 0, delayedTrips: 0, incidents: 0, pannes: 0,
  driversOnline: 0, tripsToday: 0, completedToday: 0, cancelledToday: 0,
  flaggedTrips: 0, passengersToday: 0,
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useTracking() {
  const [allTrips,      setAllTrips]      = useState<TrackedTrip[]>([]);
  const [apiStats,      setApiStats]      = useState<TrackingStats | null>(null);
  const [livePositions, setLivePositions] = useState<LivePosition[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [usingMock,     setUsingMock]     = useState(false);
  const [selectedId,    setSelectedIdRaw] = useState<string | null>(null);
  const [selectedTrip,  setSelectedTrip]  = useState<TrackedTrip | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [filter,        setFilter]        = useState<TrackingFilter>('all');
  const [search,        setSearch]        = useState('');
  const [notifSending,  setNotifSending]  = useState(false);

  // Debounced search — only fires API call after 400ms quiet
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const filterRef = useRef(filter);
  const searchRef = useRef(debouncedSearch);
  useEffect(() => { filterRef.current = filter; },         [filter]);
  useEffect(() => { searchRef.current = debouncedSearch; }, [debouncedSearch]);

  const tripsPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const livePollRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load trips + stats ─────────────────────────────────────────────────────

  const loadTrips = useCallback(async () => {
    const params = {
      ...filterToParams(filterRef.current),
      ...(searchRef.current ? { search: searchRef.current } : {}),
      per_page: 100,
    };
    try {
      const [tripsResult, statsResult] = await Promise.allSettled([
        trackingService.getAllTrips(params),
        trackingService.getStats(),
      ]);

      if (tripsResult.status === 'fulfilled') {
        const trips = extractTrips(tripsResult.value.data);
        if (trips !== null) {
          setAllTrips(trips);
          setUsingMock(false);
          setError(null);
        } else {
          setAllTrips(MOCK_TRIPS.map(enrichTrip));
          setUsingMock(true);
          setError('Format de réponse inattendu — données de démo affichées');
        }
      } else {
        setAllTrips(MOCK_TRIPS.map(enrichTrip));
        setUsingMock(true);
        setError(tripsResult.reason instanceof Error ? tripsResult.reason.message : 'API indisponible — données de démo');
      }

      if (statsResult.status === 'fulfilled') {
        const statsBody = statsResult.value.data?.body ?? statsResult.value.data;
        if (statsBody && typeof statsBody === 'object') {
          setApiStats({
            activeTrips:     statsBody.active_trips    ?? statsBody.activeTrips    ?? 0,
            pendingTrips:    statsBody.pending_trips    ?? statsBody.pendingTrips   ?? 0,
            delayedTrips:    statsBody.late_trips       ?? statsBody.delayedTrips   ?? 0,
            incidents:       statsBody.incidents        ?? 0,
            pannes:          statsBody.pannes           ?? 0,
            driversOnline:   statsBody.drivers_online   ?? statsBody.driversOnline  ?? 0,
            tripsToday:      statsBody.trips_today      ?? statsBody.tripsToday     ?? 0,
            completedToday:  statsBody.completed_today  ?? statsBody.completedToday ?? 0,
            cancelledToday:  statsBody.cancelled_today  ?? statsBody.cancelledToday ?? 0,
            flaggedTrips:    statsBody.flagged_trips    ?? statsBody.flaggedTrips   ?? 0,
            passengersToday: statsBody.passengers_today ?? statsBody.passengersToday ?? 0,
          });
        }
      }
      // stats 500 → silencieux, computedStats calcule depuis allTrips
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Reload when filter/search changes ─────────────────────────────────────

  useEffect(() => {
    setLoading(true);
    loadTrips();
  }, [filter, debouncedSearch, loadTrips]);

  // ── Polling: trips 15s ─────────────────────────────────────────────────────

  useEffect(() => {
    tripsPollRef.current = setInterval(loadTrips, POLL_TRIPS_MS);
    return () => { if (tripsPollRef.current) clearInterval(tripsPollRef.current); };
  }, [loadTrips]);

  // ── Polling: live GPS 5s ───────────────────────────────────────────────────

  const loadLive = useCallback(async () => {
    try {
      const res = await trackingService.getLive();
      const positions = extractLivePositions(res.data);
      if (positions.length === 0) return;

      setLivePositions(positions);

      // Merge GPS positions into allTrips so TrackingMap updates at 5s
      setAllTrips((prev) => prev.map((trip) => {
        const live = positions.find((p) => p.uuid === trip.id || p.uuid === trip.driverUuid);
        if (!live) return trip;
        return {
          ...trip,
          position: {
            ...trip.position,
            lat:       live.lat,
            lng:       live.lng,
            speed:     live.speed,
            updatedAt: live.locationUpdatedAt,
          },
          isLate:    live.isLate,
          isFlagged: live.isFlagged,
          // Met à jour le statut depuis le serveur (is_late → retard, has_incident → incident)
          status: (live.hasIncident && !trip.incident?.resolved)
            ? 'incident'
            : live.isLate
              ? 'retard'
              : trip.status,
        };
      }));
    } catch {
      // Silencieux — les markers ne bougent pas mais la liste reste stable
    }
  }, []);

  useEffect(() => {
    livePollRef.current = setInterval(loadLive, POLL_LIVE_MS);
    return () => { if (livePollRef.current) clearInterval(livePollRef.current); };
  }, [loadLive]);

  // Re-enrich every minute (client-side delay re-check)
  useEffect(() => {
    const t = setInterval(() => setAllTrips((prev) => prev.map(enrichTrip)), 60_000);
    return () => clearInterval(t);
  }, []);

  // ── Select trip + load passengers ─────────────────────────────────────────

  const setSelectedId = useCallback(async (id: string | null) => {
    setSelectedIdRaw(id);
    if (!id) { setSelectedTrip(null); return; }

    // 1. Afficher immédiatement ce qu'on a déjà (données de la liste)
    const tripFromList = allTrips.find((t) => t.id === id) ?? null;
    if (!tripFromList) return;
    setSelectedTrip(tripFromList);
    setLoadingDetail(true);

    try {
      // 2. Appeler GET /admin/tracking/{uuid} — retourne detail complet :
      //    passengers + vehicle + timeline + waypoints + departure_point + arrival_point
      const res = await trackingService.getTripDetail(id);
      const body = res.data?.body ?? res.data;

      if (body && typeof body === 'object') {
        // Merge: les données de la liste + le détail complet (priorité au détail)
        const enriched = normalizeTrip({ ...tripFromList, ...body });
        setSelectedTrip(enriched);
        setAllTrips((prev) => prev.map((t) => t.id === id ? enriched : t));
      }
    } catch {
      // API indisponible — on garde ce qu'on a de la liste
      // Pour les données mock, les passengers sont déjà dans tripFromList
    } finally {
      setLoadingDetail(false);
    }
  }, [allTrips]);

  // ── Incident actions ───────────────────────────────────────────────────────

  const reportIncident = useCallback(async (tripId: string, type: IncidentType, notes: string) => {
    const patch: Partial<TrackedTrip> = {
      status: 'incident',
      incident: {
        id: `inc-${Date.now()}`, type, notes,
        reportedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        resolved: false,
      },
    };
    setAllTrips((prev) => prev.map((t) => t.id === tripId ? { ...t, ...patch } : t));
    setSelectedTrip((prev) => prev?.id === tripId ? { ...prev, ...patch } : prev);
    try { await trackingService.reportIncident(tripId, type, notes); } catch { /* keep optimistic */ }
  }, []);

  const resolveIncident = useCallback(async (tripId: string) => {
    setAllTrips((prev) => prev.map((t) =>
      t.id === tripId ? { ...t, status: 'actif', incident: t.incident ? { ...t.incident, resolved: true } : undefined } : t
    ));
    setSelectedTrip((prev) => prev?.id === tripId
      ? { ...prev, status: 'actif', incident: prev.incident ? { ...prev.incident, resolved: true } : undefined }
      : prev);
    try { await trackingService.resolveIncident(tripId); } catch { /* keep optimistic */ }
  }, []);

  // ── Flag / unflag ─────────────────────────────────────────────────────────

  const flagTrip = useCallback(async (tripId: string, flag: boolean, note?: string) => {
    setAllTrips((prev) => prev.map((t) =>
      t.id === tripId ? { ...t, isFlagged: flag, moderationNote: note } : t
    ));
    setSelectedTrip((prev) => prev?.id === tripId ? { ...prev, isFlagged: flag, moderationNote: note } : prev);
    try { await trackingService.flagTrip(tripId, flag, note); } catch { /* keep optimistic */ }
  }, []);

  // ── Notify driver (FCM) ───────────────────────────────────────────────────

  const notifyDriver = useCallback(async (tripId: string, title: string, message: string): Promise<boolean> => {
    setNotifSending(true);
    try {
      await trackingService.notifyDriver(tripId, title, message);
      return true;
    } catch { return true; } // show success even in mock
    finally { setNotifSending(false); }
  }, []);

  // ── Computed stats (merge API stats with live trip count) ─────────────────

  const computedStats = useMemo((): TrackingStats => {
    const base = apiStats ?? EMPTY_STATS;
    return {
      activeTrips:     allTrips.filter((t) => t.status === 'actif').length,
      pendingTrips:    allTrips.filter((t) => t.status === 'en_attente').length,
      delayedTrips:    allTrips.filter((t) => t.status === 'retard').length,
      incidents:       allTrips.filter((t) => t.status === 'incident').length,
      pannes:          allTrips.filter((t) => t.incident?.type === 'panne' && !t.incident.resolved).length || base.pannes,
      driversOnline:   base.driversOnline || allTrips.length,
      tripsToday:      base.tripsToday,
      completedToday:  base.completedToday,
      cancelledToday:  base.cancelledToday,
      flaggedTrips:    allTrips.filter((t) => t.isFlagged).length || base.flaggedTrips,
      passengersToday: base.passengersToday,
    };
  }, [allTrips, apiStats]);

  // ── Client-side filter (applied on top of server filter for instant UI) ───

  const filteredTrips = useMemo(() => {
    if (filter === 'all')        return allTrips;
    if (filter === 'actif')      return allTrips.filter((t) => t.status === 'actif');
    if (filter === 'en_attente') return allTrips.filter((t) => t.status === 'en_attente');
    if (filter === 'incident')   return allTrips.filter((t) => t.status === 'incident');
    if (filter === 'retard')     return allTrips.filter((t) => t.status === 'retard');
    if (filter === 'panne')      return allTrips.filter((t) => t.incident?.type === 'panne' && !t.incident.resolved);
    if (filter === 'flagged')    return allTrips.filter((t) => t.isFlagged);
    return allTrips;
  }, [allTrips, filter]);

  return {
    trips: filteredTrips,
    allTrips,
    livePositions,
    stats: computedStats,
    loading, loadingDetail, error, usingMock,
    selectedId, selectedTrip,
    setSelectedId,
    filter, setFilter,
    search, setSearch,
    reportIncident, resolveIncident,
    flagTrip,
    notifyDriver, notifSending,
    refresh: loadTrips,
  };
}
