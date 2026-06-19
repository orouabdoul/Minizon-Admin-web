import { Star, Paperclip } from 'lucide-react';
import { AppIcon }          from '../../../components/Common/AppIcon';
import { Badge }            from '../../../components/DataDisplay/Badge/Badge';
import type { BadgeVariant }from '../../../components/DataDisplay/Badge/Badge';
import type { Dispute, DisputePriority, DisputeParty, DisputeInvestigationEvent } from '../../../models/dispute.model';

interface Props {
  dispute:       Dispute | null;
  loadingId:     string | null;
  onRefund:      (id: string) => void;
  onPay:         (id: string) => void;
}

const PRIORITY_VARIANT: Record<DisputePriority, BadgeVariant> = {
  Critique: 'error',
  Élevée:   'pending',
  Moyenne:  'amber',
  Faible:   'neutral',
};

function StarRating({ value }: { value: number }) {
  return (
    <div className="dispute-star-rating">
      {Array.from({ length: 5 }, (_, i) => (
        <AppIcon key={i} icon={Star} size={12}
          color={i < Math.round(value) ? '#F4B400' : '#E5E7EB'}
          strokeWidth={i < Math.round(value) ? 0 : 1.5}
        />
      ))}
      <span className="dispute-star-value">{value}</span>
    </div>
  );
}

function PartyCard({ party }: { party: DisputeParty }) {
  return (
    <div className="dispute-party-card">
      <img src={party.avatar} alt={party.name} className="dispute-party-card__avatar" />
      <div className="dispute-party-card__body">
        <span className="dispute-party-card__name">{party.name}</span>
        <span className="dispute-party-card__role">{party.role}</span>
        <StarRating value={party.rating} />
        <span className="dispute-party-card__trips">{party.tripCount} trajets</span>
      </div>
    </div>
  );
}

function Timeline({ events }: { events: DisputeInvestigationEvent[] }) {
  return (
    <div className="dispute-tl">
      {events.map((ev, i) => (
        <div key={i} className="dispute-tl__item">
          <div className="dispute-tl__track">
            <span className={`dispute-tl__dot${ev.done ? ' dispute-tl__dot--done' : ' dispute-tl__dot--pending'}`} />
            {i < events.length - 1 && <span className="dispute-tl__line" />}
          </div>
          <div className="dispute-tl__body">
            <div className="dispute-tl__meta">
              <span className="dispute-tl__label">{ev.label}</span>
              <span className="dispute-tl__time">{ev.time}</span>
            </div>
            {ev.quote && <blockquote className="dispute-tl__quote">{ev.quote}</blockquote>}
            {ev.note  && <p className="dispute-tl__note">{ev.note}</p>}
            {ev.hasAttachments && (
              <span className="dispute-tl__attach">
                <AppIcon icon={Paperclip} size={12} color="#6B7280" />
                {ev.attachmentCount} pièce(s) jointe(s)
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DisputeDetailPanel({ dispute, loadingId, onRefund, onPay }: Props) {
  if (!dispute) {
    return (
      <div className="dispute-detail-panel dispute-detail-panel--empty">
        <p className="dispute-detail-panel__placeholder">Sélectionnez un litige pour voir les détails</p>
      </div>
    );
  }

  const busy = loadingId === dispute.id;

  return (
    <div className="dispute-detail-panel">

      {/* ── Header ── */}
      <div className="dispute-detail-panel__header">
        <div className="dispute-detail-panel__header-top">
          <div>
            <p className="dispute-detail-panel__id">{dispute.disputeId}</p>
            <p className="dispute-detail-panel__ago">{dispute.createdAgo}</p>
          </div>
          <Badge label={dispute.priority} variant={PRIORITY_VARIANT[dispute.priority]} />
        </div>
        <p className="dispute-detail-panel__motif">{dispute.motif}</p>
      </div>

      <div className="dispute-detail-panel__divider" />

      {/* ── Case info ── */}
      <div className="dispute-detail-panel__section">
        <p className="dispute-detail-panel__section-title">Informations du cas</p>
        <div className="dispute-detail-panel__info-grid">
          <div className="dispute-detail-panel__info-row">
            <span className="dispute-detail-panel__info-label">Type</span>
            <span className="dispute-detail-panel__info-value">{dispute.type}</span>
          </div>
          <div className="dispute-detail-panel__info-row">
            <span className="dispute-detail-panel__info-label">Trajet</span>
            <span className="dispute-detail-panel__info-value">{dispute.trajet}</span>
          </div>
          <div className="dispute-detail-panel__info-row">
            <span className="dispute-detail-panel__info-label">Réservation</span>
            <span className="dispute-detail-panel__info-value">{dispute.reservationId}</span>
          </div>
          <div className="dispute-detail-panel__info-row">
            <span className="dispute-detail-panel__info-label">Montant bloqué</span>
            <span className="dispute-detail-panel__info-value dispute-detail-panel__info-value--amount">{dispute.amount}</span>
          </div>
        </div>
      </div>

      <div className="dispute-detail-panel__divider" />

      {/* ── Parties ── */}
      <div className="dispute-detail-panel__section">
        <p className="dispute-detail-panel__section-title">Parties impliquées</p>
        <div className="dispute-detail-panel__parties">
          <PartyCard party={dispute.conductor} />
          <PartyCard party={dispute.passenger} />
        </div>
      </div>

      <div className="dispute-detail-panel__divider" />

      {/* ── Investigation timeline ── */}
      <div className="dispute-detail-panel__section">
        <p className="dispute-detail-panel__section-title">Chronologie de l'enquête</p>
        <Timeline events={dispute.investigationEvents} />
      </div>

      <div className="dispute-detail-panel__divider" />

      {/* ── Footer actions ── */}
      <div className="dispute-detail-panel__footer">
        <button
          type="button"
          className="dispute-action-btn dispute-action-btn--refund"
          disabled={busy}
          onClick={() => onRefund(dispute.id)}
        >
          Rembourser Passager
        </button>
        <button
          type="button"
          className="dispute-action-btn dispute-action-btn--pay"
          disabled={busy}
          onClick={() => onPay(dispute.id)}
        >
          Payer Conducteur
        </button>
      </div>

    </div>
  );
}
