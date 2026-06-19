import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen }         from '../screens/Auth/LoginScreen/LoginScreen';
import { DashboardScreen }     from '../screens/Dashboard/DashboardScreen';
import { UsersScreen }         from '../screens/Users/UsersScreen';
import { DriversScreen }       from '../screens/Drivers/DriversScreen';
import { PassengersScreen }    from '../screens/Passengers/PassengersScreen';
import { TripsScreen }         from '../screens/Trips/TripsScreen';
import { ReservationsScreen }  from '../screens/Reservations/ReservationsScreen';
import { PaymentsScreen }      from '../screens/Payments/PaymentsScreen';
import { DisputesScreen }      from '../screens/Disputes/DisputesScreen';
import { SupportScreen }       from '../screens/Support/SupportScreen';
import { SettingsScreen }      from '../screens/Settings/SettingsScreen';
import { NotificationsScreen } from '../screens/Notifications/NotificationsScreen';
import { ROUTES }              from '../navigation/routes';
import { useAuth }             from '../hooks/useAuth';

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

      <Route path={ROUTES.DASHBOARD}     element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
      <Route path={ROUTES.USERS}         element={<ProtectedRoute><UsersScreen /></ProtectedRoute>} />
      <Route path={ROUTES.DRIVERS}       element={<ProtectedRoute><DriversScreen /></ProtectedRoute>} />
      <Route path={ROUTES.PASSENGERS}    element={<ProtectedRoute><PassengersScreen /></ProtectedRoute>} />
      <Route path={ROUTES.TRIPS}         element={<ProtectedRoute><TripsScreen /></ProtectedRoute>} />
      <Route path={ROUTES.RESERVATIONS}  element={<ProtectedRoute><ReservationsScreen /></ProtectedRoute>} />
      <Route path={ROUTES.PAYMENTS}      element={<ProtectedRoute><PaymentsScreen /></ProtectedRoute>} />
      <Route path={ROUTES.DISPUTES}      element={<ProtectedRoute><DisputesScreen /></ProtectedRoute>} />
      <Route path={ROUTES.SUPPORT}       element={<ProtectedRoute><SupportScreen /></ProtectedRoute>} />
      <Route path={ROUTES.NOTIFICATIONS} element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />
      <Route path={ROUTES.SETTINGS}      element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />

      <Route path="/"                element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
