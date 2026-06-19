import { Plus, Download } from 'lucide-react';
import { AppIcon }          from '../../../components/Common/AppIcon';
import {
  SUPPORT_STATUS_OPTIONS,
  SUPPORT_PRIORITY_OPTIONS,
  SUPPORT_AGENT_OPTIONS,
} from '../../../config/constants';

interface SupportFiltersProps {
  statusFilter:      string;
  priorityFilter:    string;
  agentFilter:       string;
  onStatus:          (v: string) => void;
  onPriority:        (v: string) => void;
  onAgent:           (v: string) => void;
  onReset:           () => void;
}

export function SupportFilters({
  statusFilter, priorityFilter, agentFilter,
  onStatus, onPriority, onAgent,
}: SupportFiltersProps) {
  return (
    <div className="support-filters-card">
      <div className="support-filters-left">
        <select className="support-filter-select" value={statusFilter}   onChange={(e) => onStatus(e.target.value)}>
          {SUPPORT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="support-filter-select" value={priorityFilter} onChange={(e) => onPriority(e.target.value)}>
          {SUPPORT_PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="support-filter-select" value={agentFilter}    onChange={(e) => onAgent(e.target.value)}>
          {SUPPORT_AGENT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="date" className="support-filter-date" placeholder="mm/dd/yyyy" />
      </div>
      <div className="support-filters-right">
        <button type="button" className="support-btn support-btn--primary">
          <AppIcon icon={Plus} size={14} color="#fff" />
          Nouveau Ticket
        </button>
        <button type="button" className="support-btn support-btn--secondary">
          <AppIcon icon={Download} size={14} color="#374151" />
          Exporter
        </button>
      </div>
    </div>
  );
}
