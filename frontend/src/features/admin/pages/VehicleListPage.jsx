import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEdit3, FiRefreshCw, FiTrash2, FiSearch } from 'react-icons/fi';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import Toast from '../../../components/common/Toast';
import { getVehicles, deleteVehicle, restockVehicle } from '../../../api/vehicles';

function fmt$(v) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

function VehicleListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, vehicle: null });
  const [restockQty, setRestockQty] = useState(10);
  const [toast, setToast] = useState(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-vehicles'],
    queryFn: getVehicles,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      setToast({ message: 'Vehicle deleted successfully', type: 'success' });
      queryClient.invalidateQueries(['admin-vehicles']);
      setConfirmDialog({ open: false, type: null, vehicle: null });
    },
    onError: (err) => {
      setToast({ message: err.response?.data?.message || 'Failed to delete vehicle', type: 'error' });
    },
  });

  const restockMutation = useMutation({
    mutationFn: ({ vehicleId, quantity }) => restockVehicle(vehicleId, quantity),
    onSuccess: () => {
      setToast({ message: 'Vehicle restocked successfully', type: 'success' });
      queryClient.invalidateQueries(['admin-vehicles']);
      setConfirmDialog({ open: false, type: null, vehicle: null });
      setRestockQty(10);
    },
    onError: (err) => {
      setToast({ message: err.response?.data?.message || 'Failed to restock vehicle', type: 'error' });
    },
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

  const handleDelete = (vehicle) => {
    setConfirmDialog({ open: true, type: 'delete', vehicle, title: 'Delete Vehicle', message: `Are you sure you want to delete ${vehicle.make} ${vehicle.model}? This cannot be undone.` });
  };

  const handleRestock = (vehicle) => {
    setConfirmDialog({ open: true, type: 'restock', vehicle, title: 'Restock Vehicle', message: `Add additional stock to ${vehicle.make} ${vehicle.model}?` });
  };

  const handleConfirm = () => {
    if (confirmDialog.type === 'delete') {
      deleteMutation.mutate(confirmDialog.vehicle.id);
    } else if (confirmDialog.type === 'restock') {
      restockMutation.mutate({ vehicleId: confirmDialog.vehicle.id, quantity: Number(restockQty) });
    }
  };

  const stockBadge = (qty) => {
    if (qty === 0) return <span className="admin-badge admin-badge--red">Out of stock</span>;
    if (qty <= 5) return <span className="admin-badge admin-badge--amber">Low stock</span>;
    return <span className="admin-badge admin-badge--green">In stock</span>;
  };

  const isProcessing = deleteMutation.isPending || restockMutation.isPending;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      <div className="admin-page-heading">
        <div>
          <h1 className="admin-page-title">Vehicle Inventory</h1>
          <p className="admin-page-subtitle">Manage and track all vehicles in stock</p>
        </div>
        <span style={{ fontSize: '0.82rem', color: '#475569' }}>
          {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} found
        </span>
      </div>

      <div className="admin-card">

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
          <select className="admin-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c} style={{ background: '#0d0b1a' }}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>
          <select className="admin-select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
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
                        <button className="admin-icon-btn" title="Edit" onClick={() => navigate(`/admin/edit/${v.id}`)}>
                          <FiEdit3 size={14} />
                        </button>
                        <button className="admin-icon-btn" title="Restock" onClick={() => handleRestock(v)}>
                          <FiRefreshCw size={14} />
                        </button>
                        <button className="admin-icon-btn admin-icon-btn--danger" title="Delete" onClick={() => handleDelete(v)}>
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

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: null, vehicle: null })}
        onConfirm={handleConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        isSubmitting={isProcessing}
      >
        {confirmDialog.type === 'restock' && (
          <div className="admin-form-field" style={{ marginTop: 12 }}>
            <label className="admin-form-label">Restock Quantity</label>
            <input
              type="number" min="1" value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
              className="admin-form-input"
            />
          </div>
        )}
      </ConfirmDialog>

      {toast && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }}>
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </motion.div>
  );
}

export default VehicleListPage;
