import { useState, useEffect, useCallback } from 'react';
import {
  MapPin, Phone, Mail, Star,
  ZoomIn, ChevronLeft, ChevronRight, X, Check,
  User, CreditCard, FileWarning,
} from 'lucide-react';
import { DetailModal, DetailSection, DetailRow, DetailBar } from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge }        from '../../../components/DataDisplay/Badge/Badge';
import { AppIcon }      from '../../../components/Common/AppIcon';
import { useAuthImage } from '../../../hooks/useAuthImage';
import type { Passenger, PassengerStatus, RiskLevel } from '../../../models/passenger.model';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';

const STATUS_VARIANT: Record<PassengerStatus, BadgeVariant> = {
  Actif:    'primary',
  Inactif:  'neutral',
  Suspendu: 'warning',
};
const RISK_VARIANT: Record<RiskLevel, BadgeVariant> = {
  Faible: 'lime',
  Moyen:  'amber',
  Élevé:  'error',
};

// ── Lightbox ───────────────────────────────────────────────────────────────────

interface LightboxEntry { url: string; label: string }

function LightboxImage({ url, alt }: { url: string; alt: string }) {
  const { blobUrl, loadingImg } = useAuthImage(url);
  if (loadingImg) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.2)', borderTopColor: 'white', animation: 'spin .8s linear infinite' }} />
      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Chargement…</span>
    </div>
  );
  if (!blobUrl) return <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Image indisponible</span>;
  return (
    <img src={blobUrl} alt={alt}
      style={{ maxWidth: '80vw', maxHeight: '75vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }} />
  );
}

function LightboxThumb({ url, alt, active, onClick }: { url: string; alt: string; active: boolean; onClick: () => void }) {
  const { blobUrl } = useAuthImage(url);
  return (
    <button type="button" onClick={onClick} style={{
      width: 52, height: 38,
      border: `2px solid ${active ? '#A855F7' : 'transparent'}`,
      borderRadius: 6, overflow: 'hidden', padding: 0,
      cursor: 'pointer', opacity: active ? 1 : 0.5, background: '#222',
    }}>
      {blobUrl && <img src={blobUrl} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
    </button>
  );
}

function Lightbox({ images, index, onClose, onNav }: {
  images: LightboxEntry[]; index: number; onClose: () => void; onNav: (i: number) => void;
}) {
  const prev = useCallback(() => onNav((index - 1 + images.length) % images.length), [index, images.length, onNav]);
  const next = useCallback(() => onNav((index + 1) % images.length), [index, images.length, onNav]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose, prev, next]);

  const img = images[index];
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.94)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <button type="button" onClick={onClose} style={{
        position: 'absolute', top: 16, right: 16,
        background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
        width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <AppIcon icon={X} size={18} color="white" />
      </button>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginBottom: 12, userSelect: 'none' }}>
        {img.label} · {index + 1} / {images.length}
      </p>
      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {images.length > 1 && (
          <button type="button" onClick={e => { e.stopPropagation(); prev(); }} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <AppIcon icon={ChevronLeft} size={20} color="white" />
          </button>
        )}
        <LightboxImage url={img.url} alt={img.label} />
        {images.length > 1 && (
          <button type="button" onClick={e => { e.stopPropagation(); next(); }} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <AppIcon icon={ChevronRight} size={20} color="white" />
          </button>
        )}
      </div>
      {images.length > 1 && (
        <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {images.map((im, i) => (
            <LightboxThumb key={i} url={im.url} alt={im.label} active={i === index} onClick={() => onNav(i)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Photo card ─────────────────────────────────────────────────────────────────

function PhotoCard({
  url, label, icon, onOpen,
}: { url?: string; label: string; icon: typeof User; onOpen?: (url: string) => void }) {
  const { blobUrl, loadingImg, failed, errorCode } = useAuthImage(url);
  const hasImg = !!blobUrl;

  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid #E5E7EB', background: '#F9FAFB' }}>
      <div
        style={{
          height: 130, background: hasImg ? '#000' : '#F3F4F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          cursor: hasImg ? 'zoom-in' : 'default',
        }}
        onClick={() => hasImg && url && onOpen?.(url)}
      >
        {loadingImg ? (
          <div style={{ width: 26, height: 26, borderRadius: '50%', border: '3px solid #E5E7EB', borderTopColor: '#A855F7', animation: 'spin .8s linear infinite' }} />
        ) : hasImg ? (
          <>
            <img src={blobUrl} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0)', transition: 'background .2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.35)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}
            >
              <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AppIcon icon={ZoomIn} size={15} color="#374151" />
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <AppIcon icon={failed ? FileWarning : icon} size={28} color="#D1D5DB" />
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 5 }}>
              {url ? (failed ? (errorCode ?? 'Inaccessible') : 'Chargement…') : 'Non fourni'}
            </p>
          </div>
        )}
      </div>
      <div style={{ padding: '7px 10px' }}>
        <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{label}</span>
      </div>
    </div>
  );
}

// ── Hero avatar ────────────────────────────────────────────────────────────────

function HeroAvatar({ url, name, onClick }: { url?: string; name: string; onClick?: () => void }) {
  const { blobUrl } = useAuthImage(url);
  return (
    <img
      src={blobUrl ?? 'https://placehold.co/64x64'}
      alt={name}
      className="detail-hero__avatar"
      style={{ cursor: onClick ? 'zoom-in' : 'default', borderColor: '#A855F7' }}
      onClick={onClick}
    />
  );
}

function SubTitle({ children }: { children: string }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '14px 0 8px' }}>
      {children}
    </p>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────────

