export type IncidentType  = 'panne' | 'urgence' | 'autre';
export type TrackedStatus = 'actif' | 'incident' | 'terminé';

export interface TripPosition {
  lat:       number;
  lng:       number;
  heading?:  number;
  speed?:    number;
  updatedAt: string;
}

export interface TripIncident {
  id:         string;
  type:       IncidentType;
  notes:      string;
  reportedAt: string;
  resolved:   boolean;
}

export interface TrackedTrip {
  id:                string;
  tripId:            string;
  driverName:        string;
  driverAvatar:      string;
  driverPhone:       string;
  passengerCount:    number;
  from:              string;
  to:                string;
  fromCoords:        [number, number];
  toCoords:          [number, number];
  startedAt:         string;
  estimatedArrival:  string;
  status:            TrackedStatus;
  position:          TripPosition;
  incident?:         TripIncident;
}

export interface TrackingStats {
  activeTrips:   number;
  incidents:     number;
  driversOnline: number;
  tripsToday:    number;
}
