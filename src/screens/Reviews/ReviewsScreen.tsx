import { Star, Eye, EyeOff, Trash2, Search, Flag, MessageSquare } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }         from '../../components/Common/AppIcon';
import { useReviews }      from '../../hooks/useReviews';
import type { ReviewStatus, ReviewDirection } from '../../models/review.model';

// ── Config ─────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ReviewStatus, { label: string; color: string; bg: string }> = {
  visible: { label: 'Visible',  color: '#00A86B', bg: '#DCFCE7' },
  masqué:  { label: 'Masqué',   color: '#6B7280', bg: '#F3F4F6' },
  signalé: { label: 'Signalé',  color: '#E53935', bg: '#FEE2E2' },
};

const DIR_LABEL: Record<ReviewDirection, string> = {
  passager_vers_conducteur: 'Passager → Conducteur',
  conducteur_vers_passager: 'Conducteur → Passager',
};

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
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export function ReviewsScreen() {
  const { reviews, stats, loading, filters, setFilters, setStatus, remove } = useReviews();

  return (
    <DashboardLayout title="Modération des Évaluations">

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total avis',       value: String(stats.total),    color: '#2563EB', bg: '#DBEAFE', icon: MessageSquare },
          { label: 'Note moyenne',     value: `⭐ ${stats.avgRating}`, color: '#F59E0B', bg: '#FEF3C7', icon: Star         },
          { label: 'Avis signalés',    value: String(stats.signalé),  color: '#E53935', bg: '#FEE2E2', icon: Flag         },
          { label: 'Avis masqués',     value: String(stats.masqué),   color: '#6B7280', bg: '#F3F4F6', icon: EyeOff       },
        ].map((k) => (
          <div key={k.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6' }}>
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

      {/* ── Filters ──────────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', marginBottom: 14, padding: '12px 16px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F3F4F6', borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 200 }}>
          <AppIcon icon={Search} size={14} color="#9CA3AF" />
          <input
            style={{ border: 'none', background: 'transparent', fontSize: 13, outline: 'none', flex: 1, color: '#374151' }}
            placeholder="Rechercher un auteur, une cible ou un commentaire…"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>

        {/* Status */}
        <select
          style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 12, color: '#374151', background: '#fff' }}
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as ReviewStatus | 'all' })}
        >
          <option value="all">Tous les statuts</option>
          <option value="visible">Visible</option>
          <option value="masqué">Masqué</option>
          <option value="signalé">Signalé</option>
        </select>

        {/* Direction */}
        <select
          style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 12, color: '#374151', background: '#fff' }}
          value={filters.direction}
          onChange={(e) => setFilters({ direction: e.target.value as ReviewDirection | 'all' })}
        >
          <option value="all">Toutes les directions</option>
          <option value="passager_vers_conducteur">Passager → Conducteur</option>
          <option value="conducteur_vers_passager">Conducteur → Passager</option>
        </select>

        {/* Rating */}
        <select
          style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 12, color: '#374151', background: '#fff' }}
          value={filters.rating}
          onChange={(e) => setFilters({ rating: e.target.value as 'all' | '1' | '2' | '3' | '4' | '5' })}
        >
          <option value="all">Toutes les notes</option>
          {['1','2','3','4','5'].map((r) => <option key={r} value={r}>{'⭐'.repeat(+r)} ({r} étoile{+r > 1 ? 's' : ''})</option>)}
        </select>
      </div>

      {/* ── Cards ────────────────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Chargement…</div>
      ) : reviews.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Aucun avis pour ces filtres</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reviews.map((r) => {
            const sc = STATUS_CONFIG[r.status];
            const isFlag = r.status === 'signalé';
            return (
              <div
                key={r.id}
                style={{ background: '#fff', borderRadius: 12, outline: `1px solid ${isFlag ? '#FCA5A5' : '#F3F4F6'}`, padding: '14px 16px', borderLeft: `4px solid ${isFlag ? '#E53935' : r.rating >= 4 ? '#00A86B' : r.rating === 3 ? '#F59E0B' : '#E53935'}` }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>

                  {/* Author */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 64, textAlign: 'center' }}>
                    <img src={r.authorAvatar} alt={r.authorName} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', lineHeight: 1.2 }}>{r.authorName}</span>
                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>auteur</span>
                  </div>

                  {/* Arrow + target */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingTop: 8 }}>
                    <span style={{ fontSize: 18, color: '#9CA3AF' }}>→</span>
                    <span style={{ fontSize: 9, color: '#9CA3AF', textAlign: 'center', maxWidth: 80 }}>{DIR_LABEL[r.direction]}</span>
                  </div>

                  {/* Target */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 64, textAlign: 'center' }}>
                    <img src={r.targetAvatar} alt={r.targetName} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', lineHeight: 1.2 }}>{r.targetName}</span>
                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>évalué</span>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <Stars rating={r.rating} />
                      <span style={{ fontSize: 12, color: '#6B7280' }}>{r.tripId}</span>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>{fmtDate(r.createdAt)}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 9999, color: sc.color, background: sc.bg }}>{sc.label}</span>
                      {r.reportCount > 0 && (
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 9999, color: '#E53935', background: '#FEE2E2' }}>
                          🚩 {r.reportCount} signalement{r.reportCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0, fontStyle: r.status === 'masqué' ? 'italic' : 'normal', opacity: r.status === 'masqué' ? 0.5 : 1 }}>
                      "{r.comment}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    {r.status !== 'visible' && (
                      <button type="button" onClick={() => setStatus(r.id, 'visible')} title="Rendre visible" style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #DCFCE7', background: '#F0FDF4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AppIcon icon={Eye} size={14} color="#00A86B" />
                      </button>
                    )}
                    {r.status !== 'masqué' && (
                      <button type="button" onClick={() => setStatus(r.id, 'masqué')} title="Masquer" style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AppIcon icon={EyeOff} size={14} color="#6B7280" />
                      </button>
                    )}
                    <button type="button" onClick={() => remove(r.id)} title="Supprimer définitivement" style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #FEE2E2', background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AppIcon icon={Trash2} size={14} color="#E53935" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
