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
