import { useState }  from 'react';
import { Eye, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { AppIcon }   from '../../../components/Common/AppIcon';
import { Badge }     from '../../../components/DataDisplay/Badge/Badge';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../../../components/DataDisplay/Table/Table';
import type { SecurityLog } from '../../../models/settings.model';

interface Props {
  logs:    SecurityLog[];
  loading: boolean;
}

const RISK_VARIANT: Record<string, 'emerald' | 'amber' | 'error'> = {
  Faible: 'emerald',
  Moyen:  'amber',
  Élevé:  'error',
};

const ACTION_LABELS: Record<string, string> = {
  'tariff.update':        'Tarif modifié',
  'tariff.toggle':        'Tarif activé/désactivé',
  'tariff.create':        'Tarif créé',
  'tariff.delete':        'Tarif supprimé',
  'promo.create':         'Promo créée',
  'promo.update':         'Promo modifiée',
  'promo.delete':         'Promo supprimée',
  'promo.toggle':         'Promo activée/désactivée',
  'review.status':        'Évaluation modifiée',
  'commission.update':    'Commission modifiée',
  'commission.toggle':    'Commission activée/désactivée',
  'payment.release':      'Paiement libéré',
  'payment.refund':       'Remboursement émis',
  'user.suspend':         'Utilisateur suspendu',
  'user.unsuspend':       'Utilisateur réactivé',
  'driver.approve':       'Conducteur approuvé',
  'driver.reject':        'Conducteur rejeté',
  'admin.login':          'Connexion admin',
  'admin.logout':         'Déconnexion admin',
  'settings.update':      'Paramètres modifiés',
};

function formatAction(action: string): string {
  return ACTION_LABELS[action] ?? action;
}

export function SettingsSecurityCard({ logs, loading }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="settings-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AppIcon icon={Shield} size={16} color="#CA8A04" />
          </div>
          <div>
            <p className="settings-card__title" style={{ margin: 0 }}>Journal d'Audit Sécurité</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>
              {loading ? 'Chargement…' : `${logs.length} événement${logs.length !== 1 ? 's' : ''} enregistré${logs.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 8, border: '1px solid #E5E7EB',
            background: open ? '#F9FAFB' : 'white', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, color: '#374151',
          }}
        >
          <AppIcon icon={open ? ChevronUp : ChevronDown} size={15} color="#6B7280" />
          {open ? 'Masquer' : 'Afficher le journal'}
        </button>
      </div>

      {open && (
        <div style={{ marginTop: 16 }}>
          <Table>
            <TableHead>
              <TableRow>
                <Th width="80px">Heure</Th>
                <Th>Utilisateur</Th>
                <Th width="140px">Adresse IP</Th>
                <Th width="160px">Action</Th>
                <Th width="130px">Niveau Risque</Th>
                <Th width="80px">Détails</Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <Td><span className="settings-table-text" style={{ color: '#9CA3AF' }}>Chargement…</span></Td>
                  <Td /><Td /><Td /><Td /><Td />
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <Td><span className="settings-table-text" style={{ color: '#9CA3AF' }}>Aucun événement de sécurité</span></Td>
                  <Td /><Td /><Td /><Td /><Td />
                </TableRow>
              ) : logs.map((log) => (
                <TableRow key={log.id}>
                  <Td><span className="settings-table-text settings-table-text--bold">{log.time}</span></Td>
                  <Td><span className="settings-table-text">{log.user}</span></Td>
                  <Td><span className="settings-table-text settings-table-text--mono">{log.ip}</span></Td>
                  <Td><span className="settings-table-text" title={log.action}>{formatAction(log.action)}</span></Td>
                  <Td><Badge label={log.riskLevel} variant={RISK_VARIANT[log.riskLevel] ?? 'neutral'} /></Td>
                  <Td>
                    <button type="button" className="trip-action-btn" title="Voir">
                      <AppIcon icon={Eye} size={14} color="#1A5FB4" />
                    </button>
                  </Td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
