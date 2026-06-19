import { Users, Car, ShieldCheck, Globe } from 'lucide-react';
import { StatCard } from '../../../../components/DataDisplay/StatCard/StatCard';
import { AppIcon } from '../../../../components/Common/AppIcon';
import { colors } from '../../../../theme/colors';
import { BANNER_STATS } from '../../../../config/constants';

// Fond des cards = rgba(white, 10%) sur vert → icônes blanches obligatoires
const ICONS = {
  users:  <AppIcon icon={Users}       size={18} color={colors.white} />,
  trips:  <AppIcon icon={Car}         size={18} color={colors.white} />,
  secure: <AppIcon icon={ShieldCheck} size={18} color={colors.white} />,
  uptime: <AppIcon icon={Globe}       size={18} color={colors.white} />,
} as const;

export function BannerStatCards() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '16px',
      }}
    >
      {BANNER_STATS.map((stat) => (
        <StatCard
          key={stat.id}
          value={stat.value}
          label={stat.label}
          badge={stat.badge}
          badgeColor={stat.badgeColor}
          icon={ICONS[stat.id as keyof typeof ICONS]}
        />
      ))}
    </div>
  );
}
