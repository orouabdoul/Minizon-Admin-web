import { env } from '../config/env';

// ── Métriques ─────────────────────────────────────────────
export interface UserMetrics {
  total_users:          number;
  total_trips:          number;
  verification_rate:    number;
  blocked_or_rejected:  number;
}

// ── Admin users (back-office accounts) ──────────────────
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

// ── Platform users (conducteurs & passagers) ─────────────
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
}

// ── API user (réponse /admin/users) ──────────────────────
export interface ApiPlatformUser {
  id:           string;
  name:         string;
  phone:        string;
  avatar:       string | null;
  type:         PlatformUserType;
  status:       PlatformUserStatus;
  verification: PlatformUserVerification;
  lastActivity: string;
}

export function mapApiPlatformUser(u: ApiPlatformUser): PlatformUser {
  return {
    ...u,
    avatar: u.avatar
      ? `${env.storageUrl}/${u.avatar}`
      : 'https://placehold.co/40x40',
  };
}

// ── Legacy API raw user (réponse /auth/admin/users) ───────
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

// ── Role IDs ─────────────────────────────────────────────
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
    avatar:       'https://placehold.co/40x40',
    type:         u.role === 'driver' ? 'Conducteur' : 'Passager',
    status:       u.is_blocked ? 'Suspendu' : 'Actif',
    verification,
    lastActivity: '—',
  };
}
