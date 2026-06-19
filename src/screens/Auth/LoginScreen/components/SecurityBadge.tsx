import { loginStyles } from '../styles';
import { SECURITY_BADGES } from '../../../../config/constants';

export function SecurityBadges() {
  return (
    <div style={loginStyles.securityBadgesRow}>
      {SECURITY_BADGES.map((badge) => (
        <div key={badge.id} style={loginStyles.securityBadge}>
          <span style={loginStyles.securityDot} />
          {badge.label}
        </div>
      ))}
    </div>
  );
}
