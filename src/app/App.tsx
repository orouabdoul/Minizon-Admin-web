import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen }         from '../screens/Auth/LoginScreen/LoginScreen';
import { DashboardScreen }     from '../screens/Dashboard/DashboardScreen';
import { UsersScreen }         from '../screens/Users/UsersScreen';
import { DriversScreen }       from '../screens/Drivers/DriversScreen';
import { VehiclesScreen }      from '../screens/Vehicles/VehiclesScreen';
import { PassengersScreen }    from '../screens/Passengers/PassengersScreen';
import { TripsScreen }         from '../screens/Trips/TripsScreen';
import { ReservationsScreen }  from '../screens/Reservations/ReservationsScreen';
import { PaymentsScreen }      from '../screens/Payments/PaymentsScreen';
import { DisputesScreen }      from '../screens/Disputes/DisputesScreen';
import { SupportScreen }       from '../screens/Support/SupportScreen';
import { SettingsScreen }      from '../screens/Settings/SettingsScreen';
import { NotificationsScreen } from '../screens/Notifications/NotificationsScreen';
import { TrackingScreen }      from '../screens/Tracking/TrackingScreen';
import { MessagingScreen }     from '../screens/Messaging/MessagingScreen';
import { AuditScreen }         from '../screens/Audit/AuditScreen';
import { ReportsScreen }       from '../screens/Reports/ReportsScreen';
import { PricingScreen }       from '../screens/Pricing/PricingScreen';
import { PayoutsScreen }       from '../screens/Payouts/PayoutsScreen';
import { ReviewsScreen }       from '../screens/Reviews/ReviewsScreen';
import { ROUTES }              from '../navigation/routes';
import { useAuth }             from '../hooks/useAuth';
import { ErrorBoundary }       from '../components/Common/ErrorBoundary';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<PublicRoute><LoginScreen /></PublicRoute>} />

      <Route path={ROUTES.DASHBOARD}     element={<ProtectedRoute><ErrorBoundary><DashboardScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.USERS}         element={<ProtectedRoute><ErrorBoundary><UsersScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.DRIVERS}       element={<ProtectedRoute><ErrorBoundary><DriversScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.VEHICLES}      element={<ProtectedRoute><ErrorBoundary><VehiclesScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.PASSENGERS}    element={<ProtectedRoute><ErrorBoundary><PassengersScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.TRIPS}         element={<ProtectedRoute><ErrorBoundary><TripsScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.RESERVATIONS}  element={<ProtectedRoute><ErrorBoundary><ReservationsScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.PAYMENTS}      element={<ProtectedRoute><ErrorBoundary><PaymentsScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.DISPUTES}      element={<ProtectedRoute><ErrorBoundary><DisputesScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.SUPPORT}       element={<ProtectedRoute><ErrorBoundary><SupportScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.NOTIFICATIONS} element={<ProtectedRoute><ErrorBoundary><NotificationsScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.SETTINGS}      element={<ProtectedRoute><ErrorBoundary><SettingsScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.TRACKING}      element={<ProtectedRoute><ErrorBoundary><TrackingScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.MESSAGING}     element={<ProtectedRoute><ErrorBoundary><MessagingScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.AUDIT}         element={<ProtectedRoute><ErrorBoundary><AuditScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.REPORTS}       element={<ProtectedRoute><ErrorBoundary><ReportsScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.PRICING}       element={<ProtectedRoute><ErrorBoundary><PricingScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.PAYOUTS}       element={<ProtectedRoute><ErrorBoundary><PayoutsScreen /></ErrorBoundary></ProtectedRoute>} />
      <Route path={ROUTES.REVIEWS}       element={<ProtectedRoute><ErrorBoundary><ReviewsScreen /></ErrorBoundary></ProtectedRoute>} />

      <Route path="/"                element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
