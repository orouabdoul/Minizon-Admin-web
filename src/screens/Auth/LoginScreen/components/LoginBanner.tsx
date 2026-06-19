import { Building2, Lock, ShieldCheck } from 'lucide-react';
import { AppIcon } from '../../../../components/Common/AppIcon';
import { BannerStatCards } from './BannerStatCard';
import { loginStyles } from '../styles';
import { colors } from '../../../../theme/colors';
import {
  APP_NAME,
  APP_SUBTITLE,
  APP_DESCRIPTION,
  APP_SUBDESCRIPTION,
  BANNER_SECURITY_FEATURES,
} from '../../../../config/constants';

// Fond = #00A86B → icônes blanches pour contraste
const SECURITY_ICONS = {
  ssl:        <AppIcon icon={Lock}        size={14} color={colors.white} />,
  monitoring: <AppIcon icon={ShieldCheck} size={14} color={colors.white} />,
} as const;

export function LoginBanner() {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
      }}
    >
      {/* Header — logo + titles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={loginStyles.bannerLogoBox}>
          <AppIcon icon={Building2} size={24} color={colors.white} strokeWidth={2} />
        </div>

        <div style={loginStyles.bannerTitle}>{APP_NAME}</div>
        <div style={loginStyles.bannerSubtitle}>{APP_SUBTITLE}</div>
        <div style={loginStyles.bannerDescription}>{APP_DESCRIPTION}</div>
        <div style={loginStyles.bannerSubdescription}>{APP_SUBDESCRIPTION}</div>
      </div>

      {/* Stats grid */}
      <BannerStatCards />

      {/* Security features */}
      <div style={loginStyles.bannerSecurityRow}>
        {BANNER_SECURITY_FEATURES.map((feat) => (
          <div key={feat.id} style={loginStyles.bannerSecurityItem}>
            {SECURITY_ICONS[feat.id as keyof typeof SECURITY_ICONS]}
            {feat.label}
          </div>
        ))}
      </div>
    </div>
  );
}
