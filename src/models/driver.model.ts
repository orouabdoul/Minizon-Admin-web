import { env } from '../config/env';

export type DriverStatus   = 'En attente' | 'Vérifié' | 'Rejeté' | 'Suspendu';
export type DocumentStatus = 'ok' | 'pending' | 'rejected';

export interface DriverDocuments {
  permis:              DocumentStatus;
  carteGrise:          DocumentStatus;
  assurance:           DocumentStatus;
  tvmDoc:              DocumentStatus;
  technicalControl:    DocumentStatus;
  permisUrl?:          string;
  carteGriseUrl?:      string;
  assuranceUrl?:       string;
  tvmDocUrl?:          string;
  technicalControlUrl?: string;
}

export interface Driver {
  id:        string;
  name:      string;
  driverId:  string;
  phone:     string;
  email:     string;
  vehicle:   string;
  plate:     string;
  avatar:    string;
  selfies?: {
    front?: string;
    left?:  string;
    right?: string;
  };
  idCard?: {
    front?: string;
    back?:  string;
  };
  documents: DriverDocuments;
  score:     number;
  status:    DriverStatus;
}

export interface DriverMetrics {
  total:              number;
  pending:            number;
  verified:           number;
  suspended_rejected: number;
  validation_rate:    number;
}

// ── API shape ──────────────────────────────────────────────────────────────────
// Backend may return documents as:
//   • old flat string: "ok"
//   • new object:      { status: "ok", url: "https://..." | "/storage/..." | "kyc/..." }
type ApiDocumentField = DocumentStatus | { status: DocumentStatus; url?: string | null };

export interface ApiDriver {
  id:       string;
  name:     string;
  avatar:   string | null;
  driverId: string;
  phone:    string;
  email:    string;
  vehicle:  string;
  plate:    string;
  // Shape 1 — nested profile (matches auth/register response)
  profile?: {
    selfie_front?:  string | null;
    selfie_left?:   string | null;
    selfie_right?:  string | null;
    id_card_front?: string | null;
    id_card_back?:  string | null;
    driving_license_photo?: string | null;
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
  documents: {
    permis:               ApiDocumentField;
    carteGrise:           ApiDocumentField;
    assurance:            ApiDocumentField;
    tvm_doc?:             ApiDocumentField;
    technical_control_doc?: ApiDocumentField;
  };
  score:  number;
  status: DriverStatus;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Normalise any path/URL the backend might return into a full absolute URL.
 *
 * After the backend fix (Storage::disk('public')->url()), values may be:
 *   • Full URL   "https://minizon-api.onrender.com/storage/kyc/..."  → pass through
 *   • Abs path   "/storage/kyc/selfies/xxx.jpg"                       → prepend baseUrl
 *   • Rel path   "kyc/selfies/xxx.jpg"                                → prepend storageUrl
 */
function toUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith('/'))        return `${env.baseUrl}${path}`;
  if (path.startsWith('storage/')) return `${env.baseUrl}/${path}`;
  return `${env.storageUrl}/${path}`;
}

function docStatus(field: ApiDocumentField | undefined): DocumentStatus {
  if (!field) return 'pending';
  if (typeof field === 'string') return field;
  return field.status ?? 'pending';
}

function docUrl(field: ApiDocumentField | undefined): string | undefined {
  if (!field || typeof field === 'string') return undefined;
  return toUrl(field.url);
}

// ── Mapper ─────────────────────────────────────────────────────────────────────

export function mapApiDriverToDriver(d: ApiDriver): Driver {
  // Resolve KYC fields: nested objects > flat top-level > nested profile
  const p = d.profile;
  const sf = d.selfies?.front ?? d.selfie_front ?? p?.selfie_front;
  const sl = d.selfies?.left  ?? d.selfie_left  ?? p?.selfie_left;
  const sr = d.selfies?.right ?? d.selfie_right ?? p?.selfie_right;
  const icf = d.idCard?.front ?? d.id_card_front ?? p?.id_card_front;
  const icb = d.idCard?.back  ?? d.id_card_back  ?? p?.id_card_back;

  const hasSelfies = !!(sf || sl || sr);
  const hasIdCard  = !!(icf || icb);

  return {
    id:       d.id,
    name:     d.name,
    driverId: d.driverId ?? `#DR-${d.id?.slice(-6).toUpperCase()}`,
    phone:    d.phone,
    email:    d.email,
    vehicle:  d.vehicle ?? '',
    plate:    d.plate   ?? '',
    avatar:   toUrl(d.avatar) ?? toUrl(sf) ?? 'https://placehold.co/40x40',

    selfies: hasSelfies ? {
      front: toUrl(sf),
      left:  toUrl(sl),
      right: toUrl(sr),
    } : undefined,

    idCard: hasIdCard ? {
      front: toUrl(icf),
      back:  toUrl(icb),
    } : undefined,

    documents: {
      permis:              docStatus(d.documents?.permis),
      carteGrise:          docStatus(d.documents?.carteGrise),
      assurance:           docStatus(d.documents?.assurance),
      tvmDoc:              docStatus(d.documents?.tvm_doc),
      technicalControl:    docStatus(d.documents?.technical_control_doc),
      permisUrl:           docUrl(d.documents?.permis),
      carteGriseUrl:       docUrl(d.documents?.carteGrise),
      assuranceUrl:        docUrl(d.documents?.assurance),
      tvmDocUrl:           docUrl(d.documents?.tvm_doc),
      technicalControlUrl: docUrl(d.documents?.technical_control_doc),
    },

    score:  d.score  ?? 0,
    status: d.status ?? 'En attente',
  };
}
