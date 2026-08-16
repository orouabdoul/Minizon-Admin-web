import { Truck, CheckCircle, Wrench, ShieldOff } from 'lucide-react';
import type { LucideIcon }   from 'lucide-react';
import { PassengerKpiCard }  from '../../../components/DataDisplay/PassengerKpiCard/PassengerKpiCard';
import type { VehicleMetrics } from '../../../models/vehicle.model';

interface Props { metrics: VehicleMetrics; }

const CARDS: {
  key:       keyof VehicleMetrics;
  label:     string;
  icon:      LucideIcon;
  iconBg:    string;
  iconColor: string;
  badge:     (m: VehicleMetrics) => string;
  badgeBg:   string;
  badgeColor:string;
}[] = [
  {
    key: 'total', label: 'Total véhicules',
    icon: Truck, iconBg: 'rgba(124,58,237,0.10)', iconColor: '#7C3AED',
    badge: (m) => `${m.actif} actifs`,
    badgeBg: 'rgba(124,58,237,0.10)', badgeColor: '#7C3AED',
  },
  {
    key: 'actif', label: 'Véhicules actifs',
    icon: CheckCircle, iconBg: 'rgba(124,58,237,0.10)', iconColor: '#7C3AED',
    badge: () => 'En service',
    badgeBg: 'rgba(124,58,237,0.10)', badgeColor: '#7C3AED',
  },
  {
    key: 'inspection', label: 'En inspection',
    icon: Wrench, iconBg: 'rgba(245,158,11,0.10)', iconColor: '#F59E0B',
    badge: () => 'À traiter',
    badgeBg: 'rgba(245,158,11,0.10)', badgeColor: '#F59E0B',
  },
  {
    key: 'suspendu', label: 'Suspendus / Rejetés',
    icon: ShieldOff, iconBg: '#FEE2E2', iconColor: '#E53935',
    badge: () => 'Restreints',
    badgeBg: '#FEE2E2', badgeColor: '#E53935',
  },
];

export function VehiclesMetrics({ metrics }: Props) {
  return (
    <div className="vehicles-metrics">
      {CARDS.map((c) => (
        <PassengerKpiCard
          key={c.key}
          label={c.label}
          value={String(metrics[c.key])}
          badge={c.badge(metrics)}
          icon={c.icon}
          iconBg={c.iconBg}
          iconColor={c.iconColor}
          badgeBg={c.badgeBg}
          badgeColor={c.badgeColor}
        />
      ))}
    </div>
  );
}
