import { UserPlus, Navigation, CreditCard, AlertTriangle } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import { ActivityColumn, ActivityItem } from './ActivityColumn';
import {
  ACTIVITY_INSCRIPTIONS,
  ACTIVITY_TRIPS,
  ACTIVITY_PAYMENTS,
  ACTIVITY_DISPUTES,
} from '../../../config/constants';

export function RealTimeActivity() {
  return (
    <section className="dash-realtime">
      <div className="dash-realtime__header">
        <div className="dash-realtime__title-row">
          <div className="dash-realtime__dot" />
          <span className="dash-realtime__title">Activité en Temps Réel</span>
        </div>
        <button className="dash-realtime__refresh" type="button">
          Actualiser
        </button>
      </div>

      <div className="dash-realtime__grid">
        {/* Inscriptions */}
        <ActivityColumn title="Nouvelles Inscriptions">
          {ACTIVITY_INSCRIPTIONS.map((item) => (
            <ActivityItem
              key={item.id}
              name={item.name}
              sub={item.time}
              dotColor="#00A86B"
              iconNode={
                <div className="dash-activity-icon-wrap" style={{ background: '#DCFCE7' }}>
                  <AppIcon icon={UserPlus} size={16} color="#00A86B" />
                </div>
              }
            />
          ))}
        </ActivityColumn>

        {/* Trajets */}
        <ActivityColumn title="Trajets en Cours">
          {ACTIVITY_TRIPS.map((item) => (
            <ActivityItem
              key={item.id}
              name={item.route}
              sub={item.driver}
              dotColor="#2563EB"
              iconNode={
                <div className="dash-activity-icon-wrap" style={{ background: '#DBEAFE' }}>
                  <AppIcon icon={Navigation} size={16} color="#2563EB" />
                </div>
              }
            />
          ))}
        </ActivityColumn>

        {/* Paiements */}
        <ActivityColumn title="Derniers Paiements">
          {ACTIVITY_PAYMENTS.map((item) => (
            <ActivityItem
              key={item.id}
              name={item.amount}
              sub={item.trip}
              dotColor="#F4B400"
              iconNode={
                <div className="dash-activity-icon-wrap" style={{ background: '#FEF9C3' }}>
                  <AppIcon icon={CreditCard} size={16} color="#F4B400" />
                </div>
              }
            />
          ))}
        </ActivityColumn>

        {/* Litiges */}
        <ActivityColumn title="Litiges Récents">
          {ACTIVITY_DISPUTES.map((item) => (
            <ActivityItem
              key={item.id}
              name={item.title}
              sub={item.trip}
              variant={item.variant === 'error' ? 'error' : 'warning'}
              iconNode={
                <div
                  className="dash-activity-icon-wrap"
                  style={{ background: item.variant === 'error' ? '#FEE2E2' : '#FEF9C3' }}
                >
                  <AppIcon
                    icon={AlertTriangle}
                    size={16}
                    color={item.variant === 'error' ? '#E53935' : '#F59E0B'}
                  />
                </div>
              }
            />
          ))}
        </ActivityColumn>
      </div>
    </section>
  );
}
