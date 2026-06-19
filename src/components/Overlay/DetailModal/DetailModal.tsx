import { useEffect }       from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { X }               from 'lucide-react';
import { AppIcon }         from '../../Common/AppIcon';

// ── Shell ────────────────────────────────────────────────
interface DetailModalProps {
  title:        string;
  onClose:      () => void;
  children:     ReactNode;
  accentColor?: string;
}

export function DetailModal({
  title, onClose, children, accentColor = '#00A86B',
}: DetailModalProps) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <>
      <div className="detail-backdrop" onClick={onClose} />
      <div
        className="detail-panel"
        style={{ '--detail-accent': accentColor } as CSSProperties}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="detail-panel__header">
          <span className="detail-panel__title">{title}</span>
          <button type="button" className="detail-panel__close" onClick={onClose} aria-label="Fermer">
            <AppIcon icon={X} size={16} color="currentColor" />
          </button>
        </div>
        <div className="detail-panel__content">
          {children}
        </div>
      </div>
    </>
  );
}

// ── Section card ─────────────────────────────────────────
export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="detail-section">
      <p className="detail-section__title">{title}</p>
      <div className="detail-section__body">{children}</div>
    </div>
  );
}

// ── Key-value row ────────────────────────────────────────
export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="detail-row">
      <span className="detail-row__label">{label}</span>
      <div className="detail-row__value">{children}</div>
    </div>
  );
}

// ── Progress bar ─────────────────────────────────────────
export function DetailBar({ value, color = '#00A86B' }: { value: number; color?: string }) {
  return (
    <div className="detail-bar-wrap">
      <div className="detail-bar-track">
        <div className="detail-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="detail-bar-label">{value}%</span>
    </div>
  );
}

// ── Timeline ─────────────────────────────────────────────
interface TimelineEvent { label: string; time: string; done?: boolean; }

export function DetailTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="detail-timeline">
      {events.map((ev, i) => (
        <div key={i} className="detail-tl-item">
          <span className={`detail-tl-dot${ev.done === false ? ' detail-tl-dot--pending' : ''}`} />
          <div>
            <p className="detail-tl-label">{ev.label}</p>
            <p className="detail-tl-time">{ev.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
