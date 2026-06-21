import { useState, useEffect } from 'react';
import { Save }              from 'lucide-react';
import { AppIcon }           from '../../../components/Common/AppIcon';
import type { GeneralSettings } from '../../../models/settings.model';

interface Props {
  general:  GeneralSettings | null;
  loading:  boolean;
  saving:   boolean;
  onSave:   (data: GeneralSettings) => void;
}

export function SettingsGeneralCard({ general, loading, saving, onSave }: Props) {
  const [form, setForm] = useState<GeneralSettings>({
    platformName: '', country: '', timezone: '', currency: '',
  });

  useEffect(() => {
    if (general) setForm(general);
  }, [general]);

  const changed = general != null && (
    form.platformName !== general.platformName ||
    form.country      !== general.country      ||
    form.timezone     !== general.timezone     ||
    form.currency     !== general.currency
  );

  return (
    <div className="settings-card">
      <div className="settings-card__title-row">
        <p className="settings-card__title">Paramètres Généraux</p>
        <button
          type="button"
          className="settings-save-btn"
          disabled={!changed || saving || loading}
          onClick={() => onSave(form)}
        >
          <AppIcon icon={Save} size={13} color="#fff" />
          {saving ? 'Sauvegarde…' : 'Sauvegarder'}
        </button>
      </div>
      <div className="settings-form-grid">
        <div className="settings-form-group">
          <label className="settings-form-label">Nom de la plateforme</label>
          <input
            type="text"
            className="settings-input"
            value={form.platformName}
            disabled={loading}
            onChange={(e) => setForm((f) => ({ ...f, platformName: e.target.value }))}
          />
        </div>
        <div className="settings-form-group">
          <label className="settings-form-label">Pays principal</label>
          <select
            className="settings-select"
            value={form.country}
            disabled={loading}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
          >
            <option value="Bénin">Bénin</option>
            <option value="Sénégal">Sénégal</option>
            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
            <option value="Togo">Togo</option>
          </select>
        </div>
        <div className="settings-form-group">
          <label className="settings-form-label">Fuseau horaire</label>
          <select
            className="settings-select"
            value={form.timezone}
            disabled={loading}
            onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
          >
            <option value="GMT+1 (Cotonou)">GMT+1 (Cotonou)</option>
            <option value="GMT+0 (Dakar)">GMT+0 (Dakar)</option>
            <option value="GMT+1 (Lagos)">GMT+1 (Lagos)</option>
            <option value="GMT+0 (Lomé)">GMT+0 (Lomé)</option>
          </select>
        </div>
        <div className="settings-form-group">
          <label className="settings-form-label">Devise principale</label>
          <select
            className="settings-select"
            value={form.currency}
            disabled={loading}
            onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
          >
            <option value="XOF (Franc CFA)">XOF (Franc CFA)</option>
            <option value="EUR (Euro)">EUR (Euro)</option>
            <option value="USD (Dollar)">USD (Dollar)</option>
            <option value="GHS (Cedi)">GHS (Cedi)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
