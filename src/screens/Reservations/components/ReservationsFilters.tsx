import { Filter, Search, X } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import {
  RESERVATION_CITY_OPTIONS,
  RESERVATION_STATUS_OPTIONS,
  RESERVATION_PAYMENT_OPTIONS,
} from '../../../config/constants';

interface ReservationsFiltersProps {
  search:        string;
  cityFilter:    string;
  statusFilter:  string;
  paymentFilter: string;
  dateFilter:    string;
  onSearch:      (v: string) => void;
  onCity:        (v: string) => void;
  onStatus:      (v: string) => void;
  onPayment:     (v: string) => void;
  onDate:        (v: string) => void;
  onFilter:      () => void;
  onReset:       () => void;
}

export function ReservationsFilters({
  search, cityFilter, statusFilter, paymentFilter, dateFilter,
  onSearch, onCity, onStatus, onPayment, onDate, onFilter, onReset,
}: ReservationsFiltersProps) {
  return (
    <div className="reservations-filters-card">
      {/* Search */}
      <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
          <AppIcon icon={Search} size={15} color="#9CA3AF" />
        </span>
        <input
          type="text"
          className="reservations-filter-date"
          placeholder="ID, passager, téléphone…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          style={{ paddingLeft: 32, width: '100%' }}
        />
      </div>

      <select className="reservations-filter-select" value={cityFilter} onChange={(e) => onCity(e.target.value)}>
        {RESERVATION_CITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select className="reservations-filter-select" value={statusFilter} onChange={(e) => onStatus(e.target.value)}>
        {RESERVATION_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select className="reservations-filter-select" value={paymentFilter} onChange={(e) => onPayment(e.target.value)}>
        {RESERVATION_PAYMENT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <input
        type="date"
        className="reservations-filter-date"
        value={dateFilter}
        onChange={(e) => onDate(e.target.value)}
      />

      <button type="button" className="reservations-filter-btn" onClick={onFilter}>
        <AppIcon icon={Filter} size={15} color="#4B5563" />
        Filtrer
      </button>

      <button type="button" className="reservations-filter-btn" onClick={onReset}
        style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' }}>
        <AppIcon icon={X} size={15} color="#6B7280" />
        Réinitialiser
      </button>
    </div>
  );
}
