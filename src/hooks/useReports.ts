import { useState, useEffect, useCallback } from 'react';
import type { ReportPeriod, ReportData } from '../models/reports.model';
import { reportsService } from '../services/reports_service';

// Derive RGBA background from hex color
function colorToBg(hex: string): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},0.10)`;
  } catch { return 'rgba(0,0,0,0.05)'; }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(body: any): ReportData {
  return {
    period:       body.period,
    kpis:         (body.kpis ?? []).map((k: any) => ({
      ...k,
      bg: k.bg ?? colorToBg(k.color ?? '#374151'),
    })),
    revenueChart: body.revenueChart ?? [],
    topDrivers:   (body.topDrivers ?? []).map((d: any, i: number) => ({
      ...d,
      rank:   d.rank   ?? i + 1,
      avatar: d.avatar ?? '',
    })),
    byZone: body.byZone ?? [],
  };
}

export function useReports() {
  const [period,    setPeriod]    = useState<ReportPeriod>('7j');
  const [data,      setData]      = useState<ReportData | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    reportsService.getData(period)
      .then((res) => {
        const raw = res.data as any;
        const body = raw.body ?? raw;
        setData(normalize(body));
      })
      .catch(() => setError('Impossible de charger le rapport. Vérifiez votre connexion.'))
      .finally(() => setLoading(false));
  }, [period]);

  const exportReport = useCallback(async (format: 'pdf' | 'excel') => {
    if (exporting) return;
    setExporting(true);
    setExportMsg(null);
    try {
      const res = await reportsService.export(period, format);
      if (format === 'excel') {
        const blob = new Blob([res.data as BlobPart], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `rapport_${period}_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setExportMsg('Téléchargement du rapport Excel démarré.');
      } else {
        const raw = res.data as any;
        setExportMsg(raw?.message ?? 'Export PDF en cours de traitement.');
      }
    } catch {
      setExportMsg('Erreur lors de l\'export. Veuillez réessayer.');
    } finally {
      setExporting(false);
      setTimeout(() => setExportMsg(null), 4000);
    }
  }, [period, exporting]);

  return { data, period, loading, error, exportMsg, exporting, setPeriod, exportReport };
}
