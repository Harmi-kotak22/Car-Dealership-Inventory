import { Link, Outlet, useLocation } from 'react-router-dom';

function AuthLayout() {
  const location = useLocation();
  const tabs = [
    { path: '/login', label: 'Sign In' },
    { path: '/register', label: 'Create Account' },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.18),_transparent_30%),linear-gradient(135deg,_#06050c,_#100d1d,_#19112a,_#06050c)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10">
        <div className="w-full max-w-3xl">
          <div className="mb-8 flex flex-col gap-4 rounded-[36px] border border-white/10 bg-[#0f0b1c]/75 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-8 sm:py-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="inline-flex items-center gap-3 rounded-3xl bg-white/5 px-4 py-3 text-sm font-semibold text-violet-300 shadow-[0_10px_45px_rgba(124,58,237,0.12)]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600/15 text-violet-200">◈</span>
                Prestige Motors
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-400">
                A premium inventory system built for elegant dealerships.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[40px] border border-white/10 bg-[#08050f]/90 shadow-[0_42px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="border-b border-white/10 bg-[#09070f]/90 px-6 py-4 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Dealer portal</p>
                  <h1 className="mt-2 text-2xl font-semibold text-white">Access your dashboard</h1>
                </div>

                <div className="inline-flex rounded-full bg-white/5 p-1">
                  {tabs.map((tab) => {
                    const active = location.pathname === tab.path;
                    return (
                      <Link
                        key={tab.path}
                        to={tab.path}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                          active
                            ? 'bg-violet-500 text-white shadow-[0_10px_30px_rgba(124,58,237,0.25)]'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
