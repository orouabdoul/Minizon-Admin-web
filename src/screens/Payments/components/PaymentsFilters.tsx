import { RotateCcw, Search, Filter } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import { PAYMENT_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS } from '../../../config/constants';

interface PaymentsFiltersProps {
  statusFilter: string;
  methodFilter: string;
  dateFilter:   string;
  search:       string;
  onStatus:  (v: string) => void;
  onMethod:  (v: string) => void;
  onDate:    (v: string) => void;
  onSearch:  (v: string) => void;
  onReset:   () => void;
  onFilter:  () => void;
}

export function PaymentsFilters({
  statusFilter, methodFilter, dateFilter, search,
  onStatus, onMethod, onDate, onSearch, onReset, onFilter,
}: PaymentsFiltersProps) {
  const hasFilters = !!(statusFilter || methodFilter || dateFilter || search);

  return (
    <div className="payments-filters-card">
      {/* Search */}
      <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
        <span style={{
          position: 'absolute', left: 11, top: '50%',
          transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex',
        }}>
          <AppIcon icon={Search} size={14} color="#9CA3AF" />
        </span>
        <input
          type="text"
          className="payments-filter-search"
          style={{ paddingLeft: 34, width: '100%', boxSizing: 'border-box' }}
          placeholder="Référence, nom, téléphone…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onFilter()}
        />
      </div>

      {/* Statut */}
      <select
        className="payments-filter-select"
        value={statusFilter}
        onChange={(e) => onStatus(e.target.value)}
      >
        {PAYMENT_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Opérateur */}
      <select
        className="payments-filter-select"
        value={methodFilter}
        onChange={(e) => onMethod(e.target.value)}
      >
        {PAYMENT_METHOD_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Date */}
      <input
        type="date"
        className="payments-filter-date"
        value={dateFilter}
        onChange={(e) => onDate(e.target.value)}
        title="Date de création (YYYY-MM-DD)"
      />

      {/* Apply */}
      <button
        type="button"
        className="payments-filter-apply"
        onClick={onFilter}
        title="Appliquer les filtres"
      >
        <AppIcon icon={Filter} size={13} color="#fff" />
        Filtrer
      </button>

      {/* Reset — visible uniquement quand des filtres sont actifs */}
      {hasFilters && (
        <button
          type="button"
          className="payments-filter-reset"
          onClick={onReset}
          title="Réinitialiser les filtres"
        >
          <AppIcon icon={RotateCcw} size={14} color="#6B7280" />
        </button>
      )}
    </div>
  );
}
