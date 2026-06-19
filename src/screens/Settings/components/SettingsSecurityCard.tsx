import { Eye } from 'lucide-react';
import { AppIcon }  from '../../../components/Common/AppIcon';
import { Badge }    from '../../../components/DataDisplay/Badge/Badge';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../../../components/DataDisplay/Table/Table';
import { SETTINGS_SECURITY_LOGS } from '../../../config/constants';

const RISK_VARIANT: Record<string, 'emerald' | 'amber' | 'error'> = {
  Faible: 'emerald',
  Moyen:  'amber',
  Élevé:  'error',
};

export function SettingsSecurityCard() {
  return (
    <div className="settings-card">
      <p className="settings-card__title">Paramètres Sécurité</p>
      <Table>
        <TableHead>
          <TableRow>
            <Th width="80px">Heure</Th>
            <Th>Utilisateur</Th>
            <Th width="140px">Adresse IP</Th>
            <Th width="130px">Action</Th>
            <Th width="130px">Niveau Risque</Th>
            <Th width="80px">Actions</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {SETTINGS_SECURITY_LOGS.map((log) => (
            <TableRow key={log.id}>
              <Td><span className="settings-table-text settings-table-text--bold">{log.time}</span></Td>
              <Td><span className="settings-table-text">{log.user}</span></Td>
              <Td><span className="settings-table-text settings-table-text--mono">{log.ip}</span></Td>
              <Td><span className="settings-table-text">{log.action}</span></Td>
              <Td><Badge label={log.riskLevel} variant={RISK_VARIANT[log.riskLevel] ?? 'neutral'} /></Td>
              <Td>
                <button type="button" className="trip-action-btn" title="Voir">
                  <AppIcon icon={Eye} size={14} color="#2563EB" />
                </button>
              </Td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
