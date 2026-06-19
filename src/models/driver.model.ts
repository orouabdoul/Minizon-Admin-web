export type DriverStatus   = 'En attente' | 'Vérifié' | 'Rejeté' | 'Suspendu';
export type DocumentStatus = 'ok' | 'pending' | 'rejected';

export interface DriverDocuments {
  permis:     DocumentStatus;
  carteGrise: DocumentStatus;
  assurance:  DocumentStatus;
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

export interface ApiDriver {
  uuid:       string;
  name:       string;
  phone:      string;
  email:      string;
  vehicle:    string;
  plate:      string;
  avatar?:    string;
  kyc_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  score:      number;
  documents:  {
    permis:     DocumentStatus;
    carteGrise: DocumentStatus;
    assurance:  DocumentStatus;
  };
}

const KYC_TO_STATUS: Record<ApiDriver['kyc_status'], DriverStatus> = {
  pending:   'En attente',
  approved:  'Vérifié',
  rejected:  'Rejeté',
  suspended: 'Suspendu',
};

export function mapApiDriverToDriver(d: ApiDriver): Driver {
  return {
    id:        d.uuid,
    name:      d.name,
    driverId:  `#DR-${d.uuid.slice(-6).toUpperCase()}`,
    phone:     d.phone,
    email:     d.email,
    vehicle:   d.vehicle   ?? '',
    plate:     d.plate     ?? '',
    avatar:    d.avatar    ?? 'https://placehold.co/40x40',
    documents: {
      permis:     d.documents?.permis     ?? 'pending',
      carteGrise: d.documents?.carteGrise ?? 'pending',
      assurance:  d.documents?.assurance  ?? 'pending',
    },
    score:  d.score  ?? 0,
    status: KYC_TO_STATUS[d.kyc_status] ?? 'En attente',
  };
}
