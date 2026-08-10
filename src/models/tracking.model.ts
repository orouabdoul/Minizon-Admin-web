export type IncidentType  = 'panne' | 'urgence' | 'autre';
export type TrackedStatus = 'actif' | 'incident' | 'en_attente' | 'retard' | 'terminé' | 'annulé';
export type TrackingFilter = 'all' | 'actif' | 'en_attente' | 'incident' | 'retard' | 'panne' | 'flagged';

export interface TripPosition {
  lat:        number;
  lng:        number;
  heading?:   number;
  speed?:     number;
  updatedAt?: string;
}

export interface TripIncident {
  id:          string;
  type:        IncidentType;
  notes:       string;
  reportedAt?: string;
  resolved:    boolean;
}

export interface PassengerStop {
  id:             string;
  name:           string;
  avatar?:        string;
  phone?:         string;
  seats:          number;
  pickedUp?:      boolean;
  // Pickup/dropoff accept both tuple (mock) and object (API) formats
  pickupAddress:  string;
  pickupCoords?:  [number, number];
  pickup?:        { lat: number; lng: number; address?: string };
  dropoffAddress: string;
  dropoffCoords?: [number, number];
  dropoff?:       { lat: number; lng: number; address?: string };
  bookingStatus:  'confirmé' | 'en_attente' | 'annulé';
}

export interface Vehicle {
  plate?:  string;
  brand?:  string;
  model?:  string;
  color?:  string;
  type?:   string;
}

export interface TripTimelineEvent {
  event:     string;
  timestamp: string;
  note?:     string;
}

export interface TripWaypoint {
  lat:     number;
  lng:     number;
  address?: string;
}

export interface TrackedTrip {
  id:               string;
  tripId:           string;
  driverName:       string;
  driverAvatar:     string;
  driverPhone:      string;
  driverUuid?:      string;
  passengerCount:   number;
  totalSeats?:      number;
  from:             string;
  to:               string;
  fromCoords?:      [number, number];
  toCoords?:        [number, number];
  departurePoint?:  { lat: number; lng: number };
  arrivalPoint?:    { lat: number; lng: number };
  scheduledAt?:     string;
  startedAt?:       string;
  estimatedArrival: string;
  status:           TrackedStatus;
  position:         TripPosition;
  incident?:        TripIncident;
  passengers?:      PassengerStop[];
  delayMinutes?:    number;
  isLate?:          boolean;      // calculé côté serveur
  isFlagged?:       boolean;
  moderationNote?:  string;
  vehicle?:         Vehicle;
  timeline?:        TripTimelineEvent[];
  waypoints?:       TripWaypoint[];
  price?:           number;
  priceUnit?:       string;
}

export interface TripListBody {
  trips: TrackedTrip[];
}

export interface TrackingStats {
  activeTrips:      number;
  pendingTrips:     number;
  delayedTrips:     number;
  incidents:        number;
  pannes:           number;
  driversOnline:    number;
  tripsToday:       number;
  completedToday:   number;
  cancelledToday:   number;
  flaggedTrips:     number;
  passengersToday:  number;
}

// Lightweight position update from /live endpoint
export interface LivePosition {
  uuid:               string;
  lat:                number;
  lng:                number;
  speed?:             number;
  status:             TrackedStatus;
  hasIncident:        boolean;
  incidentType?:      IncidentType | null;
  isLate:             boolean;
  isFlagged:          boolean;
  locationUpdatedAt?: string;
}
