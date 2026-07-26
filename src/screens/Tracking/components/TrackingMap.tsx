import { useEffect, useRef, useCallback } from 'react';
import type * as Leaflet from 'leaflet';
import type { TrackedTrip, IncidentType } from '../../../models/tracking.model';

// ── Leaflet singleton ─────────────────────────────────────────────────────────
// Loaded once lazily so Leaflet's globals don't run during SSR / test env

let _L: typeof Leaflet | null = null;

async function ensureLeaflet(): Promise<typeof Leaflet> {
  if (_L) return _L;
  await import('leaflet/dist/leaflet.css');
  const mod = await import('leaflet');
  _L = (mod.default ?? mod) as unknown as typeof Leaflet;
  return _L;
}

// ── Marker icon factory ───────────────────────────────────────────────────────

function makeIcon(lib: typeof Leaflet, status: TrackedTrip['status']): Leaflet.DivIcon {
  const color = status === 'incident' ? '#E53935' : '#00A86B';
  const pulse  = status === 'actif'
    ? `<div style="position:absolute;inset:-6px;border-radius:50%;background:${color}22;animation:tracking-pulse 2s infinite;"></div>`
    : '';
  const iconSvg = status === 'incident'
    ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>`
    : `<svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`;

  return lib.divIcon({
    html: `
      <div style="position:relative;display:inline-block;width:38px;height:38px;">
        ${pulse}
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:${color};border:3px solid white;
          box-shadow:0 2px 10px ${color}55;
          display:flex;align-items:center;justify-content:center;
          z-index:1;cursor:pointer;
        ">${iconSvg}</div>
      </div>`,
    iconSize:    [38, 38],
    iconAnchor:  [19, 19],
    popupAnchor: [0, -22],
    className:   '',
  });
}

// ── Popup HTML ────────────────────────────────────────────────────────────────

function popupHtml(t: TrackedTrip): string {
  const incidentBadge = t.incident && !t.incident.resolved
    ? `<div class="tracking-popup__incident" data-type="${t.incident.type}">
         <span class="tracking-popup__incident-label">
           ${t.incident.type === 'panne' ? '🔧 Panne' : t.incident.type === 'urgence' ? '🚨 Urgence' : 'ℹ️ Autre'}
         </span>
         <span class="tracking-popup__incident-notes">${t.incident.notes}</span>
         <button class="tracking-popup__resolve-btn" data-trip="${t.id}">✓ Résoudre</button>
       </div>`
    : '';

  const reportBtns = !t.incident || t.incident.resolved
    ? `<div class="tracking-popup__actions">
         <button class="tracking-popup__action-btn tracking-popup__action-btn--panne"   data-trip="${t.id}" data-action="panne">🔧 Panne</button>
         <button class="tracking-popup__action-btn tracking-popup__action-btn--urgence" data-trip="${t.id}" data-action="urgence">🚨 Urgence</button>
         <button class="tracking-popup__action-btn tracking-popup__action-btn--autre"   data-trip="${t.id}" data-action="autre">ℹ️ Autre</button>
       </div>`
    : '';

  const speed = t.position.speed ? `· ${t.position.speed} km/h` : '';

  return `
    <div class="tracking-popup">
      <div class="tracking-popup__header">
        <img src="${t.driverAvatar}" class="tracking-popup__avatar" alt="${t.driverName}" />
        <div>
          <div class="tracking-popup__name">${t.driverName}</div>
          <div class="tracking-popup__phone">${t.driverPhone}</div>
        </div>
        <span class="tracking-popup__trip-id">${t.tripId}</span>
      </div>
      <div class="tracking-popup__route">${t.from} → ${t.to}</div>
      <div class="tracking-popup__meta">
        👥 ${t.passengerCount} passager${t.passengerCount > 1 ? 's' : ''}
        · ⏱ Arr. ${t.estimatedArrival} ${speed}
      </div>
      ${incidentBadge}
      <div class="tracking-popup__divider"></div>
      <div class="tracking-popup__signal-label">Signaler un incident :</div>
      ${reportBtns}
      ${t.incident && !t.incident.resolved ? '<div class="tracking-popup__incident-note">Un incident actif existe déjà</div>' : ''}
    </div>`;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  trips:      TrackedTrip[];
  selectedId: string | null;
  onSelect:   (id: string) => void;
  onReport:   (tripId: string, type: IncidentType) => void;
  onResolve:  (tripId: string) => void;
}

export function TrackingMap({ trips, selectedId, onSelect, onReport, onResolve }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<Leaflet.Map | null>(null);
  const markersRef   = useRef<Map<string, Leaflet.Marker>>(new Map());
  const libRef       = useRef<typeof Leaflet | null>(null);

  // ── Handle popup button clicks ────────────────────────────────────────────
  const handlePopupClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('[data-action]') as HTMLElement | null;
    const res = target.closest('[data-trip]')   as HTMLElement | null;

    if (btn?.dataset.action && btn.dataset.trip) {
      onReport(btn.dataset.trip, btn.dataset.action as IncidentType);
      mapRef.current?.closePopup();
    } else if (res?.classList.contains('tracking-popup__resolve-btn') && res.dataset.trip) {
      onResolve(res.dataset.trip);
      mapRef.current?.closePopup();
    }
  }, [onReport, onResolve]);

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    ensureLeaflet().then((lib) => {
      if (!mounted || !containerRef.current || mapRef.current) return;
      libRef.current = lib;

      const map = lib.map(containerRef.current, {
        center:             [6.8702, 2.4100],
        zoom:               8,
        zoomControl:        true,
        attributionControl: true,
      });

      lib.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      map.getContainer().addEventListener('click', handlePopupClick);
      mapRef.current = map;
    }).catch(() => { /* leaflet failed to load — map shows empty */ });

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.getContainer().removeEventListener('click', handlePopupClick);
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current.clear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Update markers when trips change ─────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const lib = libRef.current;
    if (!map || !lib) return;

    const seen = new Set<string>();

    trips.forEach((t) => {
      seen.add(t.id);
      const icon = makeIcon(lib, t.status);

      const existing = markersRef.current.get(t.id);
      if (existing) {
        existing.setLatLng([t.position.lat, t.position.lng]);
        existing.setIcon(icon);
        existing.setPopupContent(popupHtml(t));
      } else {
        const marker = lib.marker([t.position.lat, t.position.lng], { icon })
          .addTo(map)
          .bindPopup(popupHtml(t), { maxWidth: 300, minWidth: 260 })
          .on('click', () => onSelect(t.id));
        markersRef.current.set(t.id, marker);
      }
    });

    markersRef.current.forEach((marker, id) => {
      if (!seen.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [trips, onSelect]);

  // ── Open popup for selected trip ──────────────────────────────────────────
  useEffect(() => {
    if (!selectedId) return;
    const marker = markersRef.current.get(selectedId);
    if (marker && mapRef.current) {
      mapRef.current.setView(marker.getLatLng(), Math.max(mapRef.current.getZoom(), 11), { animate: true });
      marker.openPopup();
    }
  }, [selectedId]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: 500, borderRadius: 12, overflow: 'hidden' }}
    />
  );
}
