import { env } from '../config/env';

export type PassengerStatus  = 'Actif' | 'Inactif' | 'Suspendu';
export type RiskLevel        = 'Faible' | 'Moyen' | 'Élevé';
export type ActivityStatus   = 'En ligne' | 'Hors ligne';

export interface Passenger {
  id:             string;
  passengerId:    string;
  name:           string;
  phone:          string;
  email:          string | null;
  city:           string | null;
  reservations:   number;
  spending:       string;
  rating:         number | null;
  trustScore:     number;
  createdAt:      string;
  createdAgo:     string;
  lastActivity:   string;
  activityStatus: ActivityStatus;
  status:         PassengerStatus;
  riskLevel:      RiskLevel;
  // KYC — populated from list or detail fetch
  avatar?:        string;
  verification?:  string;
  selfies?:       { front?: string; left?: string; right?: string };
  idCard?:        { front?: string; back?: string };
}

export interface PassengerMetrics {
  total:             number;
  active:            number;
  new_this_month:    number;
  bookings_month:    number;
  cancellation_rate: number;
  incidents:         number;
  avg_rating:        number | null;
  suspended:         number;
}

// ── API shape (raw backend response) ──────────────────────────────────────────
// Backend may return KYC in 3 shapes — same pattern as ApiDriver / ApiPlatformUser
export interface ApiPassenger {
  id:              string;
  passenger_id?:   string;
  passengerId?:    string;
  name:            string;
  phone:           string;
  email?:          string | null;
  city?:           string | null;
  avatar?:         string | null;
  reservations?:   number;
  spending?:       string;
  rating?:         number | null;
  trust_score?:    number;
  trustScore?:     number;
  created_at?:     string;
  createdAt?:      string;
  created_ago?:    string;
  createdAgo?:     string;
  last_activity?:  string;
  lastActivity?:   string;
  activity_status?: string;
  activityStatus?:  string;
  status?:         string;
  risk_level?:     string;
  riskLevel?:      string;
  verification?:   string;
  // Shape 1 — nested profile
  profile?: {
    selfie_front?:  string | null;
    selfie_left?:   string | null;
    selfie_right?:  string | null;
    id_card_front?: string | null;
    id_card_back?:  string | null;
  };
  // Shape 2 — flat top-level
  selfie_front?:  string | null;
  selfie_left?:   string | null;
  selfie_right?:  string | null;
  id_card_front?: string | null;
  id_card_back?:  string | null;
  // Shape 3 — nested objects
  selfies?: { front?: string | null; left?: string | null; right?: string | null };
  idCard?:  { front?: string | null; back?: string | null };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith('/'))        return `${env.baseUrl}${path}`;
  if (path.startsWith('storage/')) return `${env.baseUrl}/${path}`;
  return `${env.storageUrl}/${path}`;
}

function statusMap(s?: string): PassengerStatus {
  if (s === 'Suspendu' || s === 'suspended') return 'Suspendu';
  if (s === 'Inactif'  || s === 'inactive')  return 'Inactif';
  return 'Actif';
}
function riskMap(r?: string): RiskLevel {
  if (r === 'Élevé'  || r === 'high')   return 'Élevé';
  if (r === 'Moyen'  || r === 'medium') return 'Moyen';
  return 'Faible';
}
function activityMap(a?: string): ActivityStatus {
  if (a === 'En ligne' || a === 'online') return 'En ligne';
  return 'Hors ligne';
}

// ── Mapper ────────────────────────────────────────────────────────────────────

export function mapApiPassenger(a: ApiPassenger): Passenger {
  const p = a.profile;
  // Resolve KYC: nested objects > flat top-level > nested profile
  const sf  = a.selfies?.front ?? a.selfie_front  ?? p?.selfie_front;
  const sl  = a.selfies?.left  ?? a.selfie_left   ?? p?.selfie_left;
  const sr  = a.selfies?.right ?? a.selfie_right  ?? p?.selfie_right;
  const icf = a.idCard?.front  ?? a.id_card_front ?? p?.id_card_front;
  const icb = a.idCard?.back   ?? a.id_card_back  ?? p?.id_card_back;

  const hasSelfies = !!(sf || sl || sr);
  const hasIdCard  = !!(icf || icb);

  return {
    id:             a.id,
    passengerId:    a.passenger_id ?? a.passengerId ?? `#PAX-${a.id.slice(-6).toUpperCase()}`,
    name:           a.name,
    phone:          a.phone,
    email:          a.email ?? null,
    city:           a.city ?? null,
    avatar:         toUrl(a.avatar) ?? toUrl(sf),
    reservations:   a.reservations ?? 0,
    spending:       a.spending ?? '0 FCFA',
    rating:         a.rating ?? null,
    trustScore:     a.trust_score ?? a.trustScore ?? 0,
    createdAt:      a.created_at ?? a.createdAt ?? '',
    createdAgo:     a.created_ago ?? a.createdAgo ?? '',
    lastActivity:   a.last_activity ?? a.lastActivity ?? '—',
    activityStatus: activityMap(a.activity_status ?? a.activityStatus),
    status:         statusMap(a.status),
    riskLevel:      riskMap(a.risk_level ?? a.riskLevel),
    verification:   a.verification,
    selfies: hasSelfies ? {
      front: toUrl(sf),
      left:  toUrl(sl),
      right: toUrl(sr),
    } : undefined,
    idCard: hasIdCard ? {
      front: toUrl(icf),
      back:  toUrl(icb),
    } : undefined,
  };
}
