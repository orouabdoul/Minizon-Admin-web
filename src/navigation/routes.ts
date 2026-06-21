export const ROUTES = {
  LOGIN:         '/login',
  DASHBOARD:     '/dashboard',
  USERS:         '/users',
  DRIVERS:       '/drivers',
  VEHICLES:      '/vehicles',
  PASSENGERS:    '/passengers',
  TRIPS:         '/trips',
  RESERVATIONS:  '/reservations',
  PAYMENTS:      '/payments',
  DISPUTES:      '/disputes',
  SUPPORT:       '/support',
  NOTIFICATIONS: '/notifications',
  SETTINGS:      '/settings',
  NOT_FOUND:     '*',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
