import { loginStyles } from '../styles';
import { APP_VERSION, COPYRIGHT_YEAR, APP_NAME } from '../../../../config/constants';

export function LoginFooter() {
  return (
    <div style={loginStyles.footerBar}>
      <div style={loginStyles.footerLeft}>
        <span style={loginStyles.footerText}>Version {APP_VERSION}</span>

        <div style={loginStyles.footerStatus}>
          <span style={loginStyles.footerStatusDot} />
          Serveurs opérationnels
        </div>

        <span style={loginStyles.footerText}>Disponibilité: 99.9%</span>
      </div>

      <div style={loginStyles.footerRight}>
        <span style={loginStyles.footerText}>
          © {COPYRIGHT_YEAR} {APP_NAME} Platform
        </span>
        <a href="#support" style={loginStyles.footerLink}>
          Support 24/7
        </a>
      </div>
    </div>
  );
}
