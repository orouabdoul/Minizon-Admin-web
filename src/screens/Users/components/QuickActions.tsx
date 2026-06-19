import { UserCheck, UserX, AlertTriangle, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppIcon }           from '../../../components/Common/AppIcon';
import { USER_QUICK_ACTIONS } from '../../../config/constants';
import { actionIconBox }      from '../styles';

const ICON_MAP: Record<string, LucideIcon> = {
  usercheck: UserCheck,
  userx:     UserX,
  alert:     AlertTriangle,
};

const ACTION_BG: Record<string, string> = {
  approve: 'rgba(0,168,107,0.10)',
  suspend: 'rgba(229,57,53,0.10)',
  resolve: 'rgba(251,140,0,0.10)',
};

export function QuickActions() {
  return (
    <div className="users-card">
      <div className="users-card__title">Actions Rapides</div>
      <div className="quick-actions-list">
        {USER_QUICK_ACTIONS.map((action) => {
          const Icon = ICON_MAP[action.iconId] ?? AlertTriangle;
          return (
            <button key={action.id} type="button" className="quick-action-item">
              <div className="quick-action-item__left">
                <div style={actionIconBox(ACTION_BG[action.id])}>
                  <AppIcon icon={Icon} size={20} color={action.iconColor} />
                </div>
                <span className="quick-action-item__label">{action.label}</span>
              </div>
              <AppIcon icon={ChevronRight} size={18} color="#9CA3AF" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
