import { motion } from 'framer-motion';
import { FiMail, FiBell, FiSave } from 'react-icons/fi';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSettings, updateSettings } from '../../../api/settings';

function SettingsPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  });

  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      alert('Settings saved successfully!');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateMutation.mutate({
      email: formData.get('email'),
      emailPassword: formData.get('emailPassword'),
      purchaseNotifications: formData.get('purchaseNotifications') === 'true',
      lowStockNotifications: formData.get('lowStockNotifications') === 'true',
      lowStockThreshold: parseInt(formData.get('lowStockThreshold')) || 5
    });
  };

  if (isLoading) {
    return <div style={{ color: '#94a3b8' }}>Loading settings...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      <div className="admin-page-heading">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Manage your admin preferences and system configuration</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        {/* Email Settings */}
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">Email Configuration</h3>
            <p className="admin-card-subtitle">Configure Gmail for notifications</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: 6 }}>
                Gmail Address
              </label>
              <input
                type="email"
                name="email"
                defaultValue={settings?.data?.email || ''}
                placeholder="your@gmail.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#e2e8f0',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: 6 }}>
                Gmail App Password
              </label>
              <input
                type="password"
                name="emailPassword"
                defaultValue={settings?.data?.emailPassword || ''}
                placeholder="Enter app password"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#e2e8f0',
                  fontSize: '0.9rem'
                }}
              />
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                Use an App Password from Google Account settings
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">Notifications</h3>
            <p className="admin-card-subtitle">Configure alert preferences</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 500 }}>
                  Purchase Notifications
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                  Notify when a customer purchases a vehicle
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="purchaseNotifications"
                  defaultChecked={settings?.data?.purchaseNotifications || false}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Enabled</span>
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 500 }}>
                  Low Stock Alerts
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                  Notify when stock falls below threshold
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="lowStockNotifications"
                  defaultChecked={settings?.data?.lowStockNotifications || false}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Enabled</span>
              </label>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: 6 }}>
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                defaultValue={settings?.data?.lowStockThreshold || 5}
                min="1"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#e2e8f0',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="admin-action-btn"
          style={{ width: 'fit-content', minWidth: 140 }}
        >
          <FiSave size={14} />
          {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

    </motion.div>
  );
}

export default SettingsPage;
