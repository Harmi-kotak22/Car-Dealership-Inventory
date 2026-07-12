import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

const tabs = [
  { path: '/login', label: 'Login', icon: <FiLogIn size={13} /> },
  { path: '/register', label: 'Register', icon: <FiUserPlus size={13} /> },
];

function AuthLayout() {
  const location = useLocation();

  return (
    <div className="auth-page-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Brand wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span className="auth-brand-pill">◈ Prestige Motors</span>
          <p className="auth-brand-sub">Premium Dealership Management System</p>
        </div>

        {/* Card */}
        <div className="auth-card">

          {/* Tab pills */}
          <div className="auth-card-badge-row">
            {tabs.map((tab) => {
              const active = location.pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`auth-tab-pill${active ? ' auth-tab-pill--active' : ''}`}
                >
                  {tab.icon}
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Form content */}
          <div className="auth-card-body">
            <Outlet />
          </div>

        </div>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#1e293b', marginTop: 20 }}>
          © {new Date().getFullYear()} Prestige Motors · All rights reserved
        </p>

      </div>
    </div>
  );
}

export default AuthLayout;
