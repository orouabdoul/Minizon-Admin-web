export type TripStatus = 'Actif' | 'Terminé' | 'Annulé' | 'Signalé';

export interface TripPassenger {
  id:     string;
  avatar: string;
}

export interface Trip {
  id:            string;
  tripId:        string;
  driverName:    string;
  driverRating:  number;
  driverReviews: number;
  driverAvatar:  string;
  from:          string;
  to:            string;
  date:          string;
  time:          string;
  seats:         number;
  pricePerSeat:  string;
  passengers:    TripPassenger[];
  seatsBooked:   number;
  revenue:       string;
  status:        TripStatus;
}

export interface TripMetrics {
  total:         number;
  completed:     number;
  reported:      number;
  total_revenue: number;
}

// ── API shape ──────────────────────────────────────────────────────────────────

export interface ApiTripPassenger {
  id:      string;
  name?:   string;
  avatar?: string | null;
}

export interface ApiTrip {
  id:              string;
  trip_id?:        string;
  driver?: {
    id?:      string;
    name?:    string;
    rating?:  number;
    reviews?: number;
    avatar?:  string | null;
    phone?:   string;
  };
  // flat driver fields (fallback)
  driver_name?:    string;
  driver_rating?:  number;
  driver_reviews?: number;
  driver_avatar?:  string | null;
  departure:       string;
  destination:     string;
  departure_at?:   string;   // ISO datetime e.g. "2024-01-24T14:30:00Z"
  date?:           string;
  time?:           string;
  total_seats:     number;
  price_per_seat:  number | string;
  passengers?:     ApiTripPassenger[];
  booked_seats?:   number;
  revenue?:        number | string;
  status:          string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtMoney(v: number | string | undefined): string {
  if (!v && v !== 0) return '0 FCFA';
  const n = typeof v === 'string' ? parseFloat(v.replace(/[^\d.]/g, '')) : v;
  return `${isNaN(n) ? 0 : n.toLocaleString('fr-FR')} FCFA`;
}

function fmtDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// ── Mapper ─────────────────────────────────────────────────────────────────────

export function mapApiTripToTrip(d: ApiTrip): Trip {
  const drv = d.driver;
  const driverName    = drv?.name    ?? d.driver_name    ?? 'Inconnu';
  const driverRating  = drv?.rating  ?? d.driver_rating  ?? 0;
  const driverReviews = drv?.reviews ?? d.driver_reviews ?? 0;
  const driverAvatar  = drv?.avatar  ?? d.driver_avatar  ?? 'https://placehold.co/40x40';

  const hasDeparturAt = !!d.departure_at;
  const date = hasDeparturAt ? fmtDate(d.departure_at) : (d.date ?? '');
  const time = hasDeparturAt ? fmtTime(d.departure_at) : (d.time ?? '');

  const passengers = (d.passengers ?? []).map((p) => ({
    id:     p.id,
    avatar: p.avatar ?? 'https://placehold.co/24x24',
  }));

  const STATUS_MAP: Record<string, TripStatus> = {
    active: 'Actif', completed: 'Terminé', cancelled: 'Annulé', flagged: 'Signalé',
    Actif: 'Actif', Terminé: 'Terminé', Annulé: 'Annulé', Signalé: 'Signalé',
  };

  return {
    id:            d.id,
    tripId:        d.trip_id ? `#${d.trip_id}` : `#TRJ-${d.id.slice(-6).toUpperCase()}`,
    driverName,
    driverRating,
    driverReviews,
    driverAvatar,
    from:          d.departure,
    to:            d.destination,
    date,
    time,
    seats:         d.total_seats ?? 0,
    pricePerSeat:  fmtMoney(d.price_per_seat),
    passengers,
    seatsBooked:   d.booked_seats ?? 0,
    revenue:       fmtMoney(d.revenue),
    status:        STATUS_MAP[d.status] ?? 'Actif',
  };
}
