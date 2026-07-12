import { NavLink, Outlet } from 'react-router-dom';
import { FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import useAuthStore from '../features/auth/store/authStore';

const links = [
  { to: '/admin', label: 'Dashboard' },
];

function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.15),_transparent_25%),linear-gradient(135deg,_#020617,_#0a1628,_#0f172a,_#020617)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-cyan-500/20 bg-[#0a1628]/90 px-6 py-5 shadow-[0_20px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Admin Console</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Prestige Motors Management</h2>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 p-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' : 'text-slate-300 hover:bg-cyan-500/20 hover:text-white'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">
              <FiUser className="text-cyan-400" />
              <span className="text-sm font-medium text-white">{user?.name || 'Admin'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </header>

        <main className="rounded-[32px] border border-cyan-500/20 bg-[#0a1628]/70 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
