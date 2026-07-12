import { motion } from 'framer-motion';
import { FiUser, FiShield, FiBell, FiDatabase } from 'react-icons/fi';

const settingsSections = [
  {
    icon: FiUser,
    color: 'purple',
    title: 'Profile Settings',
    subtitle: 'Update your admin profile and preferences',
    description: 'Profile management coming soon…',
  },
  {
    icon: FiShield,
    color: 'blue',
    title: 'Security',
    subtitle: 'Password and authentication settings',
    description: 'Security settings coming soon…',
  },
  {
    icon: FiBell,
    color: 'amber',
    title: 'Notifications',
    subtitle: 'Configure alert and notification preferences',
    description: 'Notification settings coming soon…',
  },
  {
    icon: FiDatabase,
    color: 'green',
    title: 'Data Management',
    subtitle: 'Backup, export, and data handling',
    description: 'Data management coming soon…',
  },
];

const iconStyles = {
  purple: { background: 'rgba(124,58,237,0.15)', color: '#a78bfa' },
  blue:   { background: 'rgba(59,130,246,0.15)',  color: '#93c5fd' },
  amber:  { background: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
  green:  { background: 'rgba(16,185,129,0.15)',  color: '#34d399' },
};

function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      <div className="admin-page-heading">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Manage your admin preferences and system configuration</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {settingsSections.map((section) => {
          const Icon = section.icon;
          const style = iconStyles[section.color];
          return (
            <div key={section.title} className="admin-card" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div className="admin-settings-icon" style={style}>
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="admin-card-title">{section.title}</h3>
                  <p className="admin-card-subtitle">{section.subtitle}</p>
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.82rem', color: '#334155' }}>{section.description}</p>
              </div>
            </div>
          );
        })}
      </div>

    </motion.div>
  );
}

export default SettingsPage;
