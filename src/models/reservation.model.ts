export type ReservationStatus = 'Confirmée' | 'En attente' | 'Annulée' | 'Terminée';
export type ReservationRisk   = 'Faible' | 'Moyen' | 'Élevé';
export type PaymentStatus     = 'Payé' | 'En attente' | 'Échoué' | 'Remboursé';

// API status values accepted by PUT /admin/reservations/{uuid}
export type ApiReservationStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

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
  // Legacy French field
  paymentStatus?:    string;
  // New fields from backend update
  payment_status?:   string;   // 'unpaid' | 'escrow_locked' | 'released_to_driver' | 'refunded'
  is_paid?:          boolean;
  status:            string;
  riskLevel?:        string;
  timelineEvents?:   { label: string; time: string; status?: string; done?: boolean }[];
}

// ── Mappers ────────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, ReservationStatus> = {
  Confirmée: 'Confirmée', 'En attente': 'En attente', Annulée: 'Annulée', Terminée: 'Terminée',
  // English API values
  accepted: 'Confirmée', pending: 'En attente', rejected: 'Annulée', cancelled: 'Annulée',
};

const PAYMENT_MAP: Record<string, PaymentStatus> = {
  // French (legacy)
  Payé: 'Payé', 'En attente': 'En attente', Échoué: 'Échoué', Remboursé: 'Remboursé',
  // English (new backend fields)
  unpaid:             'En attente',
  escrow_locked:      'Payé',
  released_to_driver: 'Payé',
  refunded:           'Remboursé',
};

const RISK_MAP: Record<string, ReservationRisk> = {
  Faible: 'Faible', Moyen: 'Moyen', Élevé: 'Élevé',
};

// Human-readable labels for API status values (used in status change UI)
export const API_STATUS_LABELS: Record<ApiReservationStatus, string> = {
  pending:   'En attente',
  accepted:  'Confirmer',
  rejected:  'Rejeter',
  cancelled: 'Annuler',
};

export function mapApiReservationToReservation(r: ApiReservation): Reservation {
  const timelineEvents = (r.timelineEvents ?? []).map((e) => ({
    label: e.label,
    time:  e.time,
    done:  e.done ?? e.status === 'done',
  }));

  // Prefer new payment_status field, fall back to legacy paymentStatus
  const rawPayment = r.payment_status ?? r.paymentStatus ?? '';

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
    paymentStatus:     PAYMENT_MAP[rawPayment] ?? 'En attente',
    status:            STATUS_MAP[r.status]         ?? 'En attente',
    riskLevel:         RISK_MAP[r.riskLevel ?? '']  ?? 'Faible',
    timelineEvents,
  };
}
