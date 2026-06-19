import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Headphones, ShieldCheck } from 'lucide-react';
import { Input } from '../../../../components/Common/Input/Input';
import { Button } from '../../../../components/Common/Button/Button';
import { Checkbox } from '../../../../components/Common/Checkbox/Checkbox';
import { AppIcon } from '../../../../components/Common/AppIcon';
import { SecurityBadges } from './SecurityBadge';
import { loginStyles } from '../styles';
import { colors } from '../../../../theme/colors';
import { validators } from '../../../../utils/validators';
import { useAuth } from '../../../../hooks/useAuth';
import { ROUTES } from '../../../../navigation/routes';

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]               = useState('admin@minizon.com');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [twoFactor, setTwoFactor]       = useState(false);
  const [errors, setErrors]             = useState<FormErrors>({});

  function validate(): boolean {
    const next: FormErrors = {};
    const emailErr    = validators.email(email);
    const passwordErr = validators.required(password);
    if (emailErr)    next.email    = emailErr;
    if (passwordErr) next.password = passwordErr;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const ok = await login({ email, password, rememberMe, twoFactorEnabled: twoFactor });
    if (ok) navigate(ROUTES.DASHBOARD);
  }

  return (
    <div style={{ width: '100%', maxWidth: '448px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Card */}
      <form style={loginStyles.formCard} onSubmit={handleSubmit} noValidate>
        {/* Header */}
        <div style={loginStyles.formHeader}>
          <h1 style={loginStyles.formTitle}>
            Connexion<br />Administrateur
          </h1>
          <p style={loginStyles.formSubtitle}>
            Accédez au centre de contrôle sécurisé MINIZON
          </p>
        </div>

        {/* Fields + options + submit */}
        <div style={loginStyles.formFields}>
          <Input
            id="email"
            type="email"
            label="Email administrateur"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<AppIcon icon={Mail} size={16} color={colors.textLight} />}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Mot de passe sécurisé"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<AppIcon icon={Lock} size={14} color={colors.textLight} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                <AppIcon
                  icon={showPassword ? EyeOff : Eye}
                  size={20}
                  color={colors.textLight}
                />
              </button>
            }
            error={errors.password}
            autoComplete="current-password"
          />

          {/* Options */}
          <div style={loginStyles.formOptions}>
            <div style={loginStyles.formOptionsRow}>
              <Checkbox
                id="rememberMe"
                label="Se souvenir de moi"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <button
                type="button"
                style={loginStyles.forgotPassword}
                onClick={() => void 0}
              >
                Mot de passe oublié?
              </button>
            </div>

            <Checkbox
              id="twoFactor"
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Authentification 2FA
                  <AppIcon icon={ShieldCheck} size={16} color={colors.primary} />
                </span>
              }
              checked={twoFactor}
              onChange={(e) => setTwoFactor(e.target.checked)}
            />
          </div>

          {/* Global error */}
          {error && (
            <p style={{ color: colors.error, fontSize: '14px', textAlign: 'center', margin: 0 }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <Button type="submit" fullWidth loading={loading}>
            <AppIcon icon={LogIn} size={16} color={colors.white} />
            Se connecter
          </Button>

          {/* Footer links */}
          <div style={loginStyles.formDivider}>
            <div style={loginStyles.formFooterLinks}>
              <button type="button" style={loginStyles.formFooterLink}>
                <AppIcon icon={Headphones} size={14} color={colors.textSecondary} />
                Support technique
              </button>
              <button type="button" style={loginStyles.formFooterLink}>
                <AppIcon icon={ShieldCheck} size={14} color={colors.textSecondary} />
                Politique sécurité
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Security badges */}
      <SecurityBadges />
    </div>
  );
}
