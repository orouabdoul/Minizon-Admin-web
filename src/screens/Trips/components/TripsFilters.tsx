import { Search } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import {
  TRIP_DEPARTURE_OPTIONS,
  TRIP_DESTINATION_OPTIONS,
  TRIP_STATUS_OPTIONS,
} from '../../../config/constants';

interface TripsFiltersProps {
  departureFilter:    string;
  destinationFilter:  string;
  statusFilter:       string;
  dateFilter:         string;
  onDeparture:        (v: string) => void;
  onDestination:      (v: string) => void;
  onStatus:           (v: string) => void;
  onDate:             (v: string) => void;
  onFilter:           () => void;
}

export function TripsFilters({
  departureFilter, destinationFilter, statusFilter, dateFilter,
  onDeparture, onDestination, onStatus, onDate, onFilter,
}: TripsFiltersProps) {
  return (
    <div className="trips-filters-card">
      <div className="trips-filters-row">
        <div className="trips-filter-group">
          <label className="trips-filter-label">Ville de départ</label>
          <select
            className="trips-filter-select"
            value={departureFilter}
            onChange={(e) => onDeparture(e.target.value)}
          >
            {TRIP_DEPARTURE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="trips-filter-group">
          <label className="trips-filter-label">Destination</label>
          <select
            className="trips-filter-select"
            value={destinationFilter}
            onChange={(e) => onDestination(e.target.value)}
          >
            {TRIP_DESTINATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="trips-filter-group">
          <label className="trips-filter-label">Statut</label>
          <select
            className="trips-filter-select"
            value={statusFilter}
            onChange={(e) => onStatus(e.target.value)}
          >
            {TRIP_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="trips-filter-group">
          <label className="trips-filter-label">Date</label>
          <input
            type="date"
            className="trips-filter-date"
            value={dateFilter}
            onChange={(e) => onDate(e.target.value)}
          />
        </div>

        <div className="trips-filter-btn-wrap">
          <button type="button" className="trips-filter-btn" onClick={onFilter}>
            <AppIcon icon={Search} size={16} color="#fff" />
            Filtrer
          </button>
        </div>
      </div>
    </div>
  );
}
