import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import LandingPage from '../features/landing/pages/LandingPage';
import VehiclesPage from '../features/vehicle/pages/VehiclesPage';
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import AddVehiclePage from '../features/admin/pages/AddVehiclePage';
import EditVehiclePage from '../features/admin/pages/EditVehiclePage';
import VehicleListPage from '../features/admin/pages/VehicleListPage';
import SettingsPage from '../features/admin/pages/SettingsPage';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';
import useAuthStore from '../features/auth/store/authStore';

function Router() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} user={user} requiredRole="CUSTOMER" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} user={user} requiredRole="ADMIN" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/add-vehicle" element={<AddVehiclePage />} />
          <Route path="/admin/vehicles" element={<VehicleListPage />} />
          <Route path="/admin/edit/:id" element={<EditVehiclePage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default Router;
