import { useState } from 'react';
import {
  LayoutDashboard, Users, Car, Truck, UserCheck, Navigation,
  Calendar, CreditCard, AlertCircle, HeadphonesIcon,
  Bell, Settings, LogOut, Building2, X, MapPin, MessageSquare,
  Shield, BarChart2, Banknote, Star, RotateCcw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { AppIcon } from '../../Common/AppIcon';
import { NAV_ITEMS, NAV_GROUPS, APP_NAME, APP_SUBTITLE } from '../../../config/constants';
import type { NavItemId } from '../../../config/constants';
import { useAuth } from '../../../hooks/useAuth';
import { ConfirmDialog } from '../../Overlay/ConfirmDialog/ConfirmDialog';

interface SidebarProps {
  isOpen:  boolean;
  onClose: () => void;
}

const NAV_ICONS: Record<NavItemId, LucideIcon> = {
  dashboard:     LayoutDashboard,
  users:         Users,
  drivers:       Car,
  vehicles:      Truck,
  passengers:    UserCheck,
  trips:         Navigation,
  reservations:  Calendar,
  payments:      CreditCard,
  disputes:      AlertCircle,
  support:       HeadphonesIcon,
  notifications: Bell,
  settings:      Settings,
  tracking:      MapPin,
  messaging:     MessageSquare,
  audit:         Shield,
  reports:       BarChart2,
  payouts:       Banknote,
  reviews:       Star,
  refunds:       RotateCcw,
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); logout(); }}
        title="Déconnexion"
        message="Voulez-vous vraiment vous déconnecter ? Votre session sera définitivement fermée."
        confirmLabel="Se déconnecter"
        variant="danger"
        icon={LogOut}
      />

      <aside className={`dash-sidebar${isOpen ? ' dash-sidebar--open' : ''}`}>
        {/* Logo + close button (mobile) */}
        <div className="dash-sidebar__logo">
          <div className="dash-sidebar__logo-box">
            <AppIcon icon={Building2} size={24} color="white" strokeWidth={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="dash-sidebar__logo-title">{APP_NAME}</div>
            <div className="dash-sidebar__logo-sub">{APP_SUBTITLE}</div>
          </div>
          <button className="dash-sidebar__close" type="button" onClick={onClose} aria-label="Fermer le menu">
            <AppIcon icon={X} size={20} color="white" />
          </button>
        </div>

        {/* Navigation groupée par section */}
        <nav className="dash-sidebar__nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="dash-nav-group">
              <span className="dash-nav-group__label">{group.label}</span>
              {group.items.map((id) => {
                const item = NAV_ITEMS.find((n) => n.id === id)!;
                const Icon = NAV_ICONS[id];
                return (
                  <NavLink
                    key={id}
                    to={item.path}
                    className={({ isActive }) =>
                      'dash-nav-item' + (isActive ? ' dash-nav-item--active' : '')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <AppIcon
                          icon={Icon}
                          size={20}
                          color={isActive ? 'white' : '#D1D5DB'}
                          strokeWidth={isActive ? 2 : 1.5}
                        />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="dash-sidebar__footer">
          <button className="dash-sidebar__logout" type="button" onClick={() => setConfirmOpen(true)}>
            <AppIcon icon={LogOut} size={20} color="#E53935" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
