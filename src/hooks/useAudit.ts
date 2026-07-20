import { useState, useEffect, useMemo } from 'react';
import type { AuditLog, AuditActionType, AuditSeverity } from '../models/audit.model';
import { auditService } from '../services/audit_service';

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_LOGS: AuditLog[] = [
  { id: 'a1',  timestamp: '2026-07-01T15:28:00', adminId: '1', adminName: 'John Doe',   adminAvatar: 'https://placehold.co/32x32', actionType: 'suspension',            description: 'Suspension du conducteur Jean-Baptiste Hounkpè — 3 signalements comportement',           targetName: 'Jean-Baptiste Hounkpè', ipAddress: '192.168.1.45', severity: 'critique'      },
  { id: 'a2',  timestamp: '2026-07-01T14:52:00', adminId: '2', adminName: 'Sarah Klein', adminAvatar: 'https://placehold.co/32x32', actionType: 'remboursement',         description: 'Remboursement 32 500 FCFA — réservation RES-2024-002 annulation conducteur',            targetName: 'Pierre Moreau',         ipAddress: '10.0.0.12',    severity: 'avertissement' },
  { id: 'a3',  timestamp: '2026-07-01T13:30:00', adminId: '1', adminName: 'John Doe',   adminAvatar: 'https://placehold.co/32x32', actionType: 'resolution_litige',     description: 'Résolution litige LIT-001 — remboursement partiel 50 % accordé',                       targetName: 'LIT-001',               ipAddress: '192.168.1.45', severity: 'info'          },
  { id: 'a4',  timestamp: '2026-07-01T12:15:00', adminId: '2', adminName: 'Sarah Klein', adminAvatar: 'https://placehold.co/32x32', actionType: 'approbation_conducteur',description: 'Approbation conducteur Adjoa Koffi — documents permis, carte grise et assurance vérifiés', targetName: 'Adjoa Koffi',           ipAddress: '10.0.0.12',    severity: 'info'          },
  { id: 'a5',  timestamp: '2026-07-01T11:00:00', adminId: '1', adminName: 'John Doe',   adminAvatar: 'https://placehold.co/32x32', actionType: 'modif_parametre',       description: 'Modification taux de commission standard : 15 % → 18 %',                                targetName: 'Commission standard',   ipAddress: '192.168.1.45', severity: 'critique'      },
  { id: 'a6',  timestamp: '2026-07-01T09:45:00', adminId: '1', adminName: 'John Doe',   adminAvatar: 'https://placehold.co/32x32', actionType: 'connexion',             description: 'Connexion administrateur réussie — Paris, France',                                       targetName: undefined,               ipAddress: '192.168.1.45', severity: 'info'          },
  { id: 'a7',  timestamp: '2026-07-01T09:00:00', adminId: '2', adminName: 'Sarah Klein', adminAvatar: 'https://placehold.co/32x32', actionType: 'connexion',             description: 'Connexion administrateur réussie — Cotonou, Bénin',                                     targetName: undefined,               ipAddress: '10.0.0.12',    severity: 'info'          },
  { id: 'a8',  timestamp: '2026-06-30T18:30:00', adminId: '1', adminName: 'John Doe',   adminAvatar: 'https://placehold.co/32x32', actionType: 'creation_admin',        description: 'Création compte administrateur Marc Dupuis — rôle Modérateur',                          targetName: 'Marc Dupuis',           ipAddress: '192.168.1.45', severity: 'critique'      },
  { id: 'a9',  timestamp: '2026-06-30T16:00:00', adminId: '2', adminName: 'Sarah Klein', adminAvatar: 'https://placehold.co/32x32', actionType: 'rejet_conducteur',      description: 'Rejet conducteur Moussa Kane — documents non conformes (assurance expirée)',              targetName: 'Moussa Kane',           ipAddress: '10.0.0.12',    severity: 'avertissement' },
  { id: 'a10', timestamp: '2026-06-30T14:20:00', adminId: '2', adminName: 'Sarah Klein', adminAvatar: 'https://placehold.co/32x32', actionType: 'remboursement',         description: 'Remboursement 18 500 FCFA — TXN-2024-0042 double débit détecté',                        targetName: 'Aminata Sow',           ipAddress: '10.0.0.12',    severity: 'critique'      },
  { id: 'a11', timestamp: '2026-06-30T11:10:00', adminId: '1', adminName: 'John Doe',   adminAvatar: 'https://placehold.co/32x32', actionType: 'suspension',            description: 'Suspension passager Fatou Sow — comportement inapproprié signalé par 2 conducteurs',    targetName: 'Fatou Sow',             ipAddress: '192.168.1.45', severity: 'avertissement' },
  { id: 'a12', timestamp: '2026-06-30T09:15:00', adminId: '1', adminName: 'John Doe',   adminAvatar: 'https://placehold.co/32x32', actionType: 'export_donnees',        description: 'Export rapport mensuel passagers — juin 2026 (format Excel)',                            targetName: 'Rapport passagers',     ipAddress: '192.168.1.45', severity: 'avertissement' },
  { id: 'a13', timestamp: '2026-06-29T17:45:00', adminId: '2', adminName: 'Sarah Klein', adminAvatar: 'https://placehold.co/32x32', actionType: 'resolution_litige',     description: 'Résolution litige LIT-003 — avertissement formel émis, remboursement 50 %',             targetName: 'LIT-003',               ipAddress: '10.0.0.12',    severity: 'info'          },
  { id: 'a14', timestamp: '2026-06-29T15:30:00', adminId: '1', adminName: 'John Doe',   adminAvatar: 'https://placehold.co/32x32', actionType: 'modif_parametre',       description: 'Activation paiement carte bancaire (Stripe) — mise en production',                       targetName: 'Fournisseur paiement',  ipAddress: '192.168.1.45', severity: 'critique'      },
  { id: 'a15', timestamp: '2026-06-29T10:00:00', adminId: '2', adminName: 'Sarah Klein', adminAvatar: 'https://placehold.co/32x32', actionType: 'reactivation',          description: 'Réactivation compte conducteur Kofi Mensah — suspension levée après vérification',      targetName: 'Kofi Mensah',           ipAddress: '10.0.0.12',    severity: 'info'          },
  { id: 'a16', timestamp: '2026-06-29T08:30:00', adminId: '1', adminName: 'John Doe',   adminAvatar: 'https://placehold.co/32x32', actionType: 'connexion',             description: 'Connexion depuis appareil non reconnu — authentification 2FA requise et validée',       targetName: undefined,               ipAddress: '88.123.45.67', severity: 'avertissement' },
  { id: 'a17', timestamp: '2026-06-28T16:00:00', adminId: '2', adminName: 'Sarah Klein', adminAvatar: 'https://placehold.co/32x32', actionType: 'suppression',           description: 'Suppression compte utilisateur test — compte fictif créé lors des tests QA',             targetName: 'User Test #9912',       ipAddress: '10.0.0.12',    severity: 'critique'      },
  { id: 'a18', timestamp: '2026-06-28T11:00:00', adminId: '1', adminName: 'John Doe',   adminAvatar: 'https://placehold.co/32x32', actionType: 'approbation_conducteur',description: 'Approbation conducteur Yao Kobenan — profil vérifié, score initial 80/100',               targetName: 'Yao Kobenan',           ipAddress: '192.168.1.45', severity: 'info'          },
];

