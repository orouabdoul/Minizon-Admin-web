import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppIcon } from '../../Common/AppIcon';

export interface ConfirmDialogProps {
  isOpen:        boolean;
  onClose:       () => void;
  onConfirm:     () => void;
  title:         string;
  message:       string;
  confirmLabel?: string;
  variant?:      'danger' | 'warning' | 'success';
  icon?:         LucideIcon;
  loading?:      boolean;
}

const VS = {
  danger:  { iconBg: '#FEF2F2', iconColor: '#DC2626', btnBg: '#DC2626' },
  warning: { iconBg: '#FFFBEB', iconColor: '#F59E0B', btnBg: '#F59E0B' },
  success: { iconBg: '#F0FDF4', iconColor: '#16A34A', btnBg: '#1A5FB4' },
} as const;

export function ConfirmDialog({
  isOpen, onClose, onConfirm,
  title, message,
  confirmLabel = 'Confirmer',
  variant = 'danger',
  icon: Icon = AlertTriangle,
  loading = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const vs = VS[variant];

  return createPortal(
    <>
      <div className="confirm-backdrop" onClick={onClose} />
      <div className="confirm-dialog" role="dialog" aria-modal="true">
        <div className="confirm-dialog__icon" style={{ background: vs.iconBg }}>
          <AppIcon icon={Icon} size={26} color={vs.iconColor} />
        </div>
        <p className="confirm-dialog__title">{title}</p>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="confirm-dialog__btn confirm-dialog__btn--cancel"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="button"
            className="confirm-dialog__btn confirm-dialog__btn--ok"
            style={{ background: vs.btnBg }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'En cours...' : confirmLabel}
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
