export type RefundStatus = 'en_attente' | 'approuvé' | 'rejeté' | 'remboursé';
export type RefundReason = 'annulation' | 'problème_trajet' | 'double_paiement' | 'surfacturation' | 'autre';
export type RefundMethod = 'MTN Mobile Money' | 'Moov Money' | 'Virement bancaire';

export interface PassengerRefund {
  id: string;
  tripId: string;
  passengerName: string;
  passengerAvatar: string;
  passengerPhone: string;
  driverName: string;
  tripAmount: number;
  refundAmount: number;
  reason: RefundReason;
  reasonDetail?: string;
  requestedAt: string;
  status: RefundStatus;
  processedAt?: string;
  method?: RefundMethod;
  reference?: string;
}

export interface RefundSummary {
  totalPending: number;
  pendingAmount: number;
  totalRefunded: number;
  refundedAmount: number;
}
