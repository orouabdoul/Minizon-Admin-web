import type { ReactNode } from 'react';

interface AuthLayoutProps {
  banner: ReactNode;
  form: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ banner, form, footer }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__body">
        <div className="auth-layout__banner">{banner}</div>
        <div className="auth-layout__form">{form}</div>
      </div>
      {footer && <div className="auth-layout__footer">{footer}</div>}
    </div>
  );
}
