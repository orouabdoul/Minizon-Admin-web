import { useState, useMemo } from 'react';
import {
  Star, Eye, EyeOff, Trash2, Search, Flag, MessageSquare,
  WifiOff, RefreshCw, List, Users, ChevronDown, ChevronUp,
} from 'lucide-react';
import { DashboardLayout }  from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }          from '../../components/Common/AppIcon';
import { ConfirmDialog }    from '../../components/Overlay/ConfirmDialog/ConfirmDialog';
import { useReviews }       from '../../hooks/useReviews';
import type { Review, ReviewStatus, ReviewDirection } from '../../models/review.model';

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ReviewStatus, { label: string; color: string; bg: string }> = {
  visible: { label: 'Visible', color: '#7C3AED', bg: '#EDE9FE' },
  masqué:  { label: 'Masqué',  color: '#6B7280', bg: '#F3F4F6' },
  signalé: { label: 'Signalé', color: '#E53935', bg: '#FEE2E2' },
};

const DIR_LABEL: Record<ReviewDirection, string> = {
  passager_vers_conducteur: 'Passager → Conducteur',
  conducteur_vers_passager: 'Conducteur → Passager',
};

// ── Driver group helpers ──────────────────────────────────────────────────────

interface DriverGroup {
  name:     string;
  avatar:   string;
  received: Review[];   // passager → conducteur (reviews ABOUT the driver)
  given:    Review[];   // conducteur → passager (reviews BY the driver)
}

function getDriverKey(r: Review): { name: string; avatar: string } {
  return r.direction === 'passager_vers_conducteur'
    ? { name: r.targetName, avatar: r.targetAvatar }
    : { name: r.authorName, avatar: r.authorAvatar };
}

function buildGroups(reviews: Review[]): DriverGroup[] {
  const map = new Map<string, DriverGroup>();
  for (const r of reviews) {
    const { name, avatar } = getDriverKey(r);
    if (!map.has(name)) map.set(name, { name, avatar, received: [], given: [] });
    const g = map.get(name)!;
    if (r.direction === 'passager_vers_conducteur') g.received.push(r);
    else g.given.push(r);
  }
  // Sort: most flagged first, then by name
  return Array.from(map.values()).sort((a, b) => {
    const flagA = [...a.received, ...a.given].filter((r) => r.status === 'signalé').length;
    const flagB = [...b.received, ...b.given].filter((r) => r.status === 'signalé').length;
    if (flagB !== flagA) return flagB - flagA;
    return a.name.localeCompare(b.name);
  });
}

function groupAvgRating(reviews: Review[]): string {
  if (!reviews.length) return '—';
  return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <AppIcon key={i} icon={Star} size={size} color={i <= rating ? '#F59E0B' : '#E5E7EB'} />
      ))}
    </span>
  );
}

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}

function MockBanner({ message, onRefresh }: { message: string; onRefresh: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', marginBottom: 14, background: '#FEF9C3', border: '1px solid #FDE68A', borderRadius: 9, fontSize: 12, color: '#92400E' }}>
      <AppIcon icon={WifiOff} size={14} color="#D97706" />
      <span style={{ flex: 1 }}><strong>Mode démo</strong> — {message}</span>
      <button type="button" onClick={onRefresh} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#92400E', fontSize: 12, fontWeight: 600 }}>
        <AppIcon icon={RefreshCw} size={12} color="#D97706" /> Réessayer
      </button>
    </div>
  );
}

// ── ReviewCard (shared between flat list and grouped view) ────────────────────

