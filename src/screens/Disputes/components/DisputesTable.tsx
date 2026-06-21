import { Search, RotateCcw, Filter } from 'lucide-react';
import { AppIcon }  from '../../../components/Common/AppIcon';
import { Badge }    from '../../../components/DataDisplay/Badge/Badge';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../../../components/DataDisplay/Table/Table';
import { DISPUTE_TYPE_OPTIONS, DISPUTE_STATUS_OPTIONS, DISPUTE_PRIORITY_OPTIONS } from '../../../config/constants';
import type { BadgeVariant }  from '../../../components/DataDisplay/Badge/Badge';
import type { Dispute, DisputeStatus, DisputeType, DisputePriority, DisputeTab } from '../../../models/dispute.model';

interface DisputesTableProps {
  disputes:          Dispute[];
  tabCounts:         { all: number; open: number; critical: number };
  tabFilter:         DisputeTab;
  switchTab:         (t: DisputeTab) => void;
  search:            string;
  setSearch:         (v: string) => void;
  typeFilter:        string;
  setTypeFilter:     (v: string) => void;
  statusFilter:      string;
  setStatusFilter:   (v: string) => void;
  priorityFilter:    string;
  setPriorityFilter: (v: string) => void;
  onReset:           () => void;
  applyFilters:      () => void;
  total:             number;
  pageSize:          number;
  currentPage:       number;
  setCurrentPage:    (p: number) => void;
  selectedId:        string | null;
  openDispute:       (id: string) => void;
  loading:           boolean;
  fetchError:        string | null;
}

const STATUS_VARIANT: Record<DisputeStatus, BadgeVariant> = {
  Ouvert:    'error',
  'En cours':'warning',
  Résolu:    'primary',
  Clôturé:   'neutral',
};
const TYPE_VARIANT: Record<DisputeType, BadgeVariant> = {
  Paiement:     'info',
  Annulation:   'amber',
  Comportement: 'error',
  Retard:       'warning',
  Autre:        'neutral',
};
const PRIORITY_DOT: Record<DisputePriority, string> = {
  Critique: '#E53935',
  Élevée:   '#FB8C00',
  Moyenne:  '#F4B400',
  Faible:   '#9CA3AF',
};

const TABS: { id: DisputeTab; label: string }[] = [
  { id: 'all',      label: 'Tous'      },
  { id: 'open',     label: 'Ouverts'   },
  { id: 'critical', label: 'Critiques' },
];

function Pagination({ total, pageSize, currentPage, onChange }: {
  total: number; pageSize: number; currentPage: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = (currentPage - 1) * pageSize + 1;
  const to   = Math.min(currentPage * pageSize, total);
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  for (let p = start; p <= Math.min(totalPages, start + 4); p++) pages.push(p);
  return (
    <div className="disputes-pagination">
      <span className="disputes-pagination__info">
        Affichage de {from} à {to} sur {total.toLocaleString('fr-FR')} litiges
      </span>
      <div className="disputes-pagination__pages">
        <button type="button" className="disputes-pagination__btn" disabled={currentPage === 1} onClick={() => onChange(currentPage - 1)}>Précédent</button>
        {pages.map((p) => (
          <button key={p} type="button" className={`disputes-pagination__btn${p === currentPage ? ' disputes-pagination__btn--active' : ''}`} onClick={() => onChange(p)}>{p}</button>
        ))}
        <button type="button" className="disputes-pagination__btn" disabled={currentPage === totalPages} onClick={() => onChange(currentPage + 1)}>Suivant</button>
      </div>
    </div>
  );
}

export function DisputesTable({
  disputes, tabCounts, tabFilter, switchTab,
  search, setSearch, typeFilter, setTypeFilter,
  statusFilter, setStatusFilter, priorityFilter, setPriorityFilter,
  onReset, applyFilters,
  total, pageSize, currentPage, setCurrentPage,
  selectedId, openDispute,
  loading, fetchError,
}: DisputesTableProps) {
  return (
    <div className="disputes-table-card">

      {/* ── Tabs ── */}
      <div className="disputes-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`disputes-tab${tabFilter === tab.id ? ' disputes-tab--active' : ''}`}
            onClick={() => switchTab(tab.id)}
          >
            {tab.label}
            <span className="disputes-tab__count">{tabCounts[tab.id]}</span>
          </button>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div className="disputes-table-filterbar">
        <div className="disputes-table-filterbar__search">
          <AppIcon icon={Search} size={16} color="#9CA3AF" />
          <input
            type="text"
            placeholder="Rechercher un litige, utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="disputes-table-filterbar__input"
          />
        </div>
        <select className="disputes-filter-select" value={typeFilter}     onChange={(e) => setTypeFilter(e.target.value)}>
          {DISPUTE_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="disputes-filter-select" value={statusFilter}   onChange={(e) => setStatusFilter(e.target.value)}>
          {DISPUTE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="disputes-filter-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          {DISPUTE_PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button type="button" className="disputes-filter-apply" onClick={applyFilters} title="Appliquer les filtres">
          <AppIcon icon={Filter} size={15} color="#fff" />
        </button>
        <button type="button" className="disputes-filter-reset" onClick={onReset} title="Réinitialiser">
          <AppIcon icon={RotateCcw} size={16} color="#6B7280" />
        </button>
      </div>

      {/* ── Table ── */}
      <Table>
        <TableHead>
          <TableRow>
            <Th width="130px">ID Litige</Th>
            <Th>Trajet / Motif</Th>
            <Th width="120px">Type</Th>
            <Th width="110px">Priorité</Th>
            <Th width="110px">Statut</Th>
            <Th width="130px">Montant</Th>
            <Th width="80px">Ouvrir</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <Td colSpan={7}><div className="data-table__empty">Chargement…</div></Td>
            </TableRow>
          ) : fetchError ? (
            <TableRow>
              <Td colSpan={7}><div className="data-table__empty" style={{ color: '#E53935' }}>{fetchError}</div></Td>
            </TableRow>
          ) : disputes.length === 0 ? (
            <TableRow>
              <Td colSpan={7}><div className="data-table__empty">Aucun litige trouvé</div></Td>
            </TableRow>
          ) : (
            disputes.map((d) => (
              <TableRow
                key={d.id}
                onClick={() => openDispute(d.id)}
                className={d.id === selectedId ? 'disputes-row--active' : undefined}
              >
                <Td>
                  <div className="payment-id-cell">
                    <span className="payment-id">{d.disputeId}</span>
                    <span className="payment-ref">{d.createdAgo}</span>
                  </div>
                </Td>
                <Td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{d.trajet}</span>
                    <span style={{ fontSize: 12, color: '#6B7280', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.motif}</span>
                  </div>
                </Td>
                <Td><Badge label={d.type} variant={TYPE_VARIANT[d.type]} /></Td>
                <Td>
                  <div className="dispute-priority-cell">
                    <span className="dispute-priority-dot" style={{ background: PRIORITY_DOT[d.priority] }} />
                    <span className="dispute-priority-label">{d.priority}</span>
                  </div>
                </Td>
                <Td><Badge label={d.status} variant={STATUS_VARIANT[d.status]} /></Td>
                <Td>
                  <span className="dispute-amount">{d.amount}</span>
                </Td>
                <Td>
                  <button
                    type="button"
                    className={`disputes-ouvrir-btn${d.id === selectedId ? ' disputes-ouvrir-btn--active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); openDispute(d.id); }}
                  >
                    Ouvrir
                  </button>
                </Td>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination total={total} pageSize={pageSize} currentPage={currentPage} onChange={setCurrentPage} />
    </div>
  );
}
