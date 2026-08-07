import { useState }   from 'react';
import { Pencil }     from 'lucide-react';
import { AppIcon }    from '../../../components/Common/AppIcon';
import { Badge }      from '../../../components/DataDisplay/Badge/Badge';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../../../components/DataDisplay/Table/Table';
import { DetailModal, DetailSection } from '../../../components/Overlay/DetailModal/DetailModal';
import type { Commission } from '../../../models/settings.model';

const TYPE_LABELS: Record<string, string> = {
  covoiturage_standard:   'Covoiturage Standard',
  covoiturage_express:    'Covoiturage Express',
  frais_service_passager: 'Frais de service passager',
  livraison:              'Livraison',
};

function displayLabel(c: Commission) {
  return c.label ?? TYPE_LABELS[c.type] ?? c.type;
}

function parseRate(rate: string): number {
  const n = parseFloat(rate.replace('%', '').trim());
  return isNaN(n) ? 0 : n;
}

interface Props {
  commissions:      Commission[];
  loading:          boolean;
  onSaveCommission: (id: string, updates: { rate: string; status: string }) => void;
}

function EditCommissionModal({
  commission, onClose, onSave,
}: {
  commission: Commission;
  onClose:    () => void;
  onSave:     (updates: Pick<Commission, 'rate' | 'status'>) => void;
}) {
  const [rateNum, setRateNum] = useState<number>(parseRate(commission.rate));
  const [status,  setStatus]  = useState(commission.status);

  const handleSave = () => {
    onSave({ rate: `${rateNum}%`, status });
    onClose();
  };

  return (
    <DetailModal title="Modifier la Commission" onClose={onClose} accentColor="#2563EB">
      <div className="detail-hero" style={{ background: 'rgba(37,99,235,0.06)' }}>
        <div className="modal-icon-bubble" style={{ background: 'rgba(37,99,235,0.12)' }}>
          <AppIcon icon={Pencil} size={22} color="#2563EB" />
        </div>
        <div>
          <p className="detail-hero__name">{displayLabel(commission)}</p>
          <p className="detail-hero__sub">Revenus : {commission.revenue}</p>
        </div>
      </div>

      <DetailSection title="Paramètres">
        <div className="modal-form">
          <div className="modal-form-group">
            <label className="modal-form-label">Type de service</label>
            <input
              className="settings-input"
              type="text"
              value={displayLabel(commission)}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">Taux de commission (%)</label>
            <input
              className="settings-input"
              type="number"
              min={0}
              max={100}
              step={0.5}
              placeholder="Ex : 10"
              value={rateNum}
              onChange={(e) => setRateNum(Number(e.target.value))}
            />
            <span style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>
              Taux actuel : {commission.rate} — entrez la nouvelle valeur sans le symbole %
            </span>
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">Statut</label>
            <select
              className="settings-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>
        </div>
      </DetailSection>

      <div className="modal-form-footer">
        <button
          type="button"
          className="modal-btn-save modal-btn-save--blue"
          disabled={rateNum < 0 || rateNum > 100}
          onClick={handleSave}
        >
          Enregistrer les modifications
        </button>
        <button type="button" className="modal-btn-cancel" onClick={onClose}>
          Annuler
        </button>
      </div>
    </DetailModal>
  );
}

export function SettingsCommissionsCard({ commissions, loading, onSaveCommission }: Props) {
  const [editing, setEditing] = useState<Commission | null>(null);

  const handleSave = (updates: Pick<Commission, 'rate' | 'status'>) => {
    if (!editing) return;
    onSaveCommission(editing.id, updates);
  };

  return (
    <>
      {editing && (
        <EditCommissionModal
          commission={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
      <div className="settings-card">
        <p className="settings-card__title">Paramètres Commissions</p>
        <Table>
          <TableHead>
            <TableRow>
              <Th>Type Service</Th>
              <Th width="130px">Commission</Th>
              <Th width="170px">Revenus Générés</Th>
              <Th width="100px">Statut</Th>
              <Th width="80px">Actions</Th>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <Td><span className="settings-table-text" style={{ color: '#9CA3AF' }}>Chargement…</span></Td>
                <Td /><Td /><Td /><Td />
              </TableRow>
            ) : commissions.length === 0 ? (
              <TableRow>
                <Td><span className="settings-table-text" style={{ color: '#9CA3AF' }}>Aucune commission</span></Td>
                <Td /><Td /><Td /><Td />
              </TableRow>
            ) : commissions.map((row) => (
              <TableRow key={row.id}>
                <Td><span className="settings-table-text">{displayLabel(row)}</span></Td>
                <Td><span className="settings-table-text settings-table-text--bold">{row.rate}</span></Td>
                <Td><span className="settings-table-text">{row.revenue}</span></Td>
                <Td>
                  <Badge label={row.status} variant={row.status === 'Actif' ? 'emerald' : 'neutral'} />
                </Td>
                <Td>
                  <button
                    type="button"
                    className="trip-action-btn"
                    title="Modifier"
                    onClick={() => setEditing(row)}
                  >
                    <AppIcon icon={Pencil} size={14} color="#2563EB" />
                  </button>
                </Td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
