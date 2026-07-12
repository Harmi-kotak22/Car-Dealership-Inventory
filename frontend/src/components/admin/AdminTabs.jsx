import { NavLink } from 'react-router-dom';
import { FiLayout, FiPlus, FiList, FiEdit3, FiSettings } from 'react-icons/fi';

const tabs = [
  { to: '/admin', label: 'Dashboard', icon: FiLayout },
  { to: '/admin/add-vehicle', label: 'Add Vehicle', icon: FiPlus },
  { to: '/admin/vehicles', label: 'Vehicle List', icon: FiList },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
];

function AdminTabs() {
  return (
    <nav className="flex gap-2 rounded-lg border border-white/10 bg-white/5 p-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default AdminTabs;
