export type DisputeType     = 'Paiement' | 'Annulation' | 'Comportement' | 'Retard' | 'Autre';
export type DisputePriority = 'Critique' | 'Élevée' | 'Moyenne' | 'Faible';
export type DisputeStatus   = 'Ouvert' | 'En cours' | 'Résolu' | 'Clôturé';
export type DisputeTab      = 'all' | 'open' | 'critical';

export interface DisputeMetrics {
  all:           number;
  open:          number;
  critical:      number;
  pending:       number;
  investigating: number;
  resolved:      number;
}

export interface DisputeParty {
  avatar:    string;
  name:      string;
  shortName: string;
  role:      string;
  rating:    number;
  tripCount: number;
}

export interface DisputeInvestigationEvent {
  label:            string;
  time:             string;
  done:             boolean;
  quote?:           string;
  note?:            string;
  hasAttachments?:  boolean;
  attachmentCount?: number;
}

// Raw list item from GET /admin/disputes
export interface ApiDisputeListItem {
  id:            number;
  disputeId:     string;
  createdAt:     string;
  createdAgo:    string;
  type:          string;
  priority:      string;
  status:        string;
  motif:         string;
  reservationId: string;
  trajet:        string;
  amount:        string;
}

// Full detail from GET /admin/disputes/{id}
export interface ApiDisputeDetail extends ApiDisputeListItem {
  conductor:           DisputeParty;
  passenger:           DisputeParty;
  investigationEvents: DisputeInvestigationEvent[];
}

export interface Dispute {
  id:            string;
  disputeId:     string;
  createdAt:     string;
  createdAgo:    string;
  type:          DisputeType;
  priority:      DisputePriority;
  status:        DisputeStatus;
  motif:         string;
  reservationId: string;
  trajet:        string;
  amount:        string;
  // Only present after detail load
  conductor?:            DisputeParty;
  passenger?:            DisputeParty;
  investigationEvents:   DisputeInvestigationEvent[];
}

export function mapApiListItemToDispute(d: ApiDisputeListItem): Dispute {
  return {
    id:            String(d.id),
    disputeId:     d.disputeId,
    createdAt:     d.createdAt,
    createdAgo:    d.createdAgo,
    type:          d.type as DisputeType,
    priority:      d.priority as DisputePriority,
    status:        d.status as DisputeStatus,
    motif:         d.motif,
    reservationId: d.reservationId,
    trajet:        d.trajet,
    amount:        d.amount,
    investigationEvents: [],
  };
}

export function mapApiDetailToDispute(d: ApiDisputeDetail): Dispute {
  return {
    ...mapApiListItemToDispute(d),
    conductor:           d.conductor,
    passenger:           d.passenger,
    investigationEvents: d.investigationEvents ?? [],
  };
}
