export type NotifType      = 'system' | 'user' | 'payment' | 'dispute' | 'driver' | 'critical_review';
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

export interface CriticalReviewData {
  booking_uuid:    string;
  payment_uuid:    string;
  rating:          number;
  comment:         string;
  trip:            string;
  action_required: boolean;
}

export interface ApiNotification {
  id?:          string;
  uuid?:        string;
  notifId?:     string;
  type:         string;
  priority:     string;
  status:       string;
  title:        string;
  description:  string;
  date:         string;
  time?:        string;
  createdAgo:   string;
  dateGroup?:   string;
  userName?:    string;
  userAvatar?:  string;
  refEntity?:   string;
  refLabel?:    string;
  data?:        Record<string, unknown>;
}

export interface Notification {
  id:                  string;
  notifId:             string;
  type:                NotifType;
  priority:            NotifPriority;
  status:              NotifStatus;
  title:               string;
  description:         string;
  date:                string;
  time:                string;
  createdAgo:          string;
  dateGroup:           NotifDateGroup;
  userName?:           string;
  userAvatar?:         string;
  refEntity?:          string;
  refLabel?:           string;
  criticalReviewData?: CriticalReviewData;
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

function mapType(raw: string): NotifType {
  if (raw === 'critical_review_escrow') return 'critical_review';
  const valid: NotifType[] = ['system', 'user', 'payment', 'dispute', 'driver', 'critical_review'];
  return valid.includes(raw as NotifType) ? (raw as NotifType) : 'system';
}

export function mapApiNotification(d: ApiNotification): Notification {
  const id = d.id ?? d.uuid ?? d.notifId ?? '';
  const isCritical = d.type === 'critical_review_escrow' || d.type === 'critical_review';

  return {
    id,
    notifId:     d.notifId ?? id,
    type:        mapType(d.type),
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
    criticalReviewData: (isCritical && d.data) ? {
      booking_uuid:    String(d.data.booking_uuid ?? ''),
      payment_uuid:    String(d.data.payment_uuid ?? ''),
      rating:          Number(d.data.rating ?? 0),
      comment:         String(d.data.comment ?? ''),
      trip:            String(d.data.trip ?? d.data.title ?? ''),
      action_required: Boolean(d.data.action_required ?? true),
    } : undefined,
  };
}
