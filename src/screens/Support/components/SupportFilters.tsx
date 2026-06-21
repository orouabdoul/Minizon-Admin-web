import { Plus, Download, RotateCcw, Filter } from 'lucide-react';
import { AppIcon }  from '../../../components/Common/AppIcon';
import { SUPPORT_PRIORITY_OPTIONS } from '../../../config/constants';
import type { SupportAgent } from '../../../models/support.model';

interface SupportFiltersProps {
  statusFilter:   string;
  priorityFilter: string;
  agentFilter:    string;
  dateFilter:     string;
  agents:         SupportAgent[];
  onStatus:       (v: string) => void;
  onPriority:     (v: string) => void;
  onAgent:        (v: string) => void;
  onDate:         (v: string) => void;
  onFilter:       () => void;
  onReset:        () => void;
  onNewTicket:    () => void;
}

export function SupportFilters({
  statusFilter, priorityFilter, agentFilter, dateFilter,
  agents, onStatus, onPriority, onAgent, onDate,
  onFilter, onReset, onNewTicket,
}: SupportFiltersProps) {
  return (
    <div className="support-filters-card">
      <div className="support-filters-left">
        <select className="support-filter-select" value={statusFilter} onChange={(e) => onStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="Nouveau">Nouveau</option>
          <option value="En cours">En cours</option>
          <option value="Résolu">Résolu</option>
          <option value="Clôturé">Clôturé</option>
        </select>
        <select className="support-filter-select" value={priorityFilter} onChange={(e) => onPriority(e.target.value)}>
          <option value="">Toutes priorités</option>
          {SUPPORT_PRIORITY_OPTIONS.slice(1).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select className="support-filter-select" value={agentFilter} onChange={(e) => onAgent(e.target.value)}>
          <option value="">Tous les agents</option>
          <option value="unassigned">Non assignés</option>
          {agents.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
        <input
          type="date"
          className="support-filter-date"
          value={dateFilter}
          onChange={(e) => onDate(e.target.value)}
        />
        <button type="button" className="support-filter-apply" onClick={onFilter} title="Appliquer les filtres">
          <AppIcon icon={Filter} size={14} color="#fff" />
        </button>
        <button type="button" className="support-filter-reset" onClick={onReset} title="Réinitialiser">
          <AppIcon icon={RotateCcw} size={14} color="#6B7280" />
        </button>
      </div>
      <div className="support-filters-right">
        <button type="button" className="support-btn support-btn--primary" onClick={onNewTicket}>
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
