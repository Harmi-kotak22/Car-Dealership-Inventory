import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FiActivity, FiAlertTriangle, FiBarChart2, FiBox,
  FiEdit3, FiFilter, FiPlus, FiRefreshCw, FiSearch,
  FiTrash2, FiTrendingUp,
} from 'react-icons/fi';
import Modal from '../../../components/common/Modal';
import { createVehicle, deleteVehicle, getVehicles, restockVehicle, updateVehicle } from '../../../api/vehicles';

const initialForm = { make: '', model: '', category: 'SUV', price: '', quantity: '' };

function fmt$(v) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}
function fmtN(v) { return new Intl.NumberFormat('en-US').format(v); }

function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [mode, setMode] = useState('create');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [confirmType, setConfirmType] = useState('delete');
  const [restockQty, setRestockQty] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-vehicles'],
    queryFn: getVehicles,
    retry: false,
  });

  const vehicles = data?.data || [];
  const categories = useMemo(() => ['All', ...new Set(vehicles.map((v) => v.category))], [vehicles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vehicles.filter((v) => {
      const matchSearch = !q || `${v.make} ${v.model} ${v.category}`.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'All' || v.category === categoryFilter;
      const matchStock =
        stockFilter === 'All' ||
        (stockFilter === 'low' && v.quantity > 0 && v.quantity <= 5) ||
        (stockFilter === 'out' && v.quantity === 0) ||
        (stockFilter === 'healthy' && v.quantity > 5);
      return matchSearch && matchCat && matchStock;
    });
  }, [vehicles, search, categoryFilter, stockFilter]);

  const stats = useMemo(() => ({
    total: vehicles.length,
    low: vehicles.filter((v) => v.quantity > 0 && v.quantity <= 5).length,
    out: vehicles.filter((v) => v.quantity === 0).length,
    value: vehicles.reduce((s, v) => s + v.price * v.quantity, 0),
  }), [vehicles]);

  const recent = useMemo(() =>
    [...vehicles].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).slice(0, 5),
    [vehicles]);

  const reset = () => {
    setError(''); setNotice(''); setIsFormOpen(false); setIsConfirmOpen(false);
    setSelectedVehicle(null); setForm(initialForm); setRestockQty(10);
  };

  const openCreate = () => { setMode('create'); setForm(initialForm); setIsFormOpen(true); };
  const openEdit = (v) => {
    setMode('edit'); setSelectedVehicle(v);
    setForm({ make: v.make, model: v.model, category: v.category, price: String(v.price), quantity: String(v.quantity) });
    setIsFormOpen(true);
  };
  const openDelete = (v) => { setSelectedVehicle(v); setConfirmType('delete'); setIsConfirmOpen(true); };
  const openRestock = (v) => { setSelectedVehicle(v); setConfirmType('restock'); setRestockQty(10); setIsConfirmOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); setError(''); setNotice('');
    try {
      const payload = { ...form, price: Number(form.price), quantity: Number(form.quantity) };
      if (mode === 'edit' && selectedVehicle) {
        await updateVehicle(selectedVehicle.id, payload);
        setNotice(`${payload.make} ${payload.model} updated.`);
      } else {
        await createVehicle(payload);
        setNotice(`${payload.make} ${payload.model} added to inventory.`);
      }
      queryClient.invalidateQueries(['admin-vehicles']);
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save vehicle.');
    } finally { setIsSubmitting(false); }
  };

  const handleConfirm = async () => {
    if (!selectedVehicle) return;
    setIsSubmitting(true); setError(''); setNotice('');
    try {
      if (confirmType === 'delete') {
        await deleteVehicle(selectedVehicle.id);
        setNotice(`${selectedVehicle.make} ${selectedVehicle.model} removed.`);
      } else {
        await restockVehicle(selectedVehicle.id, Number(restockQty));
        setNotice(`${selectedVehicle.make} ${selectedVehicle.model} restocked by ${restockQty} units.`);
      }
      queryClient.invalidateQueries(['admin-vehicles']);
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to complete action.');
    } finally { setIsSubmitting(false); }
  };

  const stockBadge = (qty) => {
    if (qty === 0) return <span className="admin-badge admin-badge--red">Out of stock</span>;
    if (qty <= 5) return <span className="admin-badge admin-badge--amber">Low stock</span>;
    return <span className="admin-badge admin-badge--green">In stock</span>;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      {/* Page heading */}
      <div className="admin-page-heading">
        <div>
          <h1 className="admin-page-title">Inventory Overview</h1>
          <p className="admin-page-subtitle">Monitor stock levels, manage vehicles and track performance</p>
        </div>
      </div>

      {notice && <div className="admin-alert admin-alert--success">{notice}</div>}
      {error   && <div className="admin-alert admin-alert--error">{error}</div>}

      {/* Stat cards */}
      <div className="admin-stat-grid">
        <div className="admin-stat-card admin-stat-card--green">
          <div>
            <p className="admin-stat-label">Total Vehicles</p>
            <p className="admin-stat-value">{fmtN(stats.total)}</p>
          </div>
          <div className="admin-stat-icon"><FiBox /></div>
        </div>
        <div className="admin-stat-card admin-stat-card--amber">
          <div>
            <p className="admin-stat-label">Low Stock</p>
            <p className="admin-stat-value">{fmtN(stats.low)}</p>
          </div>
          <div className="admin-stat-icon"><FiTrendingUp /></div>
        </div>
        <div className="admin-stat-card admin-stat-card--red">
          <div>
            <p className="admin-stat-label">Out of Stock</p>
            <p className="admin-stat-value">{fmtN(stats.out)}</p>
          </div>
          <div className="admin-stat-icon"><FiAlertTriangle /></div>
        </div>
        <div className="admin-stat-card admin-stat-card--purple">
          <div>
            <p className="admin-stat-label">Inventory Value</p>
            <p className="admin-stat-value" style={{ fontSize: '1.4rem' }}>{fmt$(stats.value)}</p>
          </div>
          <div className="admin-stat-icon"><FiBarChart2 /></div>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="admin-two-col">

        {/* Vehicle table card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Vehicle Inventory</h3>
            <p className="admin-card-subtitle">Manage and track all vehicles in stock</p>
          </div>

          {/* Filters */}
          <div className="admin-filter-bar">
            <div className="admin-search-wrap">
              <span className="admin-search-icon"><FiSearch size={14} /></span>
              <input
                className="admin-search-input"
                placeholder="Search vehicles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="admin-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c} style={{ background: '#0d0b1a' }}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
            <select
              className="admin-select"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="All"     style={{ background: '#0d0b1a' }}>All Stock</option>
              <option value="healthy" style={{ background: '#0d0b1a' }}>In Stock</option>
              <option value="low"     style={{ background: '#0d0b1a' }}>Low Stock</option>
              <option value="out"     style={{ background: '#0d0b1a' }}>Out of Stock</option>
            </select>
          </div>

          {/* Table */}
          <div className="admin-table-wrap">
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading || isFetching ? (
                    <tr className="admin-empty-row"><td colSpan="6">Loading inventory…</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr className="admin-empty-row"><td colSpan="6">No vehicles found</td></tr>
                  ) : filtered.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <div className="admin-table-vehicle-name">{v.make} {v.model}</div>
                        <div className="admin-table-vehicle-id">#{v.id.slice(-6)}</div>
                      </td>
                      <td><span className="admin-badge admin-badge--slate">{v.category}</span></td>
                      <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{fmt$(v.price)}</td>
                      <td style={{ color: '#e2e8f0' }}>{v.quantity}</td>
                      <td>{stockBadge(v.quantity)}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button className="admin-icon-btn" title="Edit" onClick={() => openEdit(v)}>
                            <FiEdit3 size={14} />
                          </button>
                          <button className="admin-icon-btn" title="Restock" onClick={() => openRestock(v)}>
                            <FiRefreshCw size={14} />
                          </button>
                          <button className="admin-icon-btn admin-icon-btn--danger" title="Delete" onClick={() => openDelete(v)}>
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>


          {/* Recent Activity */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Recent Activity</h3>
              <p className="admin-card-subtitle">Latest inventory updates</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: '#334155' }}>No recent activity</p>
              ) : recent.map((v) => (
                <div key={v.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>
                      {v.make} {v.model}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#475569', margin: '2px 0 0' }}>
                      {v.quantity} units · {v.category}
                    </p>
                  </div>
                  {stockBadge(v.quantity)}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal open={isFormOpen} title={mode === 'edit' ? 'Edit Vehicle' : 'Add Vehicle'} onClose={reset}>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label className="admin-form-label">Make *</label>
              <input className="admin-form-input" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} placeholder="e.g. Toyota" required />
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Model *</label>
              <input className="admin-form-input" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="e.g. Camry" required />
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Category *</label>
              <select className="admin-form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['SUV', 'SEDAN', 'HATCHBACK', 'TRUCK', 'COUPE'].map((c) => (
                  <option key={c} value={c} style={{ background: '#0d0b1a' }}>{c}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Price (USD) *</label>
              <input className="admin-form-input" type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 35000" required />
            </div>
          </div>
          <div className="admin-form-field" style={{ marginBottom: 20 }}>
            <label className="admin-form-label">Quantity *</label>
            <input className="admin-form-input" type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 10" required />
          </div>
          {error && <p className="admin-form-error" style={{ marginBottom: 12 }}>{error}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="admin-action-btn admin-action-btn--secondary" style={{ border: '1px solid rgba(255,255,255,0.1)' }} onClick={reset}>Cancel</button>
            <button type="submit" className="admin-action-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete / Restock confirm */}
      <Modal open={isConfirmOpen} title={confirmType === 'delete' ? 'Delete Vehicle' : 'Restock Vehicle'} onClose={reset}>
        <div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 16, lineHeight: 1.6 }}>
            {confirmType === 'delete'
              ? `Remove ${selectedVehicle?.make} ${selectedVehicle?.model} from inventory? This cannot be undone.`
              : `Add additional stock to ${selectedVehicle?.make} ${selectedVehicle?.model}?`}
          </p>
          {confirmType === 'restock' && (
            <div className="admin-form-field" style={{ marginBottom: 16 }}>
              <label className="admin-form-label">Restock Quantity</label>
              <input className="admin-form-input" type="number" min="1" value={restockQty} onChange={(e) => setRestockQty(e.target.value)} />
            </div>
          )}
          {error && <p className="admin-form-error" style={{ marginBottom: 12 }}>{error}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="admin-action-btn admin-action-btn--secondary" style={{ border: '1px solid rgba(255,255,255,0.1)' }} onClick={reset}>Cancel</button>
            <button
              type="button"
              className="admin-action-btn"
              style={confirmType === 'delete' ? { background: '#dc2626', boxShadow: '0 4px 14px rgba(220,38,38,0.4)' } : {}}
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Working…' : confirmType === 'delete' ? 'Delete Vehicle' : 'Restock Vehicle'}
            </button>
          </div>
        </div>
      </Modal>

    </motion.div>
  );
}

export default AdminDashboardPage;
