import { env } from '../config/env';

/**
 * Normalise any path/URL the backend might return into a full absolute URL.
 * After the backend fix (Storage::disk('public')->url()), values may be:
 *   • Full URL   "https://minizon-api.onrender.com/storage/kyc/..."  → pass through
 *   • Abs path   "/storage/kyc/selfies/xxx.jpg"                       → prepend baseUrl
 *   • Rel path   "kyc/selfies/xxx.jpg"                                → prepend storageUrl
 */
function toUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith('/'))      return `${env.baseUrl}${path}`;
  return `${env.storageUrl}/${path}`;
}

// ── Métriques ─────────────────────────────────────────────────────────────────
export interface UserMetrics {
  total_users:          number;
  total_trips:          number;
  verification_rate:    number;
  blocked_or_rejected:  number;
}

// ── Admin users (back-office accounts) ────────────────────────────────────────
export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

// ── Platform users (conducteurs & passagers) ──────────────────────────────────
export type PlatformUserType         = 'Conducteur' | 'Passager';
export type PlatformUserStatus       = 'Actif' | 'Inactif' | 'Suspendu';
export type PlatformUserVerification = 'Vérifié' | 'En attente' | 'Rejeté';

export interface PlatformUser {
  id:           string;
  name:         string;
  phone:        string;
  avatar:       string;
  type:         PlatformUserType;
  status:       PlatformUserStatus;
  verification: PlatformUserVerification;
  lastActivity: string;
  // KYC photos — populated from detail fetch
  selfies?: { front?: string; left?: string; right?: string };
  idCard?:  { front?: string; back?: string };
}

// ── API platform user (admin endpoints) ───────────────────────────────────────
// The backend may return KYC fields in different shapes depending on the endpoint:
//   1. Nested under "profile": { profile: { selfie_front, id_card_front, ... } }
//   2. Flat top-level:         { selfie_front, id_card_front, ... }
//   3. Nested "selfies" object: { selfies: { front, left, right }, idCard: { front, back } }
export interface ApiPlatformUser {
  id:           string;
  name:         string;
  phone:        string;
  avatar:       string | null;
  type:         PlatformUserType;
  status:       PlatformUserStatus;
  verification: PlatformUserVerification;
  lastActivity: string;
  // Shape 1 — nested profile object (matches auth/register response structure)
  profile?: {
    selfie_front?:  string | null;
    selfie_left?:   string | null;
    selfie_right?:  string | null;
    id_card_front?: string | null;
    id_card_back?:  string | null;
    driving_license_photo?: string | null;
    email?: string | null;
    city?:  string | null;
  };
  // Shape 2 — flat top-level fields
  selfie_front?:  string | null;
  selfie_left?:   string | null;
  selfie_right?:  string | null;
  id_card_front?: string | null;
  id_card_back?:  string | null;
  // Shape 3 — nested objects (backend transforms)
  selfies?: { front?: string | null; left?: string | null; right?: string | null };
  idCard?:  { front?: string | null; back?: string | null };
}

export function mapApiPlatformUser(u: ApiPlatformUser): PlatformUser {
  // Resolve KYC fields: nested profile > flat top-level > nested objects
  const p = u.profile;
  const sf = u.selfies?.front ?? u.selfie_front ?? p?.selfie_front;
  const sl = u.selfies?.left  ?? u.selfie_left  ?? p?.selfie_left;
  const sr = u.selfies?.right ?? u.selfie_right ?? p?.selfie_right;
  const icf = u.idCard?.front ?? u.id_card_front ?? p?.id_card_front;
  const icb = u.idCard?.back  ?? u.id_card_back  ?? p?.id_card_back;

  const hasSelfies = !!(sf || sl || sr);
  const hasIdCard  = !!(icf || icb);

  return {
    id:           u.id,
    name:         u.name,
    phone:        u.phone,
    avatar:       toUrl(u.avatar) ?? toUrl(sf) ?? 'https://placehold.co/40x40',
    type:         u.type,
    status:       u.status,
    verification: u.verification,
    lastActivity: u.lastActivity,

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

// ── Legacy raw API user (profile response) ────────────────────────────────────
export interface ApiUserProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  city: string;
  neighborhood: string;
  address_details: string | null;
  selfie_front: string | null;
  selfie_left:  string | null;
  selfie_right: string | null;
  id_card_front: string | null;
  id_card_back:  string | null;
  kyc_status: 'pending' | 'approved' | 'rejected';
  kyc_matching_score: number | null;
  approved_at: string | null;
  driving_license_number: string | null;
  driving_license_photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiUser {
  id: number;
  uuid: string;
  phone: string;
  is_verified: boolean;
  is_blocked: boolean;
  penalty_points: number;
  role: 'admin' | 'driver' | 'passenger';
  profile: ApiUserProfile | null;
  vehicle: unknown | null;
}

export const ROLE_IDS = {
  admin:     1,
  passenger: 2,
  driver:    3,
} as const;

export function mapApiUserToPlatformUser(u: ApiUser): PlatformUser {
  const profile = u.profile;
  const name = profile
    ? `${profile.first_name} ${profile.last_name}`
    : `Utilisateur #${u.id}`;

  const verification: PlatformUserVerification =
    !profile                             ? 'En attente' :
    profile.kyc_status === 'approved'    ? 'Vérifié'    :
    profile.kyc_status === 'rejected'    ? 'Rejeté'     : 'En attente';

  return {
    id:           String(u.id),
    name,
    phone:        u.phone,
    avatar:       toUrl(profile?.selfie_front) ?? 'https://placehold.co/40x40',
    type:         u.role === 'driver' ? 'Conducteur' : 'Passager',
    status:       u.is_blocked ? 'Suspendu' : 'Actif',
    verification,
    lastActivity: '—',
    selfies: profile ? {
      front: toUrl(profile.selfie_front),
      left:  toUrl(profile.selfie_left),
      right: toUrl(profile.selfie_right),
    } : undefined,
    idCard: profile ? {
      front: toUrl(profile.id_card_front),
      back:  toUrl(profile.id_card_back),
    } : undefined,
  };
}
