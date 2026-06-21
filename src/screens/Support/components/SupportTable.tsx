import { Search, Eye, CheckSquare, MoreVertical, Smartphone, Phone, Mail, MessageCircle, HelpCircle } from 'lucide-react';
import type { LucideIcon }  from 'lucide-react';
import { AppIcon }          from '../../../components/Common/AppIcon';
import { Badge }            from '../../../components/DataDisplay/Badge/Badge';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../../../components/DataDisplay/Table/Table';
import type { BadgeVariant }from '../../../components/DataDisplay/Badge/Badge';
import type { SupportTicket, TicketPriority, TicketStatus, TicketChannel } from '../../../models/support.model';

interface SupportTableProps {
  tickets:       SupportTicket[];
  total:         number;
  pageSize:      number;
  currentPage:   number;
  setCurrentPage:(p: number) => void;
  search:        string;
  setSearch:     (v: string) => void;
  applyFilters:  () => void;
  loading:       boolean;
  fetchError:    string | null;
  loadingId:     string | null;
  onResolve:     (id: string) => void;
}

const PRIORITY_VARIANT: Record<TicketPriority, BadgeVariant> = {
  Haute:   'priority-haute',
  Moyenne: 'priority-moyenne',
  Basse:   'priority-basse',
};

const STATUS_VARIANT: Record<TicketStatus, BadgeVariant> = {
  Nouveau:   'ticket-nouveau',
  'En cours':'ticket-encours',
  Résolu:    'ticket-resolu',
  Clôturé:   'neutral',
};

const CHANNEL_ICON: Record<TicketChannel, LucideIcon> = {
  'App Mobile': Smartphone,
  'Téléphone':  Phone,
  'Email':      Mail,
  'Chat':       MessageCircle,
  'Autre':      HelpCircle,
};

const CHANNEL_COLOR: Record<TicketChannel, string> = {
  'App Mobile': '#3B82F6',
  'Téléphone':  '#22C55E',
  'Email':      '#A855F7',
  'Chat':       '#F4B400',
  'Autre':      '#6B7280',
};

function Pagination({ total, pageSize, currentPage, onChange }: {
  total: number; pageSize: number; currentPage: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = (currentPage - 1) * pageSize + 1;
  const to   = Math.min(currentPage * pageSize, total);
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  for (let p = start; p <= Math.min(totalPages, start + 4); p++) pages.push(p);
  return (
    <div className="support-pagination">
      <span className="support-pagination__info">Affichage de {from} à {to} sur {total.toLocaleString('fr-FR')} tickets</span>
      <div className="support-pagination__pages">
        <button type="button" className="support-pagination__btn" disabled={currentPage === 1} onClick={() => onChange(currentPage - 1)}>Précédent</button>
        {pages.map((p) => (
          <button key={p} type="button" className={`support-pagination__btn${p === currentPage ? ' support-pagination__btn--active' : ''}`} onClick={() => onChange(p)}>{p}</button>
        ))}
        <button type="button" className="support-pagination__btn" disabled={currentPage === totalPages} onClick={() => onChange(currentPage + 1)}>Suivant</button>
      </div>
    </div>
  );
}

export function SupportTable({
  tickets, total, pageSize, currentPage, setCurrentPage,
  search, setSearch, applyFilters,
  loading, fetchError,
  loadingId, onResolve,
}: SupportTableProps) {
  return (
    <div className="support-table-card">

      {/* ── Search bar ── */}
      <div className="support-table-search">
        <div className="support-table-search__input-wrap">
          <AppIcon icon={Search} size={16} color="#9CA3AF" />
          <input
            type="text"
            placeholder="Rechercher un ticket, utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="support-table-search__input"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <Table>
        <TableHead>
          <TableRow>
            <Th width="110px">Ticket ID</Th>
            <Th width="200px">Utilisateur</Th>
            <Th>Sujet</Th>
            <Th width="90px">Priorité</Th>
            <Th width="120px">Canal</Th>
            <Th width="130px">Date</Th>
            <Th width="90px">Statut</Th>
            <Th width="120px">Agent</Th>
            <Th width="80px">Temps</Th>
            <Th width="100px">Actions</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <Td colSpan={10}><div className="data-table__empty">Chargement…</div></Td>
            </TableRow>
          ) : fetchError ? (
            <TableRow>
              <Td colSpan={10}><div className="data-table__empty" style={{ color: '#E53935' }}>{fetchError}</div></Td>
            </TableRow>
          ) : tickets.length === 0 ? (
            <TableRow>
              <Td colSpan={10}><div className="data-table__empty">Aucun ticket trouvé</div></Td>
            </TableRow>
          ) : (
            tickets.map((t) => {
              const busy   = loadingId === t.id;
              const isOpen = t.status === 'Nouveau' || t.status === 'En cours';
              const ChannelIcon = CHANNEL_ICON[t.channel] ?? HelpCircle;
              const channelColor = CHANNEL_COLOR[t.channel] ?? '#6B7280';
              return (
                <TableRow key={t.id}>
                  <Td>
                    <span className="support-ticket-id">{t.ticketId}</span>
                  </Td>
                  <Td>
                    <div className="data-table__user-cell">
                      <img src={t.userAvatar} alt={t.userName} className="data-table__avatar" />
                      <div className="data-table__user-info">
                        <span className="data-table__user-name">{t.userName}</span>
                        <span className="support-user-email">{t.userEmail}</span>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="support-subject-cell">
                      <span className="support-subject-cell__title">{t.subject}</span>
                      <span className="support-subject-cell__desc">{t.description}</span>
                    </div>
                  </Td>
                  <Td><Badge label={t.priority} variant={PRIORITY_VARIANT[t.priority]} /></Td>
                  <Td>
                    <div className="support-channel-cell">
                      <AppIcon icon={ChannelIcon} size={14} color={channelColor} />
                      <span className="support-channel-cell__label">{t.channel}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="trip-datetime">
                      <span className="trip-datetime__date">{t.date}</span>
                      <span className="trip-datetime__time">{t.time}</span>
                    </div>
                  </Td>
                  <Td><Badge label={t.status} variant={STATUS_VARIANT[t.status]} /></Td>
                  <Td>
                    {t.agentName ? (
                      <div className="support-agent-cell">
                        {t.agentAvatar && (
                          <img src={t.agentAvatar} alt={t.agentName} className="support-agent-cell__avatar" />
                        )}
                        <span className="support-agent-cell__name">{t.agentName}</span>
                      </div>
                    ) : (
                      <span className="support-agent-cell__unassigned">Non assigné</span>
                    )}
                  </Td>
                  <Td>
                    <span className="support-time-elapsed">{t.timeElapsed}</span>
                  </Td>
                  <Td>
                    <div className="trip-actions">
                      <button type="button" className="trip-action-btn" title="Voir">
                        <AppIcon icon={Eye} size={14} color="#2563EB" />
                      </button>
                      {isOpen && (
                        <button type="button" className="trip-action-btn" title="Résoudre" disabled={busy} onClick={() => onResolve(t.id)}>
                          <AppIcon icon={CheckSquare} size={14} color={busy ? '#9CA3AF' : '#16A34A'} />
                        </button>
                      )}
                      <button type="button" className="trip-action-btn" title="Plus">
                        <AppIcon icon={MoreVertical} size={14} color="#4B5563" />
                      </button>
                    </div>
                  </Td>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <Pagination total={total} pageSize={pageSize} currentPage={currentPage} onChange={setCurrentPage} />
    </div>
  );
}
