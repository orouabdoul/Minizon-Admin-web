export function SettingsGeneralCard() {
  return (
    <div className="settings-card">
      <p className="settings-card__title">Paramètres Généraux</p>
      <div className="settings-form-grid">
        <div className="settings-form-group">
          <label className="settings-form-label">Nom de la plateforme</label>
          <input type="text" className="settings-input" defaultValue="MINIZON" />
        </div>
        <div className="settings-form-group">
          <label className="settings-form-label">Pays principal</label>
          <select className="settings-select">
            <option>Bénin</option>
            <option>Sénégal</option>
            <option>Côte d'Ivoire</option>
            <option>Togo</option>
          </select>
        </div>
        <div className="settings-form-group">
          <label className="settings-form-label">Fuseau horaire</label>
          <select className="settings-select">
            <option>GMT+1 (Cotonou)</option>
            <option>GMT+0 (Dakar)</option>
            <option>GMT+1 (Lagos)</option>
            <option>GMT+0 (Lomé)</option>
          </select>
        </div>
        <div className="settings-form-group">
          <label className="settings-form-label">Devise principale</label>
          <select className="settings-select">
            <option>XOF (Franc CFA)</option>
            <option>EUR (Euro)</option>
            <option>USD (Dollar)</option>
            <option>GHS (Cedi)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
