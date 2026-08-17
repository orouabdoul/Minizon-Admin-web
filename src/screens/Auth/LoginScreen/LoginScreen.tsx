import { LoginForm } from './components/LoginForm';
import { LoginFooter } from './components/LoginFooter';

export function LoginScreen() {
  return (
    <div style={{
      minHeight:      '100dvh',
      display:        'flex',
      flexDirection:  'column',
      background:     'var(--color-bg)',
    }}>
      {/* Formulaire centré */}
      <div style={{
        flex:           1,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '24px 16px',
      }}>
        <LoginForm />
      </div>

      {/* Pied de page discret */}
      <LoginFooter />
    </div>
  );
}
