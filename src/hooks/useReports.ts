import { useState, useEffect } from 'react';
import type { ReportPeriod, ReportData } from '../models/reports.model';
import { reportsService } from '../services/reports_service';

// ── Mock data per period ───────────────────────────────────────────────────────

const MOCK: Record<ReportPeriod, ReportData> = {
  '7j': {
    period: '7j',
    kpis: [
      { id: 'revenue',  label: 'Revenus',              value: '428 500 FCFA', trend: '+18.7%', up: true,  color: '#00A86B', bg: 'rgba(0,168,107,0.10)'  },
      { id: 'trips',    label: 'Trajets effectués',    value: '1 234',        trend: '+12.1%', up: true,  color: '#2563EB', bg: 'rgba(37,99,235,0.10)'  },
      { id: 'users',    label: 'Nouveaux utilisateurs',value: '89',           trend: '+8.4%',  up: true,  color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
      { id: 'incidents',label: 'Incidents signalés',   value: '7',            trend: '-2',     up: false, color: '#E53935', bg: '#FEE2E2'               },
    ],
    revenueChart: [
      { label: 'Lun', revenue: 52000, trips: 158 },
      { label: 'Mar', revenue: 68000, trips: 207 },
      { label: 'Mer', revenue: 47000, trips: 143 },
      { label: 'Jeu', revenue: 71000, trips: 216 },
      { label: 'Ven', revenue: 89000, trips: 271 },
      { label: 'Sam', revenue: 63000, trips: 192 },
      { label: 'Dim', revenue: 38500, trips: 117 },
    ],
    topDrivers: [
      { rank: 1, name: 'Adjovi Sèna',           avatar: 'https://placehold.co/32x32', trips: 47, revenue: '58 750 FCFA', rating: 4.9 },
      { rank: 2, name: 'Kofi Mensah',            avatar: 'https://placehold.co/32x32', trips: 41, revenue: '51 250 FCFA', rating: 4.8 },
      { rank: 3, name: 'Adjoa Koffi',            avatar: 'https://placehold.co/32x32', trips: 36, revenue: '45 000 FCFA', rating: 4.7 },
      { rank: 4, name: 'Jean-Baptiste Hounkpè', avatar: 'https://placehold.co/32x32', trips: 28, revenue: '35 000 FCFA', rating: 4.5 },
      { rank: 5, name: 'Yao Kobenan',            avatar: 'https://placehold.co/32x32', trips: 22, revenue: '27 500 FCFA', rating: 4.6 },
    ],
    byZone: [
      { zone: 'Cotonou',    trips: 612, percent: 50 },
      { zone: 'Porto-Novo', trips: 308, percent: 25 },
      { zone: 'Parakou',    trips: 185, percent: 15 },
      { zone: 'Abomey',     trips: 129, percent: 10 },
    ],
  },
  '30j': {
    period: '30j',
    kpis: [
      { id: 'revenue',  label: 'Revenus',              value: '1 842 000 FCFA', trend: '+22.3%', up: true,  color: '#00A86B', bg: 'rgba(0,168,107,0.10)'  },
      { id: 'trips',    label: 'Trajets effectués',    value: '5 289',          trend: '+15.6%', up: true,  color: '#2563EB', bg: 'rgba(37,99,235,0.10)'  },
      { id: 'users',    label: 'Nouveaux utilisateurs',value: '347',            trend: '+11.2%', up: true,  color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
      { id: 'incidents',label: 'Incidents signalés',   value: '29',             trend: '+3',     up: false, color: '#E53935', bg: '#FEE2E2'               },
    ],
    revenueChart: [
      { label: 'S1',  revenue: 410000, trips: 1180 },
      { label: 'S2',  revenue: 475000, trips: 1365 },
      { label: 'S3',  revenue: 502000, trips: 1443 },
      { label: 'S4',  revenue: 455000, trips: 1301 },
    ],
    topDrivers: [
      { rank: 1, name: 'Adjovi Sèna',           avatar: 'https://placehold.co/32x32', trips: 198, revenue: '247 500 FCFA', rating: 4.9 },
      { rank: 2, name: 'Kofi Mensah',            avatar: 'https://placehold.co/32x32', trips: 172, revenue: '215 000 FCFA', rating: 4.8 },
      { rank: 3, name: 'Adjoa Koffi',            avatar: 'https://placehold.co/32x32', trips: 154, revenue: '192 500 FCFA', rating: 4.7 },
      { rank: 4, name: 'Jean-Baptiste Hounkpè', avatar: 'https://placehold.co/32x32', trips: 121, revenue: '151 250 FCFA', rating: 4.5 },
      { rank: 5, name: 'Yao Kobenan',            avatar: 'https://placehold.co/32x32', trips: 98,  revenue: '122 500 FCFA', rating: 4.6 },
    ],
    byZone: [
      { zone: 'Cotonou',    trips: 2645, percent: 50 },
      { zone: 'Porto-Novo', trips: 1322, percent: 25 },
      { zone: 'Parakou',    trips: 793,  percent: 15 },
      { zone: 'Abomey',     trips: 529,  percent: 10 },
    ],
  },
  '90j': {
    period: '90j',
    kpis: [
      { id: 'revenue',  label: 'Revenus',              value: '5 527 000 FCFA', trend: '+28.1%', up: true,  color: '#00A86B', bg: 'rgba(0,168,107,0.10)'  },
      { id: 'trips',    label: 'Trajets effectués',    value: '15 847',         trend: '+19.4%', up: true,  color: '#2563EB', bg: 'rgba(37,99,235,0.10)'  },
      { id: 'users',    label: 'Nouveaux utilisateurs',value: '1 042',          trend: '+14.7%', up: true,  color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
      { id: 'incidents',label: 'Incidents signalés',   value: '87',             trend: '-12',    up: false, color: '#E53935', bg: '#FEE2E2'               },
    ],
    revenueChart: [
      { label: 'Avr', revenue: 1620000, trips: 4820 },
      { label: 'Mai', revenue: 1840000, trips: 5472 },
      { label: 'Jun', revenue: 2067000, trips: 5555 },
    ],
    topDrivers: [
      { rank: 1, name: 'Adjovi Sèna',           avatar: 'https://placehold.co/32x32', trips: 594, revenue: '742 500 FCFA', rating: 4.9 },
      { rank: 2, name: 'Kofi Mensah',            avatar: 'https://placehold.co/32x32', trips: 516, revenue: '645 000 FCFA', rating: 4.8 },
      { rank: 3, name: 'Adjoa Koffi',            avatar: 'https://placehold.co/32x32', trips: 462, revenue: '577 500 FCFA', rating: 4.7 },
      { rank: 4, name: 'Jean-Baptiste Hounkpè', avatar: 'https://placehold.co/32x32', trips: 363, revenue: '453 750 FCFA', rating: 4.5 },
      { rank: 5, name: 'Yao Kobenan',            avatar: 'https://placehold.co/32x32', trips: 294, revenue: '367 500 FCFA', rating: 4.6 },
    ],
    byZone: [
      { zone: 'Cotonou',    trips: 7924, percent: 50 },
      { zone: 'Porto-Novo', trips: 3962, percent: 25 },
      { zone: 'Parakou',    trips: 2377, percent: 15 },
      { zone: 'Abomey',     trips: 1584, percent: 10 },
    ],
  },
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useReports() {
  const [period,    setPeriod]    = useState<ReportPeriod>('7j');
  const [data,      setData]      = useState<ReportData>(MOCK['7j']);
  const [loading,   setLoading]   = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    reportsService.getData(period)
      .then((res) => {
        const d = res.data.body;
        if (d) setData(d);
      })
      .catch(() => setData(MOCK[period]))
      .finally(() => setLoading(false));
  }, [period]);

  const exportReport = (format: 'pdf' | 'excel') => {
    const svc = format === 'pdf' ? reportsService.exportPdf : reportsService.exportXls;
    svc(period).catch(() => {});
    setExportMsg(`Rapport ${format.toUpperCase()} en cours de génération…`);
    setTimeout(() => setExportMsg(null), 3000);
  };

  return { data, period, loading, exportMsg, setPeriod, exportReport };
}
