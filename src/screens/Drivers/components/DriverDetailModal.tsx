import { useState, useEffect, useCallback } from 'react';
import {
  Check, X, ZoomIn, ChevronLeft, ChevronRight,
  User, FileText, Car, Shield, CreditCard, ExternalLink, FileWarning,
} from 'lucide-react';
import {
  DetailModal, DetailSection, DetailRow, DetailBar, DetailTimeline,
} from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge }        from '../../../components/DataDisplay/Badge/Badge';
import { AppIcon }      from '../../../components/Common/AppIcon';
import { useAuthImage } from '../../../hooks/useAuthImage';
import type { Driver, DriverStatus, DocumentStatus } from '../../../models/driver.model';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<DriverStatus, BadgeVariant> = {
  'En attente': 'amber', 'Vérifié': 'emerald', 'Rejeté': 'error', 'Suspendu': 'neutral',
};
const DOC_VARIANT: Record<DocumentStatus, BadgeVariant> = {
  ok: 'emerald', pending: 'amber', rejected: 'error',
};
const DOC_LABEL: Record<DocumentStatus, string> = {
  ok: 'Valide', pending: 'En attente', rejected: 'Rejeté',
};
const ELIGIBILITY_ITEMS = [
  { id: 'vehicle_category', label: 'Véhicule de catégorie autorisée (berline, SUV, monospace)' },
  { id: 'vehicle_age',      label: 'Véhicule de moins de 10 ans' },
  { id: 'plate_valid',      label: "Plaque d'immatriculation lisible et valide" },
  { id: 'docs_authentic',   label: 'Documents authentiques (non altérés, non expirés)' },
  { id: 'vehicle_match',    label: 'Carte grise cohérente avec le véhicule déclaré' },
];

const isPdf = (url?: string) => !!url && url.toLowerCase().endsWith('.pdf');

// ── Lightbox ──────────────────────────────────────────────────────────────────

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
      width: 52, height: 38, border: `2px solid ${active ? '#1A5FB4' : 'transparent'}`,
      borderRadius: 6, overflow: 'hidden', padding: 0, cursor: 'pointer', opacity: active ? 1 : 0.5,
      background: '#222',
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
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.94)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}
    >
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

// ── Photo card (image thumbnail) ──────────────────────────────────────────────

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
          <div style={{ width: 26, height: 26, borderRadius: '50%', border: '3px solid #E5E7EB', borderTopColor: '#1A5FB4', animation: 'spin .8s linear infinite' }} />
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
              {url ? (failed ? (errorCode ?? 'Inaccessible') : 'Non disponible') : 'Non fourni'}
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

// ── Document card (image or PDF) ──────────────────────────────────────────────

function DocumentCard({
  url, label, status, icon, loading: externalLoading, onOpen,
}: {
  url?: string; label: string; status: DocumentStatus;
  icon: typeof FileText; loading?: boolean; onOpen?: (url: string) => void;
}) {
  const isFilePdf = isPdf(url);
  // Only fetch with auth if it's NOT a PDF (PDFs open directly via link)
  const { blobUrl, loadingImg, failed, errorCode } = useAuthImage(!isFilePdf ? url : undefined);
  const hasImg = !!blobUrl && !isFilePdf;

  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid #E5E7EB', background: '#F9FAFB' }}>
      <div style={{
        height: 130, background: hasImg ? '#000' : '#F3F4F6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        cursor: hasImg ? 'zoom-in' : 'default',
      }}
        onClick={() => hasImg && url && onOpen?.(url)}
      >
        {(externalLoading && !url) || (loadingImg && !isFilePdf) ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', margin: '0 auto 6px', border: '3px solid #E5E7EB', borderTopColor: '#1A5FB4', animation: 'spin .8s linear infinite' }} />
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>Chargement…</span>
          </div>
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
        ) : isFilePdf ? (
          <div style={{ textAlign: 'center', padding: '0 12px' }}>
            <div style={{ width: 44, height: 44, background: '#FEE2E2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <AppIcon icon={FileText} size={24} color="#E53935" />
            </div>
            <p style={{ fontSize: 11, color: '#374151', fontWeight: 600, marginBottom: 6 }}>Document PDF</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, color: '#1A5FB4', textDecoration: 'none',
                background: '#EFF6FF', padding: '4px 10px', borderRadius: 20,
              }}
            >
              <AppIcon icon={ExternalLink} size={11} color="#1A5FB4" />
              Ouvrir
            </a>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <AppIcon icon={failed ? FileWarning : icon} size={28} color="#D1D5DB" />
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 5 }}>
              {url ? (failed ? (errorCode ?? 'Inaccessible') : 'Non disponible') : 'Non fourni'}
            </p>
          </div>
        )}
      </div>

      <div style={{ padding: '7px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{label}</span>
        <Badge label={DOC_LABEL[status]} variant={DOC_VARIANT[status]} />
      </div>
    </div>
  );
}

