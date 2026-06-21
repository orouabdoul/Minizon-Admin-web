import { useState, useEffect, useCallback } from 'react';
import {
  Truck, X, ZoomIn, ChevronLeft, ChevronRight,
  Phone, Hash, FileText, Car, Shield,
  Star, Navigation, ShieldOff, CheckCircle, ImageOff,
} from 'lucide-react';
import { DetailModal, DetailSection, DetailRow } from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge }   from '../../../components/DataDisplay/Badge/Badge';
import { AppIcon } from '../../../components/Common/AppIcon';
import type { Vehicle, VehicleStatus, VehicleDocStatus } from '../../../models/vehicle.model';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';

// ── Constants ──────────────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<VehicleStatus, BadgeVariant> = {
  'Actif':         'emerald',
  'En inspection': 'amber',
  'Suspendu':      'neutral',
  'Rejeté':        'error',
};
const DOC_VARIANT: Record<VehicleDocStatus, BadgeVariant> = {
  ok: 'emerald', pending: 'amber', rejected: 'error',
};
const DOC_LABEL: Record<VehicleDocStatus, string> = {
  ok: 'Valide', pending: 'En attente', rejected: 'Rejeté',
};

// ── Lightbox ───────────────────────────────────────────────────────────────────

interface LightboxEntry { url: string; label: string }

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
        <img
          src={img.url}
          alt={img.label}
          style={{ maxWidth: '80vw', maxHeight: '75vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
        />
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
            <button
              key={i}
              type="button"
              onClick={() => onNav(i)}
              style={{
                width: 52, height: 38,
                border: `2px solid ${i === index ? '#7C3AED' : 'transparent'}`,
                borderRadius: 6, overflow: 'hidden', padding: 0,
                cursor: 'pointer', opacity: i === index ? 1 : 0.5, background: '#222',
              }}
            >
              <img src={im.url} alt={im.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Vehicle photo card ─────────────────────────────────────────────────────────

function VehiclePhotoCard({ url, onOpen }: { url?: string; onOpen?: (url: string) => void }) {
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid #E5E7EB', background: '#F9FAFB' }}>
      <div
        style={{
          height: 150, background: url ? '#000' : '#F3F4F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          cursor: url ? 'zoom-in' : 'default',
        }}
        onClick={() => url && onOpen?.(url)}
      >
        {url ? (
          <>
            <img src={url} alt="Photo du véhicule" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            <AppIcon icon={ImageOff} size={28} color="#D1D5DB" />
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 5 }}>Photo non fournie</p>
          </div>
        )}
      </div>
      <div style={{ padding: '7px 10px' }}>
        <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>Photo du véhicule</span>
      </div>
    </div>
  );
}

// ── Document card ──────────────────────────────────────────────────────────────

function DocumentCard({
  url, label, status, icon, onOpen,
}: {
  url?: string; label: string; status: VehicleDocStatus;
  icon: typeof FileText; onOpen?: (url: string) => void;
}) {
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid #E5E7EB', background: '#F9FAFB' }}>
      <div
        style={{
          height: 120, background: url ? '#000' : '#F3F4F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          cursor: url ? 'zoom-in' : 'default',
        }}
        onClick={() => url && onOpen?.(url)}
      >
        {url ? (
          <>
            <img src={url} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0)', transition: 'background .2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.35)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}
            >
              <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AppIcon icon={ZoomIn} size={13} color="#374151" />
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <AppIcon icon={icon} size={24} color="#D1D5DB" />
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
              {status === 'rejected' ? 'Rejeté' : 'Non fourni'}
            </p>
          </div>
        )}
      </div>
      <div style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <span style={{ fontSize: 11, color: '#374151', fontWeight: 500 }}>{label}</span>
        <Badge label={DOC_LABEL[status]} variant={DOC_VARIANT[status]} />
      </div>
    </div>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────────

interface Props {
  vehicle:    Vehicle;
  onClose:    () => void;
  onSuspend:  (id: string) => void;
  onActivate: (id: string) => void;
}

