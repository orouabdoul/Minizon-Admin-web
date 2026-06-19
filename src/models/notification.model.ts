export type NotifType      = 'system' | 'user' | 'payment' | 'dispute' | 'driver';
export type NotifPriority  = 'Urgente' | 'Haute' | 'Normale' | 'Basse';
export type NotifStatus    = 'Non lue' | 'Lue' | 'Traitée';
export type NotifTab       = 'all' | 'unread' | 'urgent' | 'system';
export type NotifDateGroup = "Aujourd'hui" | 'Hier' | 'Cette semaine';

export interface Notification {
  id:          string;
  notifId:     string;
  type:        NotifType;
  priority:    NotifPriority;
  status:      NotifStatus;
  title:       string;
  description: string;
  date:        string;
  time:        string;
  createdAgo:  string;
  dateGroup:   NotifDateGroup;
  userName?:   string;
  userAvatar?: string;
  refEntity?:  string;
  refLabel?:   string;
}
