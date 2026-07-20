export type PayoutStatus = 'en_attente' | 'en_traitement' | 'payé' | 'échoué';
export type PayoutMethod = 'MTN Mobile Money' | 'Moov Money' | 'Virement bancaire';

export interface DriverPayout {
  id:           string;
  driverId:     string;
  driverName:   string;
  driverAvatar: string;
  driverPhone:  string;
  period:       string;
  tripsCount:   number;
  grossAmount:  number;
  commission:   number;
  netAmount:    number;
  method:       PayoutMethod;
  status:       PayoutStatus;
  processedAt?: string;
  reference?:   string;
}

export interface PayoutSummary {
  totalPending:  number;
  totalPaid:     number;
  totalDrivers:  number;
  pendingAmount: number;
}
