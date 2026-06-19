import { Search, Bell, Menu } from 'lucide-react';
import { AppIcon }     from '../../Common/AppIcon';
import { ADMIN_USER }  from '../../../config/constants';
import { ProfilePanel } from './ProfilePanel';

interface HeaderProps {
  title:        string;
  onMenuToggle: () => void;
}

export function Header({ title, onMenuToggle }: HeaderProps) {
  return (
    <header className="dash-header">
      <div className="dash-header__left">
        <button
          className="dash-header__hamburger"
          type="button"
          aria-label="Ouvrir le menu"
          onClick={onMenuToggle}
        >
          <AppIcon icon={Menu} size={22} color="#374151" />
        </button>

        <h1 className="dash-header__title">{title}</h1>

        <div className="dash-header__search">
          <AppIcon icon={Search} size={16} color="#9CA3AF" />
          <input
            className="dash-header__search-input"
            type="text"
            placeholder="Rechercher..."
          />
        </div>
      </div>

      <div className="dash-header__right">
        <button className="dash-header__notif" type="button" aria-label="Notifications">
          <AppIcon icon={Bell} size={20} color="#4B5563" />
          {ADMIN_USER.notificationCount > 0 && (
            <span className="dash-header__notif-badge">
              {ADMIN_USER.notificationCount}
            </span>
          )}
        </button>

        <ProfilePanel />
      </div>
    </header>
  );
}
