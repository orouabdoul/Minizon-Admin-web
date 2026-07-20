export type ReportPeriod = '7j' | '30j' | '90j';

export interface ReportKpi {
  id:    string;
  label: string;
  value: string;
  trend: string;
  up:    boolean;
  color: string;
  bg:    string;
}

export interface RevenueBar {
  label:   string;
  revenue: number;
  trips:   number;
}

export interface TopDriver {
  rank:   number;
  name:   string;
  avatar: string;
  trips:  number;
  revenue: string;
  rating: number;
}

export interface ZoneStat {
  zone:    string;
  trips:   number;
  percent: number;
}

export interface ReportData {
  period:       ReportPeriod;
  kpis:         ReportKpi[];
  revenueChart: RevenueBar[];
  topDrivers:   TopDriver[];
  byZone:       ZoneStat[];
}
