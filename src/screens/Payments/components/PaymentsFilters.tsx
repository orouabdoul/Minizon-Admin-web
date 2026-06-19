import { RotateCcw }  from 'lucide-react';
import { AppIcon }    from '../../../components/Common/AppIcon';
import { PAYMENT_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS } from '../../../config/constants';

interface PaymentsFiltersProps {
  statusFilter: string; methodFilter: string; dateFilter: string; search: string;
  onStatus: (v: string) => void; onMethod: (v: string) => void;
  onDate:   (v: string) => void; onSearch: (v: string) => void;
  onReset:  () => void;
}

export function PaymentsFilters({
  statusFilter, methodFilter, dateFilter, search,
  onStatus, onMethod, onDate, onSearch, onReset,
}: PaymentsFiltersProps) {
  return (
    <div className="payments-filters-card">
      <input
        type="text"
        className="payments-filter-search"
        placeholder="Rechercher une transaction..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select className="payments-filter-select" value={statusFilter} onChange={(e) => onStatus(e.target.value)}>
        {PAYMENT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select className="payments-filter-select" value={methodFilter} onChange={(e) => onMethod(e.target.value)}>
        {PAYMENT_METHOD_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input type="date" className="payments-filter-date" value={dateFilter} onChange={(e) => onDate(e.target.value)} />
      <button type="button" className="payments-filter-reset" onClick={onReset}>
        <AppIcon icon={RotateCcw} size={16} color="#6B7280" />
      </button>
    </div>
  );
}
