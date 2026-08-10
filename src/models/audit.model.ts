export type AuditActionType =
  | 'connexion' | 'deconnexion' | 'suspension' | 'reactivation'
  | 'remboursement' | 'modif_parametre' | 'creation_admin'
  | 'resolution_litige' | 'approbation_conducteur' | 'rejet_conducteur'
  | 'suppression' | 'export_donnees';

export type AuditSeverity = 'info' | 'avertissement' | 'critique';

export interface AuditLog {
  id:           number | string;
  timestamp:    string;
  adminId?:     string;
  adminName:    string;
  adminAvatar:  string;
  actionType:   AuditActionType;
  description:  string;
  targetName?:  string;
  ipAddress:    string;
  severity:     AuditSeverity;
}

export interface AuditStats {
  today_count:    number;
  critique_count: number;
  total:          number;
}

export interface AuditAdminItem {
  id:     string;
  name:   string;
  avatar: string;
}

export interface AuditFilters {
  actionType: AuditActionType | 'all';
  severity:   AuditSeverity  | 'all';
  adminId:    string;
  search:     string;
  date_from:  string;
  date_to:    string;
}
