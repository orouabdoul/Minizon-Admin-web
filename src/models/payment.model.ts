export type PaymentTxStatus = 'En attente' | 'Sécurisé' | 'Libéré' | 'Échoué' | 'Remboursé';

export interface PaymentMetrics {
  total:      number;
  secured:    number;
  released:   number;
  failed:     number;
  volume:     string;
  commission: string;
}

interface ApiTimelineEvent {
  label:  string;
  time:   string;
  status?: string;
  done?:   boolean;
}

export interface ApiPayment {
  id:                 string;
  paymentId:          string;
  createdAt:          string;
  createdAgo:         string;
  passengerName:      string;
  passengerAvatar?:   string;
  passengerPhone:     string;
  passengerVerified:  boolean;
  driverName:         string;
  driverAvatar?:      string;
  from:               string;
  to:                 string;
  reservationId:      string;
  amount:             string;
  commission:         string;
  netAmount:          string;
  method:             string;
  provider:           string;
  reference:          string;
  providerReference?: string;
  status:             string;
  canRefund:          boolean;
  timelineEvents?:    ApiTimelineEvent[];
}

export interface Payment {
  id:                string;
  paymentId:         string;
  createdAt:         string;
  createdAgo:        string;
  passengerName:     string;
  passengerAvatar:   string;
  passengerPhone:    string;
  passengerVerified: boolean;
  driverName:        string;
  driverAvatar:      string;
  from:              string;
  to:                string;
  reservationId:     string;
  amount:            string;
  commission:        string;
  netAmount:         string;
  method:            string;
  provider:          string;
  reference:         string;
  providerReference: string;
  status:            PaymentTxStatus;
  canRefund:         boolean;
  timelineEvents:    { label: string; time: string; done: boolean }[];
}

const STATUS_MAP: Record<string, PaymentTxStatus> = {
  'En attente': 'En attente',
  'Sécurisé':   'Sécurisé',
  'Libéré':     'Libéré',
  'Échoué':     'Échoué',
  'Remboursé':  'Remboursé',
};

export function mapApiPaymentToPayment(d: ApiPayment): Payment {
  return {
    id:                d.id,
    paymentId:         d.paymentId,
    createdAt:         d.createdAt,
    createdAgo:        d.createdAgo,
    passengerName:     d.passengerName,
    passengerAvatar:   d.passengerAvatar ?? '',
    passengerPhone:    d.passengerPhone,
    passengerVerified: d.passengerVerified,
    driverName:        d.driverName,
    driverAvatar:      d.driverAvatar ?? '',
    from:              d.from,
    to:                d.to,
    reservationId:     d.reservationId,
    amount:            d.amount,
    commission:        d.commission,
    netAmount:         d.netAmount,
    method:            d.method,
    provider:          d.provider,
    reference:         d.reference,
    providerReference: d.providerReference ?? '',
    status:            STATUS_MAP[d.status] ?? 'En attente',
    canRefund:         d.canRefund,
    timelineEvents:    (d.timelineEvents ?? []).map((e) => ({
      label: e.label,
      time:  e.time,
      done:  e.done ?? e.status === 'done',
    })),
  };
}
