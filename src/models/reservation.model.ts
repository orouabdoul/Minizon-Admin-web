export type ReservationStatus = 'Confirmée' | 'En attente' | 'Annulée' | 'Terminée';
export type ReservationRisk   = 'Faible' | 'Moyen' | 'Élevé';
export type PaymentStatus     = 'Payé' | 'En attente' | 'Échoué' | 'Remboursé';

export interface Reservation {
  id:                string;
  reservationId:     string;
  createdAt:         string;
  createdAgo:        string;
  passengerName:     string;
  passengerAvatar:   string;
  passengerVerified: boolean;
  driverName:        string;
  driverAvatar:      string;
  driverRating:      number;
  from:              string;
  to:                string;
  seats:             number;
  date:              string;
  time:              string;
  amount:            string;
  paymentStatus:     PaymentStatus;
  status:            ReservationStatus;
  riskLevel:         ReservationRisk;
  timelineEvents:    { label: string; time: string; done: boolean }[];
}

export interface ReservationMetrics {
  total:          number;
  confirmed:      number;
  cancelled:      number;
  total_revenue:  string | number;
  average_rating: number;
}

// ── API shape ──────────────────────────────────────────────────────────────────

export interface ApiReservation {
  id:                string;
  reservationId:     string;
  createdAt:         string;
  createdAgo?:       string;
  passengerName:     string;
  passengerAvatar?:  string | null;
  passengerVerified: boolean;
  driverName:        string;
  driverAvatar?:     string | null;
  driverRating:      number;
  from:              string;
  to:                string;
  seats:             number;
  date:              string;
  time:              string;
  amount:            string;
  paymentStatus:     string;
  status:            string;
  riskLevel?:        string;
  timelineEvents?:   { label: string; time: string; status?: string; done?: boolean }[];
}

// ── Mapper ─────────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, ReservationStatus> = {
  Confirmée: 'Confirmée', 'En attente': 'En attente', Annulée: 'Annulée', Terminée: 'Terminée',
};
const PAYMENT_MAP: Record<string, PaymentStatus> = {
  Payé: 'Payé', 'En attente': 'En attente', Échoué: 'Échoué', Remboursé: 'Remboursé',
};
const RISK_MAP: Record<string, ReservationRisk> = {
  Faible: 'Faible', Moyen: 'Moyen', Élevé: 'Élevé',
};

export function mapApiReservationToReservation(r: ApiReservation): Reservation {
  const timelineEvents = (r.timelineEvents ?? []).map((e) => ({
    label: e.label,
    time:  e.time,
    done:  e.done ?? e.status === 'done',
  }));

  return {
    id:                r.id,
    reservationId:     r.reservationId,
    createdAt:         r.createdAt,
    createdAgo:        r.createdAgo ?? '',
    passengerName:     r.passengerName,
    passengerAvatar:   r.passengerAvatar ?? 'https://placehold.co/40x40',
    passengerVerified: r.passengerVerified,
    driverName:        r.driverName,
    driverAvatar:      r.driverAvatar ?? 'https://placehold.co/40x40',
    driverRating:      r.driverRating,
    from:              r.from,
    to:                r.to,
    seats:             r.seats,
    date:              r.date,
    time:              r.time,
    amount:            r.amount,
    paymentStatus:     PAYMENT_MAP[r.paymentStatus] ?? 'En attente',
    status:            STATUS_MAP[r.status]         ?? 'En attente',
    riskLevel:         RISK_MAP[r.riskLevel ?? '']  ?? 'Faible',
    timelineEvents,
  };
}
