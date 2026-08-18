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
  priority?:    string;
  status?:      string;
  title?:       string;
  description?: string;
  date?:        string;
  time?:        string;
  createdAgo?:  string;
  dateGroup?:   string;
  userName?:    string;
  userAvatar?:  string;
  refEntity?:   string;
  refLabel?:    string;
  data?:        Record<string, unknown>;
  // Raw DB notification fields (Laravel format)
  read_at?:     string | null;
  created_at?:  string;
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
  // Routing data
  disputeId?:          string | number;
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
  // Laravel notification class names → type
  if (raw.includes('NewDisputeFiled') || raw.includes('DisputeOpened')) return 'dispute';
  if (raw.includes('KycApproved') || raw.includes('KycRejected') || raw.includes('AccountSuspend') || raw.includes('AccountRestore') || raw.includes('AccountActivat')) return 'user';
  if (raw.includes('Payout') || raw.includes('Virement')) return 'driver';
  if (raw.includes('Promo') || raw.includes('PromoCode')) return 'system';
  const valid: NotifType[] = ['system', 'user', 'payment', 'dispute', 'driver', 'critical_review'];
  return valid.includes(raw as NotifType) ? (raw as NotifType) : 'system';
}

function parseCreatedAt(iso: string): { date: string; time: string; createdAgo: string } {
  try {
    const d    = new Date(iso);
    const date = d.toLocaleDateString('fr-FR');
    const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const mins = Math.floor((Date.now() - d.getTime()) / 60_000);
    let createdAgo = "à l'instant";
    if (mins >= 1)    createdAgo = `il y a ${mins} min`;
    if (mins >= 60)   createdAgo = `il y a ${Math.floor(mins / 60)}h`;
    if (mins >= 1440) createdAgo = `il y a ${Math.floor(mins / 1440)}j`;
    return { date, time, createdAgo };
  } catch {
    return { date: iso, time: '', createdAgo: '' };
  }
}

export function mapApiNotification(d: ApiNotification): Notification {
  const id = d.id ?? d.uuid ?? d.notifId ?? '';
  const isCritical = d.type === 'critical_review_escrow' || d.type === 'critical_review';

  // Detect raw DB format (Laravel notification) vs pre-mapped format
  const isRawDb = d.created_at !== undefined || d.read_at !== undefined;

  // Extract title/description — may be nested in data for DB format
  const title       = d.title ?? String(d.data?.title ?? '');
  const description = d.description ?? String(d.data?.body ?? d.data?.message ?? '');

  // Date / time from ISO created_at or flat fields
  const { date, time, createdAgo } = isRawDb && d.created_at
    ? parseCreatedAt(d.created_at)
    : { date: d.date ?? '', time: d.time ?? '', createdAgo: d.createdAgo ?? '' };

  // Status from read_at or flat status field
  const status: NotifStatus = isRawDb
    ? (d.read_at === null ? 'Non lue' : 'Lue')
    : ((d.status as NotifStatus) ?? 'Non lue');

  // Priority: DB format doesn't have priority, default to Normale
  const priority: NotifPriority = (d.priority as NotifPriority) ?? 'Normale';

  // Extract dispute_id for routing
  const disputeId = d.data?.dispute_id !== undefined
    ? (d.data.dispute_id as string | number)
    : undefined;

  // Internal data type takes precedence over outer type for mapping
  const internalType = d.data?.type as string | undefined;
  const typeToMap = internalType ?? d.type;

  return {
    id,
    notifId:     d.notifId ?? id,
    type:        mapType(typeToMap),
    priority,
    status,
    title,
    description,
    date,
    time,
    createdAgo,
    dateGroup:   (d.dateGroup as NotifDateGroup) ?? computeDateGroup(date),
    userName:    d.userName,
    userAvatar:  d.userAvatar,
    refEntity:   d.refEntity,
    refLabel:    d.refLabel,
    disputeId,
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
