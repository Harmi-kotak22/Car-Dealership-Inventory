import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiGrid, FiTruck } from 'react-icons/fi';
import useAuthStore from '../features/auth/store/authStore';

const navTabs = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/vehicles', label: 'Browse Vehicles', icon: FiTruck },
];

function DashboardLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="admin-page-bg min-h-screen flex flex-col">

      {/* ── Top Navbar ── */}
      <header className="admin-navbar">
        <div className="admin-navbar-inner">

          {/* Brand */}
          <div className="admin-brand">
            <span className="admin-brand-icon">◈</span>
            <div>
              <span className="admin-brand-name">Prestige Motors</span>
              <span className="admin-brand-badge" style={{ color: '#a78bfa' }}>Customer Portal</span>
            </div>
          </div>

          {/* Center tabs */}
          <nav className="admin-tabs-bar">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    `admin-tab${isActive ? ' admin-tab--active' : ''}`
                  }
                >
                  <Icon size={14} />
                  {tab.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: user + logout */}
          <div className="admin-navbar-right">
            <div className="admin-user-pill">
              <span className="admin-user-avatar">
                <FiUser size={13} />
              </span>
              <span className="admin-user-name">{user?.name || 'Customer'}</span>
            </div>
            <button className="admin-logout-btn" onClick={logout}>
              <FiLogOut size={14} />
              Logout
            </button>
          </div>

        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="admin-main">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;
