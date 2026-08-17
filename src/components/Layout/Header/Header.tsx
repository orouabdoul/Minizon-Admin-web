import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import { AppIcon }     from '../../Common/AppIcon';
import { ProfilePanel } from './ProfilePanel';
import { notificationService } from '../../../services/notification_service';
import { NAV_ITEMS }   from '../../../config/constants';
import { ROUTES }      from '../../../navigation/routes';

interface HeaderProps {
  title:        string;
  onMenuToggle: () => void;
}

export function Header({ title, onMenuToggle }: HeaderProps) {
  const navigate = useNavigate();

  // ── Unread badge ───────────────────────────────────────────────────────────
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    notificationService.getMetrics()
      .then((res) => {
        const raw = res.data as any;
        setUnread(raw.body?.unread ?? raw.unread ?? 0);
      })
      .catch(() => {});
  }, []);

  // ── Search ─────────────────────────────────────────────────────────────────
  const [query,       setQuery]       = useState('');
  const [dropOpen,    setDropOpen]    = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length >= 1
    ? NAV_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 7)
    : [];

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setDropOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectResult = (path: string) => {
    navigate(path);
    setQuery('');
    setDropOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropOpen || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[activeIndex] ?? results[0];
      if (target) selectResult(target.path);
    } else if (e.key === 'Escape') {
      setDropOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <header className="dash-header">
      <div className="dash-header__left">
        <button
          className="dash-header__hamburger"
          type="button"
          aria-label="Ouvrir le menu"
          onClick={onMenuToggle}
        >
          <AppIcon icon={Menu} size={22} color="#374151" />
        </button>

        <h1 className="dash-header__title">{title}</h1>

        {/* Search with dropdown */}
        <div ref={searchWrapRef} className="dash-header__search" style={{ position: 'relative' }}>
          <AppIcon icon={Search} size={16} color="#9CA3AF" />
          <input
            className="dash-header__search-input"
            type="text"
            placeholder="Rechercher une page…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setDropOpen(true); setActiveIndex(-1); }}
            onFocus={() => { if (query.trim()) setDropOpen(true); }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />

          {dropOpen && query.trim().length >= 1 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
              background: '#fff', borderRadius: 10,
              border: '1px solid #E5E7EB',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              zIndex: 9999, overflow: 'hidden',
            }}>
              {results.length === 0 ? (
                <div style={{ padding: '12px 14px', fontSize: 13, color: '#9CA3AF' }}>
                  Aucun résultat pour «&nbsp;{query}&nbsp;»
                </div>
              ) : results.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={() => selectResult(item.path)}
                  onMouseEnter={() => setActiveIndex(i)}
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: 'none', textAlign: 'left', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, color: '#111827',
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: i === activeIndex ? '#EFF6FF' : '#fff',
                    transition: 'background 0.1s',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: i === activeIndex ? '#1A5FB4' : '#D1D5DB', flexShrink: 0 }} />
                  {item.label}
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9CA3AF', fontWeight: 400 }}>
                    {item.path}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dash-header__right">
        <button
          className="dash-header__notif"
          type="button"
          aria-label="Notifications"
          onClick={() => navigate(ROUTES.NOTIFICATIONS)}
        >
          <AppIcon icon={Bell} size={20} color="#4B5563" />
          {unread > 0 && (
            <span className="dash-header__notif-badge">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </button>

        <ProfilePanel />
      </div>
    </header>
  );
}
