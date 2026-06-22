import { Badge }           from '../../../components/DataDisplay/Badge/Badge';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';
import type { PaymentProvider } from '../../../models/settings.model';

interface Props {
  providers: PaymentProvider[];
  loading:   boolean;
}

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  'Connecté': 'emerald',
  'En test':  'amber',
};

export function SettingsPaymentsCard({ providers, loading }: Props) {
  const display = loading
    ? Array.from({ length: 3 }, (_, i) => ({
        id: `skel-${i}`, name: '…', status: 'En test',
        responseTime: '…', transactions: '…', failRate: '…',
      }))
    : (providers ?? []);

  return (
    <div className="settings-card">
      <p className="settings-card__title">Paramètres Paiements</p>
      <div className="settings-payment-grid">
        {display.map((provider) => (
          <div key={provider.id} className="settings-payment-card">
            <div className="settings-payment-card__header">
              <span className="settings-payment-card__name">{provider.name}</span>
              <Badge label={provider.status} variant={STATUS_VARIANT[provider.status] ?? 'neutral'} />
            </div>
            <div className="settings-payment-card__stats">
              <div className="settings-payment-stat">
                <span className="settings-payment-stat__label">Temps réponse</span>
                <span className="settings-payment-stat__value">{provider.responseTime}</span>
              </div>
              <div className="settings-payment-stat">
                <span className="settings-payment-stat__label">Transactions</span>
                <span className="settings-payment-stat__value">{provider.transactions}</span>
              </div>
              <div className="settings-payment-stat">
                <span className="settings-payment-stat__label">Taux échec</span>
                <span className="settings-payment-stat__value settings-payment-stat__value--fail">{provider.failRate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