// ── Section title helper ──────────────────────────────────────────────────────

function SubTitle({ children }: { children: string }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '14px 0 8px' }}>
      {children}
    </p>
  );
}

// ── Hero avatar ───────────────────────────────────────────────────────────────

function HeroAvatar({ url, name, onClick }: { url?: string; name: string; onClick?: () => void }) {
  const { blobUrl } = useAuthImage(url);
  return (
    <img
      src={blobUrl ?? 'https://placehold.co/64x64'}
      alt={name}
      className="detail-hero__avatar"
      style={{ cursor: onClick ? 'zoom-in' : 'default' }}
      onClick={onClick}
    />
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────

interface Props {
  driver:         Driver;
  detailLoading?: boolean;
  onClose:        () => void;
  onValidate?:    (id: string) => void;
  onReject?:      (id: string) => void;
  loadingId?:     string | null;
}

export function DriverDetailModal({ driver, detailLoading, onClose, onValidate, onReject, loadingId }: Props) {
  const [checked,       setChecked]       = useState<Set<string>>(new Set());
  const [confirmReject, setConfirmReject] = useState(false);
  const [lightbox,      setLightbox]      = useState<{ images: LightboxEntry[]; index: number } | null>(null);

  const toggle = (id: string) =>
    setChecked(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const allChecked = checked.size === ELIGIBILITY_ITEMS.length;
  const isPending  = driver.status === 'En attente';
  const busy       = loadingId === driver.id;

  const allImages: LightboxEntry[] = [
    driver.selfies?.front  && { url: driver.selfies.front,  label: 'Selfie de face' },
    driver.selfies?.left   && { url: driver.selfies.left,   label: 'Selfie gauche' },
    driver.selfies?.right  && { url: driver.selfies.right,  label: 'Selfie droite' },
    driver.idCard?.front   && { url: driver.idCard.front,   label: "Carte d'identité (recto)" },
    driver.idCard?.back    && { url: driver.idCard.back,    label: "Carte d'identité (verso)" },
    driver.documents.permisUrl && !isPdf(driver.documents.permisUrl)
      && { url: driver.documents.permisUrl, label: 'Permis de conduire' },
    driver.documents.tvmDocUrl && !isPdf(driver.documents.tvmDocUrl)
      && { url: driver.documents.tvmDocUrl, label: 'Vignette TVM' },
    driver.documents.technicalControlUrl && !isPdf(driver.documents.technicalControlUrl)
      && { url: driver.documents.technicalControlUrl, label: 'Contrôle technique' },
  ].filter(Boolean) as LightboxEntry[];

  const openLightbox = useCallback((url: string, label: string) => {
    const idx = allImages.findIndex(i => i.url === url);
    if (idx >= 0) setLightbox({ images: allImages, index: idx });
    else setLightbox({ images: [{ url, label }], index: 0 });
  }, [allImages]);

  const timeline = [
    { label: 'Inscription',           time: 'Compte créé',        done: true },
    { label: 'Documents soumis',      time: 'En cours de vérif.', done: driver.status !== 'En attente' },
    { label: 'Vérification complète', time: driver.status === 'Vérifié' ? 'Conducteur validé' : 'En attente', done: driver.status === 'Vérifié' },
  ];

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

      <DetailModal title="Détail Conducteur" onClose={onClose} accentColor="#1A5FB4">

        {/* Hero */}
        <div className="detail-hero" style={{ background: 'rgba(26,95,180,0.06)' }}>
          <HeroAvatar
            url={driver.avatar !== 'https://placehold.co/40x40' ? driver.avatar : undefined}
            name={driver.name}
            onClick={driver.selfies?.front ? () => openLightbox(driver.selfies!.front!, 'Selfie de face') : undefined}
          />
          <div>
            <p className="detail-hero__name">{driver.name}</p>
            <p className="detail-hero__sub">{driver.driverId}</p>
            <div className="detail-hero__badge">
              <Badge label={driver.status} variant={STATUS_VARIANT[driver.status]} />
              {detailLoading && <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 8 }}>Chargement…</span>}
            </div>
          </div>
        </div>

        {/* Photos & Documents KYC */}
        <DetailSection title="Photos & Documents KYC">
          <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>
            Cliquez sur une image pour l'agrandir · ← → pour naviguer
          </p>

          <SubTitle>Selfies KYC (face · gauche · droite)</SubTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <PhotoCard url={driver.selfies?.front} label="De face"  icon={User}       onOpen={url => openLightbox(url, 'Selfie de face')} />
            <PhotoCard url={driver.selfies?.left}  label="Gauche"   icon={User}       onOpen={url => openLightbox(url, 'Selfie gauche')} />
            <PhotoCard url={driver.selfies?.right} label="Droite"   icon={User}       onOpen={url => openLightbox(url, 'Selfie droite')} />
          </div>

          <SubTitle>Carte d'identité / Passeport</SubTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <PhotoCard url={driver.idCard?.front} label="Recto" icon={CreditCard} onOpen={url => openLightbox(url, "Carte d'identité (recto)")} />
            <PhotoCard url={driver.idCard?.back}  label="Verso" icon={CreditCard} onOpen={url => openLightbox(url, "Carte d'identité (verso)")} />
          </div>

          <SubTitle>Documents officiels du véhicule</SubTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <DocumentCard
              url={driver.documents.permisUrl}
              label="Permis de conduire"
              status={driver.documents.permis}
              icon={FileText}
              loading={detailLoading}
              onOpen={url => openLightbox(url, 'Permis de conduire')}
            />
            <DocumentCard
              url={driver.documents.carteGriseUrl}
              label="Carte grise"
              status={driver.documents.carteGrise}
              icon={Car}
              loading={detailLoading}
              onOpen={url => openLightbox(url, 'Carte grise')}
            />
            <DocumentCard
              url={driver.documents.assuranceUrl}
              label="Assurance véhicule"
              status={driver.documents.assurance}
              icon={Shield}
              loading={detailLoading}
              onOpen={url => openLightbox(url, 'Assurance')}
            />
            <DocumentCard
              url={driver.documents.tvmDocUrl}
              label="Vignette TVM"
              status={driver.documents.tvmDoc}
              icon={FileText}
              loading={detailLoading}
              onOpen={url => openLightbox(url, 'Vignette TVM')}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <DocumentCard
              url={driver.documents.technicalControlUrl}
              label="Contrôle technique"
              status={driver.documents.technicalControl}
              icon={Car}
              loading={detailLoading}
              onOpen={url => openLightbox(url, 'Contrôle technique')}
            />
          </div>
        </DetailSection>

        {/* Informations */}
        <DetailSection title="Informations">
          <DetailRow label="Téléphone"><span>{driver.phone}</span></DetailRow>
          <DetailRow label="Email"><span>{driver.email}</span></DetailRow>
          <DetailRow label="Véhicule"><span>{driver.vehicle}</span></DetailRow>
          <DetailRow label="Plaque"><span>{driver.plate}</span></DetailRow>
        </DetailSection>

        {/* Éligibilité */}
        <DetailSection title="Éligibilité Véhicule">
          <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
            Cochez chaque critère après vérification visuelle des documents ci-dessus.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ELIGIBILITY_ITEMS.map(item => {
              const isChecked = checked.has(item.id);
              return (
                <label
                  key={item.id}
                  onClick={() => isPending && toggle(item.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, userSelect: 'none',
                    cursor: isPending ? 'pointer' : 'default', padding: '10px 12px', borderRadius: 8,
                    background: isChecked ? 'rgba(26,95,180,0.06)' : '#F9FAFB',
                    border: `1.5px solid ${isChecked ? '#1A5FB4' : '#E5E7EB'}`, transition: 'all .15s',
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                    border: `2px solid ${isChecked ? '#1A5FB4' : '#D1D5DB'}`,
                    background: isChecked ? '#1A5FB4' : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isChecked && <AppIcon icon={Check} size={11} color="white" />}
                  </div>
                  <span style={{ fontSize: 13, color: isChecked ? '#065F46' : '#374151', lineHeight: 1.4 }}>
                    {item.label}
                  </span>
                </label>
              );
            })}
          </div>
          {isPending && (
            <p style={{ fontSize: 11, color: allChecked ? '#1A5FB4' : '#F59E0B', marginTop: 10 }}>
              {allChecked
                ? '✓ Tous les critères sont confirmés — vous pouvez valider.'
                : `⚠ Confirmez tous les critères (${checked.size}/${ELIGIBILITY_ITEMS.length}) pour valider.`}
            </p>
          )}
        </DetailSection>

        {/* Performance */}
        <DetailSection title="Performance">
          <DetailRow label="Score de validation"><span>{driver.score}%</span></DetailRow>
          <DetailBar value={driver.score} color="#1A5FB4" />
        </DetailSection>

        {/* Timeline */}
        <DetailSection title="Progression">
          <DetailTimeline events={timeline} />
        </DetailSection>

        {/* Actions */}
        {isPending && onValidate && onReject && (
          <div style={{ display: 'flex', gap: 10, marginTop: 8, borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
            {!confirmReject ? (
              <button type="button" disabled={busy} onClick={() => setConfirmReject(true)} style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: '1.5px solid #E53935',
                background: 'white', color: '#E53935', fontWeight: 600, fontSize: 13,
                cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.5 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <AppIcon icon={X} size={14} color="#E53935" />
                Rejeter
              </button>
            ) : (
              <div style={{ flex: 1, background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 8, padding: '10px 12px' }}>
                <p style={{ fontSize: 12, color: '#B91C1C', marginBottom: 8, fontWeight: 600 }}>Confirmer le rejet ?</p>
                <p style={{ fontSize: 11, color: '#6B7280', marginBottom: 10 }}>
                  Le conducteur devra soumettre à nouveau ses documents.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => { onReject(driver.id); onClose(); }} style={{
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
              disabled={busy || !allChecked}
              onClick={() => { onValidate(driver.id); onClose(); }}
              title={!allChecked ? "Confirmez tous les critères d'éligibilité" : 'Valider le conducteur'}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                background: allChecked ? '#1A5FB4' : '#D1FAE5',
                color: allChecked ? 'white' : '#6B7280',
                fontWeight: 600, fontSize: 13,
                cursor: (busy || !allChecked) ? 'not-allowed' : 'pointer', opacity: busy ? 0.5 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'background .2s',
              }}
            >
              <AppIcon icon={Check} size={14} color={allChecked ? 'white' : '#6B7280'} />
              {allChecked ? 'Valider le conducteur' : `Valider (${checked.size}/${ELIGIBILITY_ITEMS.length})`}
            </button>
          </div>
        )}
      </DetailModal>
    </>
  );
}
