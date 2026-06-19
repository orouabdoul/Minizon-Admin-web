import { AuthLayout } from '../../../components/Layout/AuthLayout/AuthLayout';
import { LoginBanner } from './components/LoginBanner';
import { LoginForm } from './components/LoginForm';
import { LoginFooter } from './components/LoginFooter';

export function LoginScreen() {
  return (
    <AuthLayout
      banner={<LoginBanner />}
      form={<LoginForm />}
      footer={<LoginFooter />}
    />
  );
}
