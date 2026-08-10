import { useState } from 'react';
import { Shield, Download, Search, RefreshCw, FileText, AlertTriangle, Users, BarChart2 } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }         from '../../components/Common/AppIcon';
import { useAudit }        from '../../hooks/useAudit';
import type { AuditActionType, AuditSeverity } from '../../models/audit.model';

// ── Config ─────────────────────────────────────────────────────────────────────

const ACTION_LABEL: Record<AuditActionType, string> = {
  connexion:             'Connexion',
  deconnexion:           'Déconnexion',
  suspension:            'Suspension',
  reactivation:          'Réactivation',
  remboursement:         'Remboursement',
  modif_parametre:       'Modif. paramètre',
  creation_admin:        'Création admin',
  resolution_litige:     'Résolution litige',
  approbation_conducteur:'Approbation',
  rejet_conducteur:      'Rejet',
  suppression:           'Suppression',
  export_donnees:        'Export données',
};

const ACTION_COLOR: Record<AuditActionType, { color: string; bg: string }> = {
  connexion:             { color: '#2563EB', bg: '#DBEAFE' },
  deconnexion:           { color: '#6B7280', bg: '#F3F4F6' },
  suspension:            { color: '#E53935', bg: '#FEE2E2' },
  reactivation:          { color: '#00A86B', bg: '#DCFCE7' },
  remboursement:         { color: '#D97706', bg: '#FEF3C7' },
  modif_parametre:       { color: '#7C3AED', bg: '#F3E8FF' },
  creation_admin:        { color: '#C62828', bg: '#FFCDD2' },
  resolution_litige:     { color: '#00A86B', bg: '#DCFCE7' },
  approbation_conducteur:{ color: '#00A86B', bg: '#DCFCE7' },
  rejet_conducteur:      { color: '#E53935', bg: '#FEE2E2' },
  suppression:           { color: '#C62828', bg: '#FFCDD2' },
  export_donnees:        { color: '#0891B2', bg: '#CFFAFE' },
};

const SEVERITY_CONFIG: Record<AuditSeverity, { label: string; color: string; bg: string; dot: string }> = {
  info:          { label: 'Info',          color: '#2563EB', bg: '#DBEAFE', dot: '#2563EB' },
  avertissement: { label: 'Avertissement', color: '#D97706', bg: '#FEF3C7', dot: '#F59E0B' },
  critique:      { label: 'Critique',      color: '#C62828', bg: '#FFCDD2', dot: '#E53935' },
};

