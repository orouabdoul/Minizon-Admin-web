export type TripStatus = 'Actif' | 'Terminé' | 'Annulé' | 'Signalé';

// ── Internal models ────────────────────────────────────────────────────────────

export interface TripPassenger {
  id:                  string;
  avatar:              string;
  // Enhanced fields (available from detail endpoint)
  name?:               string;
  bookingUuid?:        string;
  seatsBooked?:        number;
  calculatedPrice?:    number;
  calculatedPriceFmt?: string;
  distanceKm?:         number;
  status?:             'pending' | 'accepted';
}

export interface Trip {
  id:              string;
  tripId:          string;
  driverName:      string;
  driverRating:    number;
  driverReviews:   number;
  driverAvatar:    string;
  from:            string;
  to:              string;
  date:            string;
  time:            string;
  seats:           number;
  pricePerSeat:    string;
  pricePerSeatRaw: number;
  passengers:      TripPassenger[];
  seatsBooked:     number;
  bookingsCount:   number;
  revenue:         string;
  revenueRaw:      number;
  status:          TripStatus;
}

export interface TripMetrics {
  total:         number;
  completed:     number;
  reported:      number;
  total_revenue: number;
}

// ── API shape ──────────────────────────────────────────────────────────────────
// The API already returns camelCase, pre-formatted strings for money/dates.

export interface ApiTripPassenger {
  id:                     string;
  booking_uuid?:          string;
  name?:                  string;
  avatar?:                string | null;
  seats_booked?:          number;
  calculated_price?:      number;
  calculated_price_fmt?:  string;
  passenger_distance_km?: number;
  status?:                'pending' | 'accepted';
}

export interface ApiTrip {
  id:              string;
  tripId?:         string;          // "TRP-A3B4C5D6"
  driverName?:     string;
  driverAvatar?:   string | null;
  driverRating?:   number;
  driverReviews?:  number;
  from?:           string;
  to?:             string;
  date?:           string;          // already formatted "14/06/2025"
  time?:           string;          // already formatted "08:30"
  seats?:          number;
  seatsBooked?:    number;
  bookingsCount?:  number;
  pricePerSeat?:   string;          // formatted "2 500 FCFA"
  pricePerSeatRaw?:number;
  revenue?:        string;          // formatted "5 000 FCFA"
  revenueRaw?:     number;
  status:          string;          // French or English
  passengers?:     ApiTripPassenger[];
}

// ── Mapper ─────────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, TripStatus> = {
  Actif: 'Actif', Terminé: 'Terminé', Annulé: 'Annulé', Signalé: 'Signalé',
  active: 'Actif', completed: 'Terminé', cancelled: 'Annulé',
  flagged: 'Signalé', pending: 'Actif',
};

export function mapApiTripToTrip(d: ApiTrip): Trip {
  const passengers = (d.passengers ?? []).map((p) => ({
    id:                p.id,
    avatar:            p.avatar ?? 'https://placehold.co/24x24',
    name:              p.name,
    bookingUuid:       p.booking_uuid,
    seatsBooked:       p.seats_booked,
    calculatedPrice:   p.calculated_price,
    calculatedPriceFmt:p.calculated_price_fmt,
    distanceKm:        p.passenger_distance_km,
    status:            p.status,
  }));

  return {
    id:              d.id,
    tripId:          d.tripId ?? `TRJ-${d.id.slice(-6).toUpperCase()}`,
    driverName:      d.driverName  ?? 'Inconnu',
    driverRating:    d.driverRating  ?? 0,
    driverReviews:   d.driverReviews ?? 0,
    driverAvatar:    d.driverAvatar  ?? 'https://placehold.co/40x40',
    from:            d.from ?? '',
    to:              d.to   ?? '',
    date:            d.date ?? '',
    time:            d.time ?? '',
    seats:           d.seats    ?? 0,
    pricePerSeat:    d.pricePerSeat    ?? '0 FCFA',
    pricePerSeatRaw: d.pricePerSeatRaw ?? 0,
    passengers,
    seatsBooked:   d.seatsBooked   ?? 0,
    bookingsCount: d.bookingsCount ?? 0,
    revenue:       d.revenue    ?? '0 FCFA',
    revenueRaw:    d.revenueRaw ?? 0,
    status:        STATUS_MAP[d.status] ?? 'Actif',
  };
}
