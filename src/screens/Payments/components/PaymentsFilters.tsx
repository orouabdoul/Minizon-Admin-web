import { RotateCcw, Search, Filter } from 'lucide-react';
import { AppIcon }    from '../../../components/Common/AppIcon';
import { PAYMENT_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS } from '../../../config/constants';

interface PaymentsFiltersProps {
  statusFilter: string; methodFilter: string; dateFilter: string; search: string;
  onStatus: (v: string) => void; onMethod: (v: string) => void;
  onDate:   (v: string) => void; onSearch: (v: string) => void;
  onReset:  () => void;
  onFilter: () => void;
}

export function PaymentsFilters({
  statusFilter, methodFilter, dateFilter, search,
  onStatus, onMethod, onDate, onSearch, onReset, onFilter,
}: PaymentsFiltersProps) {
  return (
    <div className="payments-filters-card">
      <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
          <AppIcon icon={Search} size={15} color="#9CA3AF" />
        </span>
        <input
          type="text"
          className="payments-filter-search"
          style={{ paddingLeft: 32, width: '100%' }}
          placeholder="Rechercher une transaction..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onFilter()}
        />
      </div>
      <select className="payments-filter-select" value={statusFilter} onChange={(e) => onStatus(e.target.value)}>
        {PAYMENT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select className="payments-filter-select" value={methodFilter} onChange={(e) => onMethod(e.target.value)}>
        {PAYMENT_METHOD_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input type="date" className="payments-filter-date" value={dateFilter} onChange={(e) => onDate(e.target.value)} />
      <button type="button" className="payments-filter-apply" onClick={onFilter} title="Appliquer les filtres">
        <AppIcon icon={Filter} size={15} color="#fff" />
      </button>
      <button type="button" className="payments-filter-reset" onClick={onReset} title="Réinitialiser">
        <AppIcon icon={RotateCcw} size={15} color="#6B7280" />
      </button>
    </div>
  );
}
