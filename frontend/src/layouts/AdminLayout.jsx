import { Outlet, useLocation } from 'react-router-dom';
import { FiLogOut, FiUser, FiLayout, FiPlus, FiList, FiSettings } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../features/auth/store/authStore';

const navTabs = [
  { to: '/admin', label: 'Dashboard', icon: FiLayout, end: true },
  { to: '/admin/vehicles', label: 'Vehicles', icon: FiList },
  { to: '/admin/add-vehicle', label: 'Add Vehicle', icon: FiPlus },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
];

function AdminLayout() {
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
              <span className="admin-brand-badge">Admin Console</span>
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
              <span className="admin-user-name">{user?.name || 'Admin'}</span>
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

export default AdminLayout;
