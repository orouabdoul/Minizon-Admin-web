import { RotateCcw } from 'lucide-react';
import { AppIcon }   from '../../../components/Common/AppIcon';
import {
  PASSENGER_CITY_OPTIONS,
  PASSENGER_RISK_OPTIONS,
  PASSENGER_STATUS_OPTIONS,
  PASSENGER_VERIF_OPTIONS,
} from '../../../config/constants';

interface PassengersFiltersProps {
  cityFilter:   string;
  riskFilter:   string;
  statusFilter: string;
  verifFilter:  string;
  onCity:       (v: string) => void;
  onRisk:       (v: string) => void;
  onStatus:     (v: string) => void;
  onVerif:      (v: string) => void;
  onReset:      () => void;
}

export function PassengersFilters({
  cityFilter, riskFilter, statusFilter, verifFilter,
  onCity, onRisk, onStatus, onVerif, onReset,
}: PassengersFiltersProps) {
  return (
    <div className="passengers-filters">
      <select
        className="passengers-filter-select"
        value={cityFilter}
        onChange={(e) => onCity(e.target.value)}
      >
        {PASSENGER_CITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        className="passengers-filter-select"
        value={riskFilter}
        onChange={(e) => onRisk(e.target.value)}
      >
        {PASSENGER_RISK_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        className="passengers-filter-select"
        value={statusFilter}
        onChange={(e) => onStatus(e.target.value)}
      >
        {PASSENGER_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        className="passengers-filter-select"
        value={verifFilter}
        onChange={(e) => onVerif(e.target.value)}
      >
        {PASSENGER_VERIF_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <button type="button" className="passengers-reset-btn" onClick={onReset}>
        <AppIcon icon={RotateCcw} size={16} color="#fff" />
        Réinitialiser
      </button>
    </div>
  );
}
