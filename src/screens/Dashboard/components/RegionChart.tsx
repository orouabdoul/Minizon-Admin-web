import type { DashboardTrips, DashboardBookings } from '../../../models/dashboard.model';

interface Props {
  trips:    DashboardTrips    | null;
  bookings: DashboardBookings | null;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, marginTop: 16 }}>
      {children}
    </p>
  );
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#6B7280' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width .4s ease' }} />
      </div>
    </div>
  );
}

export function RegionChart({ trips, bookings }: Props) {
  if (!trips || !bookings) {
    return (
      <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#9CA3AF', fontSize: 13 }}>Chargement…</span>
      </div>
    );
  }

  const maxTrips    = Math.max(trips.total, 1);
  const maxBookings = Math.max(bookings.total, 1);

  return (
    <div style={{ padding: '4px 0' }}>
      <SectionTitle>Trajets</SectionTitle>
      <BarRow label="Total"        value={trips.total}      max={maxTrips} color="#9333EA" />
      <BarRow label="Actifs"       value={trips.active}     max={maxTrips} color="#1A5FB4" />
      <BarRow label="Terminés"     value={trips.completed}  max={maxTrips} color="#1A5FB4" />
      <BarRow label="Annulés"      value={trips.cancelled}  max={maxTrips} color="#E53935" />
      <BarRow label="Ce mois"      value={trips.this_month} max={maxTrips} color="#F59E0B" />

      <SectionTitle>Réservations</SectionTitle>
      <BarRow label="Total"        value={bookings.total}     max={maxBookings} color="#0D9488" />
      <BarRow label="En attente"   value={bookings.pending}   max={maxBookings} color="#F59E0B" />
      <BarRow label="Acceptées"    value={bookings.accepted}  max={maxBookings} color="#1A5FB4" />
      <BarRow label="Annulées"     value={bookings.cancelled} max={maxBookings} color="#E53935" />
    </div>
  );
}
