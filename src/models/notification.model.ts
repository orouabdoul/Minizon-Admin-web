export type NotifType      = 'system' | 'user' | 'payment' | 'dispute' | 'driver';
export type NotifPriority  = 'Urgente' | 'Haute' | 'Normale' | 'Basse';
export type NotifStatus    = 'Non lue' | 'Lue' | 'Traitée';
export type NotifTab       = 'all' | 'unread' | 'urgent' | 'system';
export type NotifDateGroup = "Aujourd'hui" | 'Hier' | 'Cette semaine';

export interface NotifMetrics {
  all:    number;
  unread: number;
  urgent: number;
  system: number;
}

export interface ApiNotification {
  id:          string;
  notifId?:    string;
  type:        string;
  priority:    string;
  status:      string;
  title:       string;
  description: string;
  date:        string;
  time?:       string;
  createdAgo:  string;
  dateGroup?:  string;
  userName?:   string;
  userAvatar?: string;
  refEntity?:  string;
  refLabel?:   string;
}

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

function computeDateGroup(dateStr: string): NotifDateGroup {
  try {
    const datePart = dateStr.split(' ')[0];
    const parts    = datePart.split('/');
    if (parts.length !== 3) return 'Cette semaine';
    const d       = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    const now     = new Date();
    const today   = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yest    = new Date(today.getTime() - 86_400_000);
    const weekAgo = new Date(today.getTime() - 7 * 86_400_000);
    if (d >= today)   return "Aujourd'hui";
    if (d >= yest)    return 'Hier';
    if (d >= weekAgo) return 'Cette semaine';
    return 'Cette semaine';
  } catch {
    return 'Cette semaine';
  }
}

export function mapApiNotification(d: ApiNotification): Notification {
  return {
    id:          d.id,
    notifId:     d.notifId ?? d.id,
    type:        d.type as NotifType,
    priority:    d.priority as NotifPriority,
    status:      d.status as NotifStatus,
    title:       d.title,
    description: d.description,
    date:        d.date,
    time:        d.time ?? '',
    createdAgo:  d.createdAgo,
    dateGroup:   (d.dateGroup as NotifDateGroup) ?? computeDateGroup(d.date),
    userName:    d.userName,
    userAvatar:  d.userAvatar,
    refEntity:   d.refEntity,
    refLabel:    d.refLabel,
  };
}
