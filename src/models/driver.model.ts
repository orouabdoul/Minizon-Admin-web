import { env } from '../config/env';

export type DriverStatus   = 'En attente' | 'Vérifié' | 'Rejeté' | 'Suspendu';
export type DocumentStatus = 'ok' | 'pending' | 'rejected';

export interface DriverDocuments {
  permis:         DocumentStatus;
  carteGrise:     DocumentStatus;
  assurance:      DocumentStatus;
  permisUrl?:     string;   // full URL — may be image (jpg/png) or pdf
  carteGriseUrl?: string;
  assuranceUrl?:  string;
}

export interface Driver {
  id:        string;
  name:      string;
  driverId:  string;
  phone:     string;
  email:     string;
  vehicle:   string;
  plate:     string;
  avatar:    string;          // full URL to front selfie
  selfies?: {
    front?: string;           // full URL
    left?:  string;
    right?: string;
  };
  idCard?: {
    front?: string;           // full URL
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

// ── API shape (GET /admin/drivers and GET /admin/drivers/{id}) ─────────────

// A document field can be:
//   • old shape:  "ok"                         (DocumentStatus string)
//   • new shape:  { status: "ok", url: "/storage/..." }
type ApiDocumentField = DocumentStatus | { status: DocumentStatus; url?: string | null };

export interface ApiDriver {
  id:       string;
  name:     string;
  avatar:   string;        // "/storage/kyc/selfies/xxx.jpg" — starts with "/"
  driverId: string;
  phone:    string;
  email:    string;
  vehicle:  string;
  plate:    string;
  selfies?: { front?: string; left?: string; right?: string };
  idCard?:  { front?: string; back?:  string };
  documents: {
    permis:     ApiDocumentField;
    carteGrise: ApiDocumentField;
    assurance:  ApiDocumentField;
  };
  score:  number;
  status: DriverStatus;
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Convert a /storage/... relative path to a full URL */
function toUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  return `${env.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
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

// ── Mapper ─────────────────────────────────────────────────────────────────

export function mapApiDriverToDriver(d: ApiDriver): Driver {
  return {
    id:       d.id,
    name:     d.name,
    driverId: d.driverId ?? `#DR-${d.id?.slice(-6).toUpperCase()}`,
    phone:    d.phone,
    email:    d.email,
    vehicle:  d.vehicle ?? '',
    plate:    d.plate   ?? '',
    avatar:   d.avatar
      ? `${env.baseUrl}${d.avatar.startsWith('/') ? d.avatar : `/${d.avatar}`}`
      : 'https://placehold.co/40x40',
    selfies: d.selfies ? {
      front: toUrl(d.selfies.front),
      left:  toUrl(d.selfies.left),
      right: toUrl(d.selfies.right),
    } : undefined,
    idCard: d.idCard ? {
      front: toUrl(d.idCard.front),
      back:  toUrl(d.idCard.back),
    } : undefined,
    documents: {
      permis:         docStatus(d.documents?.permis),
      carteGrise:     docStatus(d.documents?.carteGrise),
      assurance:      docStatus(d.documents?.assurance),
      permisUrl:      docUrl(d.documents?.permis),
      carteGriseUrl:  docUrl(d.documents?.carteGrise),
      assuranceUrl:   docUrl(d.documents?.assurance),
    },
    score:  d.score  ?? 0,
    status: d.status ?? 'En attente',
  };
}
