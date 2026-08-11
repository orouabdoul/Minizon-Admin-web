import { Users, Car, ShieldCheck, Globe } from 'lucide-react';
import { StatCard }        from '../../../../components/DataDisplay/StatCard/StatCard';
import { AppIcon }         from '../../../../components/Common/AppIcon';
import { colors }          from '../../../../theme/colors';
import { useBannerStats }  from '../../../../hooks/useBannerStats';

// Fond des cards = rgba(white, 10%) sur vert → icônes blanches
const ICONS = {
  users:  <AppIcon icon={Users}       size={18} color={colors.white} />,
  trips:  <AppIcon icon={Car}         size={18} color={colors.white} />,
  secure: <AppIcon icon={ShieldCheck} size={18} color={colors.white} />,
  uptime: <AppIcon icon={Globe}       size={18} color={colors.white} />,
} as const;

// Skeleton d'une carte pendant le chargement
function StatCardSkeleton() {
  return (
    <div style={{
      flex: '1 1 calc(50% - 8px)',
      minWidth: '130px',
      height: '118px',
      padding: '16px',
      background: 'rgba(255,255,255,0.10)',
      borderRadius: 12,
      outline: '1px solid rgba(255,255,255,0.15)',
      outlineOffset: '-1px',
      display: 'flex',
      flexDirection: 'column',
      gap: 9,
      boxSizing: 'border-box',
    }}>
      {/* icon + badge row */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.20)' }} />
        <div style={{ width: 36, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.20)' }} />
      </div>
      {/* value */}
      <div style={{ width: 70, height: 22, borderRadius: 4, background: 'rgba(255,255,255,0.25)',
        animation: 'banner-pulse 1.4s ease-in-out infinite' }} />
      {/* label */}
      <div style={{ width: 90, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.18)',
        animation: 'banner-pulse 1.4s ease-in-out infinite 0.2s' }} />

      <style>{`
        @keyframes banner-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}

export function BannerStatCards() {
  const { stats, loading } = useBannerStats();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', paddingBottom: '16px' }}>
      {loading
        ? Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)
        : stats.map((stat) => (
            <StatCard
              key={stat.id}
              value={stat.value}
              label={stat.label}
              badge={stat.badge}
              badgeColor={stat.badgeColor}
              icon={ICONS[stat.id as keyof typeof ICONS]}
            />
          ))
      }
    </div>
  );
}
