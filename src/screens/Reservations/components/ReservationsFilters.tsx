import { Filter } from 'lucide-react';
import { AppIcon }  from '../../../components/Common/AppIcon';
import {
  RESERVATION_CITY_OPTIONS,
  RESERVATION_STATUS_OPTIONS,
  RESERVATION_PAYMENT_OPTIONS,
} from '../../../config/constants';

interface ReservationsFiltersProps {
  cityFilter:    string;
  statusFilter:  string;
  paymentFilter: string;
  dateFilter:    string;
  onCity:        (v: string) => void;
  onStatus:      (v: string) => void;
  onPayment:     (v: string) => void;
  onDate:        (v: string) => void;
  onFilter:      () => void;
}

export function ReservationsFilters({
  cityFilter, statusFilter, paymentFilter, dateFilter,
  onCity, onStatus, onPayment, onDate, onFilter,
}: ReservationsFiltersProps) {
  return (
    <div className="reservations-filters-card">
      <select
        className="reservations-filter-select"
        value={cityFilter}
        onChange={(e) => onCity(e.target.value)}
      >
        {RESERVATION_CITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        className="reservations-filter-select"
        value={statusFilter}
        onChange={(e) => onStatus(e.target.value)}
      >
        {RESERVATION_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        className="reservations-filter-select"
        value={paymentFilter}
        onChange={(e) => onPayment(e.target.value)}
      >
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
        <AppIcon icon={Filter} size={16} color="#4B5563" />
        Plus de filtres
      </button>
    </div>
  );
}
