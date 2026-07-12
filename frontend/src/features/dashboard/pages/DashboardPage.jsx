import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FiTruck, FiTag, FiAlertTriangle, FiArrowRight, FiCheckCircle, FiLayers } from 'react-icons/fi';
import useAuthStore from '../../auth/store/authStore';
import { searchVehicles } from '../../../api/vehicles';

function fmt$(v) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles-summary'],
    queryFn: () => searchVehicles({}),
    retry: false,
  });

  const vehicles = data?.data || [];

  const stats = useMemo(() => {
    const available = vehicles.filter((v) => v.quantity > 0).length;
    const categories = new Set(vehicles.map((v) => v.category)).size;
    const minPrice = vehicles.length ? Math.min(...vehicles.map((v) => v.price)) : 0;
    const maxPrice = vehicles.length ? Math.max(...vehicles.map((v) => v.price)) : 0;
    const lowStock = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 5).length;
    return { available, categories, minPrice, maxPrice, lowStock };
  }, [vehicles]);

  const features = [
    { icon: FiCheckCircle, color: '#34d399', text: 'Real-time stock availability across all categories' },
    { icon: FiCheckCircle, color: '#34d399', text: 'Filter by category, price range, and sort order' },
    { icon: FiCheckCircle, color: '#34d399', text: 'One-click purchase directly from the dashboard' },
    { icon: FiCheckCircle, color: '#34d399', text: 'Instant confirmation and purchase history' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      {/* Welcome banner */}
      <div className="cust-welcome-card">
        <div>
          <h1 className="cust-welcome-title">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="cust-welcome-sub">
            Browse our premium vehicle inventory, compare prices, and make your next purchase with confidence.
          </p>
        </div>
        <Link to="/vehicles" className="admin-action-btn" style={{ flexShrink: 0 }}>
          Browse Vehicles <FiArrowRight size={14} />
        </Link>
      </div>

      {/* Live stat cards */}
      <div className="cust-stat-grid">
        <div className="cust-stat-card">
          <div className="cust-stat-icon-wrap">
            <div>
              <p className="cust-stat-label">Available Vehicles</p>
              <p className="cust-stat-value">
                {isLoading ? '—' : stats.available}
              </p>
              <p className="cust-stat-sub">Ready for purchase</p>
            </div>
            <div className="cust-stat-icon" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>
              <FiTruck size={20} />
            </div>
          </div>
        </div>

        <div className="cust-stat-card">
          <div className="cust-stat-icon-wrap">
            <div>
              <p className="cust-stat-label">Categories</p>
              <p className="cust-stat-value">
                {isLoading ? '—' : stats.categories}
              </p>
              <p className="cust-stat-sub">Vehicle types in stock</p>
            </div>
            <div className="cust-stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd' }}>
              <FiLayers size={20} />
            </div>
          </div>
        </div>

        <div className="cust-stat-card">
          <div className="cust-stat-icon-wrap">
            <div>
              <p className="cust-stat-label">Starting From</p>
              <p className="cust-stat-value" style={{ fontSize: '1.4rem' }}>
                {isLoading ? '—' : fmt$(stats.minPrice)}
              </p>
              <p className="cust-stat-sub">Up to {isLoading ? '—' : fmt$(stats.maxPrice)}</p>
            </div>
            <div className="cust-stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
              <FiTag size={20} />
            </div>
          </div>
        </div>

        <div className="cust-stat-card">
          <div className="cust-stat-icon-wrap">
            <div>
              <p className="cust-stat-label">Low Stock Alerts</p>
              <p className="cust-stat-value">
                {isLoading ? '—' : stats.lowStock}
              </p>
              <p className="cust-stat-sub">Act fast — limited units</p>
            </div>
            <div className="cust-stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
              <FiAlertTriangle size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Two-column lower section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* Featured / intro card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Your Customer Dashboard</h3>
            <p className="admin-card-subtitle">Everything you need to find and purchase your next vehicle</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <Icon size={16} style={{ color: f.color, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>{f.text}</span>
                </div>
              );
            })}
          </div>

          <Link to="/vehicles" className="admin-action-btn" style={{ display: 'inline-flex' }}>
            View Inventory <FiArrowRight size={14} />
          </Link>
        </div>

        {/* Quick info card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Need Help?</h3>
              <p className="admin-card-subtitle">We're here to assist you</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Pricing & Financing', desc: 'Get competitive rates on any vehicle' },
                { label: 'Test Drive Booking', desc: 'Schedule at your convenience' },
                { label: 'Delivery Options', desc: 'Doorstep delivery available' },
              ].map((item) => (
                <div key={item.label} style={{
                  padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 3px' }}>{item.label}</p>
                  <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card" style={{ background: 'rgba(124,58,237,0.08)', borderColor: 'rgba(124,58,237,0.2)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7c3aed', margin: '0 0 8px' }}>
              Prestige Motors
            </p>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              A premium dealership experience — curated inventory, transparent pricing, and effortless purchasing.
            </p>
          </div>
        </div>
      </div>

    </motion.div>
  );
}

export default DashboardPage;
