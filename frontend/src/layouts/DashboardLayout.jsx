import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/vehicles', label: 'Vehicles' },
];

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.2),_transparent_25%),linear-gradient(135deg,_#06050c,_#100d1d,_#19112a,_#06050c)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[#0f0b1c]/80 px-6 py-5 shadow-[0_20px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-violet-300">Car Dealership</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Inventory Command Center</h2>
          </div>

          <nav className="flex gap-2 rounded-full border border-white/10 bg-white/10 p-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="rounded-[32px] border border-white/10 bg-[#0f0b1c]/70 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