interface Props {
  passenger:       Passenger;
  detailLoading?:  boolean;
  onClose:         () => void;
  onApproveKyc?:   (id: string) => void;
  onRejectKyc?:    (id: string) => void;
  loadingId?:      string | null;
}

export function PassengerDetailModal({ passenger: p, detailLoading, onClose, onApproveKyc, onRejectKyc, loadingId }: Props) {
  const [lightbox,      setLightbox]      = useState<{ images: LightboxEntry[]; index: number } | null>(null);
  const [confirmReject, setConfirmReject] = useState(false);

  const busy       = loadingId === p.id;
  const isPending  = p.verification === 'En attente';

  const allImages: LightboxEntry[] = [
    p.selfies?.front && { url: p.selfies.front, label: 'Selfie de face' },
    p.selfies?.left  && { url: p.selfies.left,  label: 'Selfie gauche' },
    p.selfies?.right && { url: p.selfies.right, label: 'Selfie droite' },
    p.idCard?.front  && { url: p.idCard.front,  label: "Carte d'identité (recto)" },
    p.idCard?.back   && { url: p.idCard.back,   label: "Carte d'identité (verso)" },
  ].filter(Boolean) as LightboxEntry[];

  const openLightbox = useCallback((url: string, label: string) => {
    const idx = allImages.findIndex(i => i.url === url);
    setLightbox({ images: allImages.length > 0 ? allImages : [{ url, label }], index: idx >= 0 ? idx : 0 });
  }, [allImages]);

  const hasKyc = !!(p.selfies?.front || p.idCard?.front || p.idCard?.back);

  const avatarUrl = p.avatar && p.avatar !== 'https://placehold.co/40x40' ? p.avatar : p.selfies?.front;

  return (
    <>
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNav={i => setLightbox(lb => lb ? { ...lb, index: i } : null)}
        />
      )}

      <DetailModal title="Détail Passager" onClose={onClose} accentColor="#A855F7">

        {/* Hero */}
        <div className="detail-hero" style={{ background: 'rgba(168,85,247,0.06)' }}>
          <HeroAvatar
            url={avatarUrl}
            name={p.name}
            onClick={p.selfies?.front ? () => openLightbox(p.selfies!.front!, 'Selfie de face') : undefined}
          />
          <div>
            <p className="detail-hero__name">{p.name}</p>
            <p className="detail-hero__sub">{p.passengerId}</p>
            <div className="detail-hero__badge" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Badge label={p.status} variant={STATUS_VARIANT[p.status]} />
              {p.verification && (
                <Badge
                  label={p.verification}
                  variant={p.verification === 'Vérifié' ? 'emerald' : p.verification === 'En attente' ? 'amber' : 'error'}
                />
              )}
              {detailLoading && <span style={{ fontSize: 11, color: '#9CA3AF' }}>Chargement photos…</span>}
            </div>
          </div>
        </div>

        {/* Photos KYC */}
        <DetailSection title="Photos & Documents KYC">
          {hasKyc && (
            <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>
              Cliquez sur une image pour l'agrandir · ← → pour naviguer
            </p>
          )}

          <SubTitle>Selfies KYC (face · gauche · droite)</SubTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <PhotoCard url={p.selfies?.front} label="De face" icon={User} onOpen={url => openLightbox(url, 'Selfie de face')} />
            <PhotoCard url={p.selfies?.left}  label="Gauche"  icon={User} onOpen={url => openLightbox(url, 'Selfie gauche')} />
            <PhotoCard url={p.selfies?.right} label="Droite"  icon={User} onOpen={url => openLightbox(url, 'Selfie droite')} />
          </div>

          <SubTitle>Carte d'identité / Passeport</SubTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <PhotoCard url={p.idCard?.front} label="Recto" icon={CreditCard} onOpen={url => openLightbox(url, "Carte d'identité (recto)")} />
            <PhotoCard url={p.idCard?.back}  label="Verso" icon={CreditCard} onOpen={url => openLightbox(url, "Carte d'identité (verso)")} />
          </div>

          {!hasKyc && !detailLoading && (
            <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: '12px 0' }}>
              Aucun document KYC soumis
            </p>
          )}
        </DetailSection>

        {/* Contact & Localisation */}
        <DetailSection title="Contact &amp; Localisation">
          <DetailRow label="Téléphone">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AppIcon icon={Phone} size={13} color="#A855F7" />{p.phone}
            </span>
          </DetailRow>
          <DetailRow label="Email">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AppIcon icon={Mail} size={13} color="#A855F7" />{p.email}
            </span>
          </DetailRow>
          <DetailRow label="Ville">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AppIcon icon={MapPin} size={13} color="#A855F7" />{p.city}
            </span>
          </DetailRow>
          <DetailRow label="Inscription"><span>{p.createdAt}</span></DetailRow>
        </DetailSection>

        {/* Statistiques */}
        <DetailSection title="Statistiques">
          <div className="detail-stats">
            <div className="detail-stat">
              <span className="detail-stat__value">{p.reservations}</span>
              <span className="detail-stat__label">Réservations</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat__value">{p.spending}</span>
              <span className="detail-stat__label">Dépenses</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat__value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <AppIcon icon={Star} size={14} color="#F4B400" />{p.rating}
              </span>
              <span className="detail-stat__label">Note</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat__value">{p.trustScore}%</span>
              <span className="detail-stat__label">Confiance</span>
            </div>
          </div>
          <DetailRow label="Score de confiance"><span /></DetailRow>
          <DetailBar value={p.trustScore} color="#A855F7" />
        </DetailSection>

        {/* Statut */}
        <DetailSection title="Statut &amp; Risque">
          <DetailRow label="Statut">
            <Badge label={p.status} variant={STATUS_VARIANT[p.status]} />
          </DetailRow>
          <DetailRow label="Niveau de risque">
            <Badge label={p.riskLevel} variant={RISK_VARIANT[p.riskLevel]} />
          </DetailRow>
          <DetailRow label="Activité récente"><span>{p.lastActivity}</span></DetailRow>
          <DetailRow label="Présence">
            <Badge label={p.activityStatus} variant={p.activityStatus === 'En ligne' ? 'primary' : 'neutral'} />
          </DetailRow>
        </DetailSection>

        {/* Actions KYC */}
        {isPending && onApproveKyc && onRejectKyc && (
          <div style={{ display: 'flex', gap: 10, marginTop: 8, borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
            {!confirmReject ? (
              <button type="button" disabled={busy} onClick={() => setConfirmReject(true)} style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: '1.5px solid #E53935',
                background: 'white', color: '#E53935', fontWeight: 600, fontSize: 13,
                cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.5 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <AppIcon icon={X} size={14} color="#E53935" />
                Rejeter KYC
              </button>
            ) : (
              <div style={{ flex: 1, background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 8, padding: '10px 12px' }}>
                <p style={{ fontSize: 12, color: '#B91C1C', marginBottom: 8, fontWeight: 600 }}>Confirmer le rejet du KYC ?</p>
                <p style={{ fontSize: 11, color: '#6B7280', marginBottom: 10 }}>
                  Le passager devra soumettre à nouveau ses documents.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => { onRejectKyc(p.id); onClose(); }} style={{
                    flex: 1, padding: '7px 0', borderRadius: 6, background: '#E53935',
                    color: 'white', border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                  }}>Oui, rejeter</button>
                  <button type="button" onClick={() => setConfirmReject(false)} style={{
                    flex: 1, padding: '7px 0', borderRadius: 6, background: 'white',
                    color: '#374151', border: '1px solid #D1D5DB', fontSize: 12, cursor: 'pointer',
                  }}>Annuler</button>
                </div>
              </div>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={() => { onApproveKyc(p.id); onClose(); }}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                background: '#A855F7', color: 'white',
                fontWeight: 600, fontSize: 13,
                cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.5 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <AppIcon icon={Check} size={14} color="white" />
              Approuver KYC
            </button>
          </div>
        )}

        {p.verification === 'Vérifié' && (
          <div style={{
            textAlign: 'center', padding: '12px 0',
            display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
            borderTop: '1px solid #F3F4F6', marginTop: 8,
          }}>
            <AppIcon icon={Check} size={16} color="#A855F7" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#A855F7' }}>KYC vérifié</span>
          </div>
        )}
      </DetailModal>
    </>
  );
}
