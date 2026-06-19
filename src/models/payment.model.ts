export type PaymentMethod  = 'Mobile Money' | 'Carte bancaire' | 'Virement' | 'Cash';
export type PaymentTxStatus = 'Succès' | 'En attente' | 'Échoué' | 'Remboursé';

export interface Payment {
  id:              string;
  transactionId:   string;      // ex: 'TXN-2024-0012'
  reservationId:   string;      // ex: 'RES-2024-001'
  passengerName:   string;
  passengerAvatar: string;
  driverName:      string;
  driverAvatar:    string;
  amount:          string;      // ex: '45,000 FCFA'
  method:          PaymentMethod;
  date:            string;
  time:            string;
  createdAgo:      string;
  status:          PaymentTxStatus;
  reference:       string;      // ex: 'MM-BJ-8472'
  fee:             string;      // ex: '900 FCFA'
  net:             string;      // ex: '44,100 FCFA'
}
