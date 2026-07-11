import { Routes, Route } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

function Router() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/register" element={<div>Register Page</div>} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/" element={<div>Dashboard Page</div>} />
        <Route path="/vehicles" element={<div>Vehicles Page</div>} />
      </Route>
    </Routes>
  );
}

export default Router;
