export type VehicleStatus    = 'Actif' | 'En inspection' | 'Suspendu' | 'Rejeté';
export type VehicleType      = 'Berline' | 'SUV' | 'Moto' | 'Van' | 'Minibus';
export type VehicleDocStatus = 'ok' | 'pending' | 'rejected';

export interface VehicleMetrics {
  total:      number;
  actif:      number;
  inspection: number;
  suspendu:   number;
}

export interface VehicleDocuments {
  carteGrise:    VehicleDocStatus;
  carteGriseUrl?: string;
  assurance:     VehicleDocStatus;
  assuranceUrl?:  string;
  visite?:        VehicleDocStatus;
  visiteUrl?:     string;
}

export interface Vehicle {
  id:            string;
  vehicleId:     string;
  // Driver
  driverName:    string;
  driverAvatar:  string;
  driverId:      string;
  driverPhone:   string;
  // Vehicle
  make:          string;
  model:         string;
  year:          number;
  type:          VehicleType;
  plate:         string;
  color:         string;
  seats:         number;
  status:        VehicleStatus;
  vehiclePhoto?: string;
  // Documents
  documents: VehicleDocuments;
  // Stats
  trips:        number;
  rating:       number;
  registeredAt: string;
}