function ReviewCard({
  r, onSetStatus, onDelete, compact = false,
}: {
  r: Review;
  onSetStatus: (id: string, s: ReviewStatus) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}) {
  const sc = STATUS_CONFIG[r.status];
  const isFlag   = r.status === 'signalé';
  const accColor = isFlag ? '#E53935' : r.rating >= 4 ? '#7C3AED' : r.rating === 3 ? '#F59E0B' : '#E53935';

  return (
    <div style={{
      background: '#fff', borderRadius: 10,
      outline: `1px solid ${isFlag ? '#FCA5A5' : '#F3F4F6'}`,
      padding: compact ? '10px 14px' : '14px 16px',
      borderLeft: `4px solid ${accColor}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>

        {/* Author */}
        {!compact && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 60, textAlign: 'center' }}>
            <img src={r.authorName === getDriverKey(r).name ? r.targetAvatar : r.authorAvatar}
                 alt={r.authorName} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#374151', lineHeight: 1.2 }}>{r.authorName}</span>
            <span style={{ fontSize: 9, color: '#9CA3AF' }}>auteur</span>
          </div>
        )}

        {!compact && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingTop: 6 }}>
            <span style={{ fontSize: 16, color: '#9CA3AF' }}>→</span>
            <span style={{ fontSize: 9, color: '#9CA3AF', textAlign: 'center', maxWidth: 72 }}>{DIR_LABEL[r.direction]}</span>
          </div>
        )}

        {/* Target */}
        {!compact && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 60, textAlign: 'center' }}>
            <img src={r.targetAvatar} alt={r.targetName} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#374151', lineHeight: 1.2 }}>{r.targetName}</span>
            <span style={{ fontSize: 9, color: '#9CA3AF' }}>évalué</span>
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
            {compact && (
              <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>
                {r.direction === 'passager_vers_conducteur' ? `${r.authorName} →` : `→ ${r.targetName}`}
              </span>
            )}
            <Stars rating={r.rating} size={12} />
            <span style={{ fontSize: 11, color: '#6B7280' }}>{r.tripId}</span>
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>{fmtDate(r.createdAt)}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 9999, color: sc.color, background: sc.bg }}>{sc.label}</span>
            {(r.reportCount ?? 0) > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 9999, color: '#E53935', background: '#FEE2E2' }}>
                🚩 {r.reportCount}
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.55, margin: 0, fontStyle: r.status === 'masqué' ? 'italic' : 'normal', opacity: r.status === 'masqué' ? 0.55 : 1 }}>
            "{r.comment}"
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
          {r.status !== 'visible' && (
            <button type="button" onClick={() => onSetStatus(r.id, 'visible')} title="Rendre visible"
              style={{ width: 30, height: 30, borderRadius: 7, border: '1.5px solid #DCFCE7', background: '#F0FDF4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AppIcon icon={Eye} size={13} color="#7C3AED" />
            </button>
          )}
          {r.status !== 'masqué' && (
            <button type="button" onClick={() => onSetStatus(r.id, 'masqué')} title="Masquer"
              style={{ width: 30, height: 30, borderRadius: 7, border: '1.5px solid #E5E7EB', background: '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AppIcon icon={EyeOff} size={13} color="#6B7280" />
            </button>
          )}
          <button type="button" onClick={() => onDelete(r.id)} title="Supprimer"
            style={{ width: 30, height: 30, borderRadius: 7, border: '1.5px solid #FEE2E2', background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AppIcon icon={Trash2} size={13} color="#E53935" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Driver group card ─────────────────────────────────────────────────────────

function DriverGroupCard({
  group, onSetStatus, onDelete,
}: {
  group: DriverGroup;
  onSetStatus: (id: string, s: ReviewStatus) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);

  const allReviews   = [...group.received, ...group.given];
  const flaggedCount = allReviews.filter((r) => r.status === 'signalé').length;
  const avg          = groupAvgRating(group.received);
  const hasFlag      = flaggedCount > 0;

  return (
    <div style={{ background: '#fff', borderRadius: 14, outline: `1.5px solid ${hasFlag ? '#FCA5A5' : '#F3F4F6'}`, overflow: 'hidden' }}>

      {/* Group header */}
      <div
        onClick={() => setOpen((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: 'pointer', background: hasFlag ? '#FFF5F5' : '#FAFAFA', borderBottom: open ? `1px solid ${hasFlag ? '#FEE2E2' : '#F3F4F6'}` : 'none' }}
      >
        {/* Avatar */}
        <img src={group.avatar} alt={group.name}
          style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${hasFlag ? '#FCA5A5' : '#E5E7EB'}` }} />

        {/* Name + stats */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{group.name}</span>
            {hasFlag && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 9999, color: '#E53935', background: '#FEE2E2' }}>
                🚩 {flaggedCount} signalé{flaggedCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              <Stars rating={parseFloat(avg) || 0} size={11} /> {avg !== '—' ? `${avg}/5` : '—'}
            </span>
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              {group.received.length} avis reçu{group.received.length > 1 ? 's' : ''}
            </span>
            {group.given.length > 0 && (
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                · {group.given.length} donné{group.given.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <AppIcon icon={open ? ChevronUp : ChevronDown} size={18} color="#9CA3AF" />
      </div>

      {/* Review list */}
      {open && (
        <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>

          {group.received.length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.4, margin: '2px 0 4px' }}>
                Avis reçus ({group.received.length})
              </p>
              {group.received.map((r) => (
                <ReviewCard key={r.id} r={r} onSetStatus={onSetStatus} onDelete={onDelete} compact />
              ))}
            </>
          )}

          {group.given.length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.4, margin: '8px 0 4px' }}>
                Avis donnés ({group.given.length})
              </p>
              {group.given.map((r) => (
                <ReviewCard key={r.id} r={r} onSetStatus={onSetStatus} onDelete={onDelete} compact />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function ReviewsScreen() {
  const { reviews, stats, loading, error, usingMock, filters, setFilters, setStatus, remove, refresh } = useReviews();

  const [groupByDriver, setGroupByDriver] = useState(false);
  const [deleteTarget,  setDeleteTarget]  = useState<string | null>(null);

  const driverGroups = useMemo(
    () => groupByDriver ? buildGroups(reviews) : [],
    [reviews, groupByDriver],
  );

  const handleDeleteConfirm = () => {
    if (deleteTarget) { remove(deleteTarget); setDeleteTarget(null); }
  };

  return (
    <DashboardLayout title="Modération des Évaluations">

      {usingMock && error && <MockBanner message={error} onRefresh={refresh} />}

      {/* ── Stats ─────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total avis',    value: String(stats.total),    color: '#2563EB', bg: '#DBEAFE', icon: MessageSquare },
          { label: 'Note moyenne',  value: `⭐ ${stats.avgRating}`, color: '#F59E0B', bg: '#FEF3C7', icon: Star         },
          { label: 'Avis signalés', value: String(stats.signalé),  color: '#E53935', bg: '#FEE2E2', icon: Flag         },
          { label: 'Avis masqués',  value: String(stats.masqué),   color: '#6B7280', bg: '#F3F4F6', icon: EyeOff       },
        ].map((k) => (
          <div key={k.label} style={{ flex: 1, minWidth: 150, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AppIcon icon={k.icon} size={16} color={k.color} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: k.color, lineHeight: 1.1 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters + view toggle ─────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', marginBottom: 14, padding: '12px 16px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F3F4F6', borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 180 }}>
          <AppIcon icon={Search} size={14} color="#9CA3AF" />
          <input
            style={{ border: 'none', background: 'transparent', fontSize: 13, outline: 'none', flex: 1, color: '#374151' }}
            placeholder="Rechercher auteur, cible ou commentaire…"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>

        {/* Status */}
        <select style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 12, color: '#374151', background: '#fff' }}
          value={filters.status} onChange={(e) => setFilters({ status: e.target.value as ReviewStatus | 'all' })}>
          <option value="all">Tous les statuts</option>
          <option value="visible">Visible</option>
          <option value="masqué">Masqué</option>
          <option value="signalé">Signalé</option>
        </select>

        {/* Direction */}
        <select style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 12, color: '#374151', background: '#fff' }}
          value={filters.direction} onChange={(e) => setFilters({ direction: e.target.value as ReviewDirection | 'all' })}>
          <option value="all">Toutes les directions</option>
          <option value="passager_vers_conducteur">Passager → Conducteur</option>
          <option value="conducteur_vers_passager">Conducteur → Passager</option>
        </select>

        {/* Rating */}
        <select style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 12, color: '#374151', background: '#fff' }}
          value={filters.rating} onChange={(e) => setFilters({ rating: e.target.value as 'all' | '1' | '2' | '3' | '4' | '5' })}>
          <option value="all">Toutes les notes</option>
          {['1','2','3','4','5'].map((r) => (
            <option key={r} value={r}>{'⭐'.repeat(+r)} ({r} étoile{+r > 1 ? 's' : ''})</option>
          ))}
        </select>

        {/* View toggle */}
        <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 9, padding: 3, gap: 2, marginLeft: 'auto' }}>
          {[
            { id: false, icon: List,  label: 'Liste'     },
            { id: true,  icon: Users, label: 'Conducteurs' },
          ].map(({ id, icon, label }) => (
            <button
              key={String(id)}
              type="button"
              onClick={() => setGroupByDriver(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 10px', borderRadius: 7, border: 'none',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: groupByDriver === id ? '#fff'    : 'transparent',
                color:      groupByDriver === id ? '#2563EB' : '#6B7280',
                boxShadow:  groupByDriver === id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all .15s',
              }}
            >
              <AppIcon icon={icon} size={13} color={groupByDriver === id ? '#2563EB' : '#6B7280'} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Chargement…</div>
      ) : reviews.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Aucun avis pour ces filtres</div>
      ) : groupByDriver ? (

        /* ── Grouped by driver ─────────────────────────────────────────────── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 4px' }}>
            {driverGroups.length} conducteur{driverGroups.length > 1 ? 's' : ''} · {reviews.length} avis
          </p>
          {driverGroups.map((g) => (
            <DriverGroupCard
              key={g.name}
              group={g}
              onSetStatus={setStatus}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>

      ) : (

        /* ── Flat list ─────────────────────────────────────────────────────── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reviews.map((r) => (
            <ReviewCard key={r.id} r={r} onSetStatus={setStatus} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer cet avis ?"
        message="Cette action est irréversible. L'avis sera définitivement supprimé de la plateforme."
        confirmLabel="Supprimer"
        variant="danger"
        icon={Trash2}
      />

    </DashboardLayout>
  );
}
