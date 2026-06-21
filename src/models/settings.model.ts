export interface SettingsSummaryItem {
  id: number;
  label: string;
  value: string;
  iconId: string;
  iconBg: string;
  iconColor: string;
  valueColor: string | null;
}

export interface GeneralSettings {
  platformName: string;
  country: string;
  timezone: string;
  currency: string;
}

export interface Commission {
  id: string;
  type: string;
  rate: string;
  revenue: string;
  status: string;
}

export interface PaymentProvider {
  id: string;
  name: string;
  status: string;
  responseTime: string;
  transactions: string;
  failRate: string;
}

export interface SecurityLog {
  id: number;
  time: string;
  user: string;
  ip: string;
  action: string;
  riskLevel: string;
}

export interface SecurityLogsBody {
  data: SecurityLog[];
  total: number;
  current_page: number;
  last_page: number;
}

export interface SettingsAdmin {
  id: string;
  name: string;
  avatar: string | null;
  email: string;
  role: string;
  lastLogin: string;
  status: string;
}

export interface AnalyticsItem {
  id: number;
  label: string;
  value: string;
  valueColor: string;
  period: string;
}
