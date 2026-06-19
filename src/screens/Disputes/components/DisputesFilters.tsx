import { RotateCcw } from 'lucide-react';
import { AppIcon }   from '../../../components/Common/AppIcon';
import { DISPUTE_TYPE_OPTIONS, DISPUTE_STATUS_OPTIONS, DISPUTE_PRIORITY_OPTIONS } from '../../../config/constants';

interface DisputesFiltersProps {
  typeFilter: string; statusFilter: string; priorityFilter: string; search: string;
  onType:     (v: string) => void; onStatus:   (v: string) => void;
  onPriority: (v: string) => void; onSearch:   (v: string) => void;
  onReset:    () => void;
}

export function DisputesFilters({
  typeFilter, statusFilter, priorityFilter, search,
  onType, onStatus, onPriority, onSearch, onReset,
}: DisputesFiltersProps) {
  return (
    <div className="disputes-filters-card">
      <input type="text" className="disputes-filter-search" placeholder="Rechercher un litige..."
        value={search} onChange={(e) => onSearch(e.target.value)} />
      <select className="disputes-filter-select" value={typeFilter}     onChange={(e) => onType(e.target.value)}>
        {DISPUTE_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select className="disputes-filter-select" value={statusFilter}   onChange={(e) => onStatus(e.target.value)}>
        {DISPUTE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select className="disputes-filter-select" value={priorityFilter} onChange={(e) => onPriority(e.target.value)}>
        {DISPUTE_PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button type="button" className="disputes-filter-reset" onClick={onReset}>
        <AppIcon icon={RotateCcw} size={16} color="#6B7280" />
      </button>
    </div>
  );
}
