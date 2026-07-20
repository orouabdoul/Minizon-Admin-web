export type AuditActionType =
  | 'connexion' | 'deconnexion' | 'suspension' | 'reactivation'
  | 'remboursement' | 'modif_parametre' | 'creation_admin'
  | 'resolution_litige' | 'approbation_conducteur' | 'rejet_conducteur'
  | 'suppression' | 'export_donnees';

export type AuditSeverity = 'info' | 'avertissement' | 'critique';

export interface AuditLog {
  id:          string;
  timestamp:   string;
  adminId:     string;
  adminName:   string;
  adminAvatar: string;
  actionType:  AuditActionType;
  description: string;
  targetName?: string;
  ipAddress:   string;
  severity:    AuditSeverity;
}
