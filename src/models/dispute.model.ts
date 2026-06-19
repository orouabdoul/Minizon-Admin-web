export type DisputeType     = 'Paiement' | 'Annulation' | 'Comportement' | 'Retard' | 'Autre';
export type DisputePriority = 'Critique' | 'Élevée' | 'Moyenne' | 'Faible';
export type DisputeStatus   = 'Ouvert' | 'En cours' | 'Résolu' | 'Clôturé';
export type DisputeTab      = 'all' | 'open' | 'critical';

export interface DisputeParty {
  name:      string;
  shortName: string;
  avatar:    string;
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

export interface Dispute {
  id:              string;
  disputeId:       string;
  reservationId:   string;
  passengerName:   string;
  passengerAvatar: string;
  driverName:      string;
  driverAvatar:    string;
  type:            DisputeType;
  motif:           string;
  description:     string;
  trajet:          string;
  amount:          string;
  date:            string;
  createdAgo:      string;
  priority:        DisputePriority;
  status:          DisputeStatus;
  conductor:       DisputeParty;
  passenger:       DisputeParty;
  investigationEvents: DisputeInvestigationEvent[];
}