export function VehicleDetailModal({ vehicle: v, onClose, onSuspend, onActivate }: Props) {
  const [lightbox, setLightbox] = useState<{ images: LightboxEntry[]; index: number } | null>(null);

  const canSuspend  = v.status === 'Actif';
  const canActivate = v.status === 'Suspendu' || v.status === 'Rejeté';

  const allDocsOk = v.documents.carteGrise === 'ok' &&
                    v.documents.assurance   === 'ok' &&
                    v.documents.visite      === 'ok';

  const allImages: LightboxEntry[] = [
    v.vehiclePhoto && { url: v.vehiclePhoto, label: 'Photo du véhicule' },
    v.documents.carteGriseUrl && { url: v.documents.carteGriseUrl, label: 'Carte grise' },
    v.documents.assuranceUrl  && { url: v.documents.assuranceUrl,  label: 'Assurance véhicule' },
    v.documents.visiteUrl     && { url: v.documents.visiteUrl,     label: 'Visite technique' },
  ].filter(Boolean) as LightboxEntry[];

  const openLightbox = useCallback((url: string, label: string) => {
    const idx = allImages.findIndex(i => i.url === url);
    if (idx >= 0) setLightbox({ images: allImages, index: idx });
    else setLightbox({ images: [{ url, label }], index: 0 });
  }, [allImages]);

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

      <DetailModal title="Détail Véhicule" onClose={onClose} accentColor="#7C3AED">

        {/* Hero */}
        <div className="detail-hero" style={{ background: 'rgba(124,58,237,0.06)' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'rgba(124,58,237,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <AppIcon icon={Truck} size={28} color="#7C3AED" />
          </div>
          <div>
            <p className="detail-hero__name">{v.make} {v.model} {v.year}</p>
            <p className="detail-hero__sub">{v.plate} · {v.type} · {v.color}</p>
            <div className="detail-hero__badge">
              <Badge label={v.status} variant={STATUS_VARIANT[v.status]} />
              {allDocsOk && (
                <span style={{ marginLeft: 8, fontSize: 11, color: '#00A86B', fontWeight: 600 }}>
                  ✓ Documents valides
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Photos & Documents */}
        <DetailSection title="Photos & Documents">
          <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>
            Cliquez sur une image pour l'agrandir · ← → pour naviguer
          </p>

          {/* Vehicle photo full-width */}
          <VehiclePhotoCard
            url={v.vehiclePhoto}
            onOpen={url => openLightbox(url, 'Photo du véhicule')}
          />

          {/* Documents — motos : 2 docs (carte grise + assurance), autres : 3 avec visite technique */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: v.type === 'Moto' ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: 8, marginTop: 10,
          }}>
            <DocumentCard
              url={v.documents.carteGriseUrl}
              label="Carte grise"
              status={v.documents.carteGrise}
              icon={Car}
              onOpen={url => openLightbox(url, 'Carte grise')}
            />
            <DocumentCard
              url={v.documents.assuranceUrl}
              label="Assurance"
              status={v.documents.assurance}
              icon={Shield}
              onOpen={url => openLightbox(url, 'Assurance véhicule')}
            />
            {v.type !== 'Moto' && v.documents.visite && (
              <DocumentCard
                url={v.documents.visiteUrl}
                label="Visite technique"
                status={v.documents.visite}
                icon={FileText}
                onOpen={url => openLightbox(url, 'Visite technique')}
              />
            )}
          </div>
        </DetailSection>

        {/* Informations véhicule */}
        <DetailSection title="Informations Véhicule">
          <DetailRow label="Marque / Modèle">
            <span>{v.make} {v.model}</span>
          </DetailRow>
          <DetailRow label="Année">
            <span>{v.year}</span>
          </DetailRow>
          <DetailRow label="Type">
            <span>{v.type}</span>
          </DetailRow>
          <DetailRow label="Plaque">
            <span style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>{v.plate}</span>
          </DetailRow>
          <DetailRow label="Couleur">
            <span>{v.color}</span>
          </DetailRow>
          <DetailRow label="Nombre de places">
            <span>{v.seats} place{v.seats > 1 ? 's' : ''}</span>
          </DetailRow>
          <DetailRow label="Enregistré le">
            <span>{v.registeredAt}</span>
          </DetailRow>
        </DetailSection>

        {/* Conducteur */}
        <DetailSection title="Conducteur Associé">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px', background: '#F9FAFB', borderRadius: 10,
            border: '1px solid #F3F4F6',
          }}>
            <img
              src={v.driverAvatar}
              alt={v.driverName}
              style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{v.driverName}</div>
              <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AppIcon icon={Hash} size={11} color="#9CA3AF" />
                  {v.driverId}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AppIcon icon={Phone} size={11} color="#9CA3AF" />
                  {v.driverPhone}
                </span>
              </div>
            </div>
          </div>
        </DetailSection>

        {/* Statistiques */}
        <DetailSection title="Statistiques">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: Navigation, label: 'Trajets effectués', value: String(v.trips),  color: '#7C3AED' },
              { icon: Star,       label: 'Note moyenne',      value: v.rating > 0 ? v.rating.toFixed(1) : '—', color: '#F59E0B' },
            ].map((s) => (
              <div key={s.label} style={{
                padding: '12px', background: '#F9FAFB', borderRadius: 10,
                border: '1px solid #F3F4F6', textAlign: 'center',
              }}>
                <AppIcon icon={s.icon} size={20} color={s.color} />
                <p style={{ fontSize: 20, fontWeight: 700, color: s.color, margin: '6px 0 2px' }}>{s.value}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </DetailSection>

        {/* Actions */}
        {(canSuspend || canActivate) && (
          <div style={{ display: 'flex', gap: 10, marginTop: 8, borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
            {canSuspend && (
              <button
                type="button"
                onClick={() => { onSuspend(v.id); onClose(); }}
                style={{
                  flex: 1, height: 40, borderRadius: 8,
                  border: '1.5px solid #E53935', background: '#fff', color: '#E53935',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <AppIcon icon={ShieldOff} size={14} color="#E53935" />
                Suspendre le véhicule
              </button>
            )}
            {canActivate && (
              <button
                type="button"
                onClick={() => { onActivate(v.id); onClose(); }}
                style={{
                  flex: 1, height: 40, borderRadius: 8,
                  border: 'none', background: '#00A86B', color: '#fff',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <AppIcon icon={CheckCircle} size={14} color="#fff" />
                Réactiver le véhicule
              </button>
            )}
          </div>
        )}

      </DetailModal>
    </>
  );
}