export interface AuditFilters {
  actionType: AuditActionType | 'all';
  severity:   AuditSeverity  | 'all';
  adminId:    string          | 'all';
  search:     string;
}

const DEFAULT_FILTERS: AuditFilters = { actionType: 'all', severity: 'all', adminId: 'all', search: '' };

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAudit() {
  const [logs,    setLogs]    = useState<AuditLog[]>(MOCK_LOGS);
  const [filters, setFilters] = useState<AuditFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    auditService.getLogs()
      .then((res) => {
        const data = res.data.body;
        if (Array.isArray(data) && data.length > 0) setLogs(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = useMemo(() => logs.filter((l) => {
    if (filters.actionType !== 'all' && l.actionType !== filters.actionType) return false;
    if (filters.severity   !== 'all' && l.severity   !== filters.severity)   return false;
    if (filters.adminId    !== 'all' && l.adminId    !== filters.adminId)     return false;
    if (filters.search && !l.description.toLowerCase().includes(filters.search.toLowerCase())
      && !(l.targetName ?? '').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }), [logs, filters]);

  const admins = useMemo(() => {
    const seen = new Map<string, string>();
    logs.forEach((l) => seen.set(l.adminId, l.adminName));
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [logs]);

  const exportLogs = (format: 'pdf' | 'excel') => {
    auditService.exportLogs(format).catch(() => {});
    setExportMsg(`Export ${format.toUpperCase()} en cours de préparation…`);
    setTimeout(() => setExportMsg(null), 3000);
  };

  return {
    logs: filteredLogs, loading, filters, admins, exportMsg,
    setFilters: (f: Partial<AuditFilters>) => setFilters((prev) => ({ ...prev, ...f })),
    exportLogs,
  };
}
