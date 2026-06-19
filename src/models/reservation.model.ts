export type ReservationStatus  = 'Confirmée' | 'En attente' | 'Annulée' | 'Terminée';
export type ReservationRisk    = 'Faible' | 'Moyen' | 'Élevé';
export type PaymentStatus      = 'Payé' | 'En attente' | 'Échoué' | 'Remboursé';

export interface Reservation {
  id:              string;
  reservationId:   string;      // ex: 'RES-2024-001'
  createdAt:       string;      // ex: '15 Jan 2024, 12:30'
  createdAgo:      string;      // ex: 'Il y a 2h'
  passengerName:   string;
  passengerAvatar: string;
  passengerVerified: boolean;
  driverName:      string;
  driverAvatar:    string;
  driverRating:    number;
  from:            string;
  to:              string;
  seats:           number;
  date:            string;
  time:            string;
  amount:          string;      // ex: '45,000 FCFA'
  paymentStatus:   PaymentStatus;
  status:          ReservationStatus;
  riskLevel:       ReservationRisk;
  timelineEvents:  { label: string; time: string; done: boolean }[];
}
