export type PassengerStatus  = 'Actif' | 'Inactif' | 'Suspendu';
export type RiskLevel        = 'Faible' | 'Moyen' | 'Élevé';
export type ActivityStatus   = 'En ligne' | 'Hors ligne';

export interface Passenger {
  id:             string;
  passengerId:    string;
  name:           string;
  phone:          string;
  email:          string | null;
  city:           string | null;
  reservations:   number;
  spending:       string;
  rating:         number | null;
  trustScore:     number;
  createdAt:      string;
  createdAgo:     string;
  lastActivity:   string;
  activityStatus: ActivityStatus;
  status:         PassengerStatus;
  riskLevel:      RiskLevel;
}

export interface PassengerMetrics {
  total:             number;
  active:            number;
  new_this_month:    number;
  bookings_month:    number;
  cancellation_rate: number;
  incidents:         number;
  avg_rating:        number | null;
  suspended:         number;
}
