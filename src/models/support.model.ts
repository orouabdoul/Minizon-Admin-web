export type TicketPriority = 'Haute' | 'Moyenne' | 'Basse';
export type TicketStatus   = 'Nouveau' | 'En cours' | 'Résolu' | 'Clôturé';
export type TicketChannel  = 'App Mobile' | 'Téléphone' | 'Email' | 'Chat' | 'Autre';

export interface SupportTicket {
  id:          string;
  ticketId:    string;
  userName:    string;
  userEmail:   string;
  userAvatar:  string;
  subject:     string;
  description: string;
  priority:    TicketPriority;
  channel:     TicketChannel;
  date:        string;
  time:        string;
  createdAgo:  string;
  status:      TicketStatus;
  agentName:   string | null;
  agentAvatar: string | null;
  timeElapsed: string;
}
