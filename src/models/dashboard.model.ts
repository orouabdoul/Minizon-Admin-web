export interface DashboardUsers {
  total: number;
  drivers: number;
  passengers: number;
  pending_kyc: number;
  blocked: number;
  new_this_month: number;
}

export interface DashboardTrips {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  this_month: number;
}

export interface DashboardBookings {
  total: number;
  pending: number;
  accepted: number;
  cancelled: number;
}

export interface DashboardPayments {
  total_volume_fcfa: number;
  platform_revenue_fcfa: number;
  escrow_locked_fcfa: number;
  refunded_fcfa: number;
  this_month_fcfa: number;
}

export interface DashboardWithdrawals {
  pending_count: number;
  pending_amount: number;
}

export interface DashboardDisputes {
  total: number;
  pending: number;
  investigating: number;
  resolved: number;
}

export interface DashboardCharts {
  daily_revenue_7d: { date: string; amount: number }[];
  top_drivers: { id: number; name: string; trips: number; rating: number }[];
}

export interface DashboardData {
  users: DashboardUsers;
  trips: DashboardTrips;
  bookings: DashboardBookings;
  payments: DashboardPayments;
  withdrawals: DashboardWithdrawals;
  disputes: DashboardDisputes;
  charts: DashboardCharts;
}

export type BadgeVariant = 'success' | 'error' | 'warning' | 'neutral';

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface RegionDataPoint {
  label: string;
  percent: number;
  color: string;
}