function fmtTimestamp(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export function AuditScreen() {
  const { logs, stats, loading, filters, admins, exporting, setFilters, exportLogs, refresh } = useAudit();
  // eslint-disable-next-line no-empty-pattern
  const [] = useState(false);

  return (
    <DashboardLayout title="Journal d'Audit & Sécurité">

      {/* ── KPI summary ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[
          { label: "Actions aujourd'hui", value: stats.today_count,    color: '#2563EB', bg: '#DBEAFE', icon: FileText      },
          { label: 'Événements critiques', value: stats.critique_count, color: '#E53935', bg: '#FEE2E2', icon: AlertTriangle },
          { label: 'Administrateurs',      value: admins.length,        color: '#00A86B', bg: '#DCFCE7', icon: Users         },
          { label: 'Total entrées',        value: stats.total,          color: '#7C3AED', bg: '#F3E8FF', icon: BarChart2     },
        ].map((k) => (
          <div key={k.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: '#fff', borderRadius: 10, outline: '1px solid #F3F4F6' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AppIcon icon={k.icon} size={16} color={k.color} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: k.color, lineHeight: 1.2 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', flexWrap: 'wrap' }}>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F3F4F6', borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 200 }}>
            <AppIcon icon={Search} size={14} color="#9CA3AF" />
            <input
              style={{ border: 'none', background: 'transparent', fontSize: 13, color: '#374151', outline: 'none', flex: 1 }}
              placeholder="Rechercher action, utilisateur, IP…"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>

          {/* Severity */}
          <select
            style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 12, color: '#374151', background: '#fff' }}
            value={filters.severity}
            onChange={(e) => setFilters({ severity: e.target.value as AuditSeverity | 'all' })}
          >
            <option value="all">Toutes sévérités</option>
            <option value="info">Info</option>
            <option value="avertissement">Avertissement</option>
            <option value="critique">Critique</option>
          </select>

          {/* Action type */}
          <select
            style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 12, color: '#374151', background: '#fff' }}
            value={filters.actionType}
            onChange={(e) => setFilters({ actionType: e.target.value as AuditActionType | 'all' })}
          >
            <option value="all">Tous les types</option>
            {(Object.keys(ACTION_LABEL) as AuditActionType[]).map((k) => (
              <option key={k} value={k}>{ACTION_LABEL[k]}</option>
            ))}
          </select>

          {/* Admin */}
          <select
            style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 12, color: '#374151', background: '#fff' }}
            value={filters.adminId}
            onChange={(e) => setFilters({ adminId: e.target.value })}
          >
            <option value="all">Tous les admins</option>
            {admins.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          {/* Date from */}
          <input
            type="date"
            style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 12, color: '#374151', background: '#fff' }}
            value={filters.date_from}
            onChange={(e) => setFilters({ date_from: e.target.value })}
            title="Date début"
          />

          {/* Date to */}
          <input
            type="date"
            style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 12, color: '#374151', background: '#fff' }}
            value={filters.date_to}
            onChange={(e) => setFilters({ date_to: e.target.value })}
            title="Date fin"
          />

          {/* Refresh */}
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            style={{ height: 36, width: 36, borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="Actualiser"
          >
            <AppIcon icon={RefreshCw} size={14} color={loading ? '#D1D5DB' : '#374151'} />
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={exportLogs}
            disabled={exporting}
            style={{ height: 36, padding: '0 14px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 12, fontWeight: 600, color: exporting ? '#9CA3AF' : '#374151', cursor: exporting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <AppIcon icon={Download} size={13} color={exporting ? '#9CA3AF' : '#374151'} />
            {exporting ? 'Export…' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AppIcon icon={Shield} size={16} color="#374151" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Journal d'audit</span>
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              — {logs.length} entrée{logs.length > 1 ? 's' : ''} affichée{logs.length > 1 ? 's' : ''}
              {stats.total > logs.length ? ` / ${stats.total} au total` : ''}
            </span>
          </div>
          {loading && <AppIcon icon={RefreshCw} size={14} color="#9CA3AF" />}
        </div>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 150px 1fr 140px 120px 110px', padding: '8px 16px', background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
          {['Date / Heure', 'Administrateur', 'Description', 'Cible', 'Adresse IP', 'Sévérité'].map((h) => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.3 }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        <div style={{ maxHeight: 'calc(100vh - 440px)', overflowY: 'auto' }}>
          {loading && logs.length === 0 ? (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
              Chargement…
            </div>
          ) : logs.length === 0 ? (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
              Aucune entrée pour ces filtres
            </div>
          ) : logs.map((log, i) => {
            const action = ACTION_COLOR[log.actionType];
            const sev    = SEVERITY_CONFIG[log.severity];
            const isEven = i % 2 === 0;

            return (
              <div
                key={log.id}
                style={{
                  display: 'grid', gridTemplateColumns: '160px 150px 1fr 140px 120px 110px',
                  padding: '10px 16px', alignItems: 'center', borderBottom: '1px solid #F9FAFB',
                  background: isEven ? '#fff' : '#FAFAFA',
                  borderLeft: `3px solid ${sev.dot}`,
                }}
              >
                {/* Timestamp */}
                <span style={{ fontSize: 12, color: '#6B7280', fontFamily: 'monospace' }}>
                  {fmtTimestamp(log.timestamp)}
                </span>

                {/* Admin */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {log.adminAvatar ? (
                    <img src={log.adminAvatar} alt={log.adminName} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#6B7280' }}>
                      {log.adminName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{log.adminName}</span>
                </div>

                {/* Description + action badge */}
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 9999, marginRight: 6, color: action.color, background: action.bg }}>
                    {ACTION_LABEL[log.actionType]}
                  </span>
                  <span style={{ fontSize: 12, color: '#374151' }}>{log.description}</span>
                </div>

                {/* Target */}
                <span style={{ fontSize: 12, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.targetName ?? '—'}
                </span>

                {/* IP */}
                <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>{log.ipAddress}</span>

                {/* Severity */}
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 9999, color: sev.color, background: sev.bg }}>
                  {sev.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
