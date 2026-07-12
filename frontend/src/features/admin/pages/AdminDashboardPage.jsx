import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiActivity, FiAlertTriangle, FiBarChart2, FiBox, FiChevronRight, FiEdit3, FiFilter, FiPlus, FiRefreshCw, FiSearch, FiTrash2, FiTrendingUp } from 'react-icons/fi';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/common/Modal';
import PageHeader from '../../../components/ui/PageHeader';
import { createVehicle, deleteVehicle, getVehicles, restockVehicle, updateVehicle } from '../../../api/vehicles';

const initialForm = {
  make: '',
  model: '',
  category: 'SUV',
  price: '',
  quantity: '',
};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState('overview');
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

  const { data, isLoading, isFetching, isError, error: queryError } = useQuery({
    queryKey: ['admin-vehicles'],
    queryFn: getVehicles,
    retry: false,
    onError: (err) => {
      setError(err.response?.data?.message || 'Unable to load inventory.');
    },
  });

  const vehicles = data?.data || [];

  const categories = useMemo(() => ['All', ...new Set(vehicles.map((vehicle) => vehicle.category))], [vehicles]);

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesSearch = !query || `${vehicle.make} ${vehicle.model} ${vehicle.category}`.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === 'All' || vehicle.category === categoryFilter;
      const matchesStock =
        stockFilter === 'All' ||
        (stockFilter === 'low' && vehicle.quantity > 0 && vehicle.quantity <= 5) ||
        (stockFilter === 'out' && vehicle.quantity === 0) ||
        (stockFilter === 'healthy' && vehicle.quantity > 5);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [vehicles, search, categoryFilter, stockFilter]);

  const statistics = useMemo(() => {
    const totalVehicles = vehicles.length;
    const lowStock = vehicles.filter((vehicle) => vehicle.quantity > 0 && vehicle.quantity <= 5).length;
    const outOfStock = vehicles.filter((vehicle) => vehicle.quantity === 0).length;
    const inventoryValue = vehicles.reduce((sum, vehicle) => sum + vehicle.price * vehicle.quantity, 0);

    return { totalVehicles, lowStock, outOfStock, inventoryValue };
  }, [vehicles]);

  const categoryBreakdown = useMemo(() => {
    const grouped = vehicles.reduce((acc, vehicle) => {
      acc[vehicle.category] = (acc[vehicle.category] || 0) + vehicle.quantity;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [vehicles]);

  const recentActivity = useMemo(() => {
    return [...vehicles]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5);
  }, [vehicles]);

  const resetState = () => {
    setError('');
    setNotice('');
    setIsFormOpen(false);
    setIsConfirmOpen(false);
    setSelectedVehicle(null);
    setForm(initialForm);
    setRestockQty(10);
  };

  const openCreateModal = () => {
    setMode('create');
    setForm(initialForm);
    setIsFormOpen(true);
  };

  const openEditModal = (vehicle) => {
    setMode('edit');
    setSelectedVehicle(vehicle);
    setForm({
      make: vehicle.make,
      model: vehicle.model,
      category: vehicle.category,
      price: String(vehicle.price),
      quantity: String(vehicle.quantity),
    });
    setIsFormOpen(true);
  };

  const openDeleteConfirm = (vehicle) => {
    setSelectedVehicle(vehicle);
    setConfirmType('delete');
    setIsConfirmOpen(true);
  };

  const openRestockConfirm = (vehicle) => {
    setSelectedVehicle(vehicle);
    setConfirmType('restock');
    setRestockQty(10);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setNotice('');

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
      };

      if (mode === 'edit' && selectedVehicle) {
        await updateVehicle(selectedVehicle.id, payload);
        setNotice(`${payload.make} ${payload.model} updated successfully.`);
      } else {
        await createVehicle(payload);
        setNotice(`${payload.make} ${payload.model} added to inventory.`);
      }

      queryClient.invalidateQueries(['admin-vehicles']);
      resetState();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save vehicle.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedVehicle) return;

    setIsSubmitting(true);
    setError('');
    setNotice('');

    try {
      if (confirmType === 'delete') {
        await deleteVehicle(selectedVehicle.id);
        setNotice(`${selectedVehicle.make} ${selectedVehicle.model} removed from inventory.`);
      } else {
        await restockVehicle(selectedVehicle.id, Number(restockQty));
        setNotice(`${selectedVehicle.make} ${selectedVehicle.model} restocked by ${restockQty} units.`);
      }

      queryClient.invalidateQueries(['admin-vehicles']);
      resetState();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to complete action.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
            <p className="mt-2 text-slate-400">Monitor stock levels, manage vehicles, and track inventory performance</p>
          </div>
          <Button onClick={openCreateModal} className="bg-violet-600 hover:bg-violet-500"><FiPlus className="mr-2" />Add Vehicle</Button>
        </div>

        {notice ? <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{notice}</div> : null}
        {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-emerald-500/20 bg-emerald-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-300">Total Vehicles</p>
                <h3 className="mt-2 text-3xl font-bold text-white">{formatNumber(statistics.totalVehicles)}</h3>
              </div>
              <FiBox className="text-3xl text-emerald-300" />
            </div>
          </Card>
          <Card className="border-amber-500/20 bg-amber-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-300">Low Stock</p>
                <h3 className="mt-2 text-3xl font-bold text-white">{formatNumber(statistics.lowStock)}</h3>
              </div>
              <FiTrendingUp className="text-3xl text-amber-300" />
            </div>
          </Card>
          <Card className="border-rose-500/20 bg-rose-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-rose-300">Out of Stock</p>
                <h3 className="mt-2 text-3xl font-bold text-white">{formatNumber(statistics.outOfStock)}</h3>
              </div>
              <FiAlertTriangle className="text-3xl text-rose-300" />
            </div>
          </Card>
          <Card className="border-violet-500/20 bg-violet-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-violet-300">Inventory Value</p>
                <h3 className="mt-2 text-3xl font-bold text-white">{formatCurrency(statistics.inventoryValue)}</h3>
              </div>
              <FiBarChart2 className="text-3xl text-violet-300" />
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-white/10 bg-[#071019]/90">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Vehicle Inventory</h3>
              <p className="mt-1 text-sm text-slate-400">Manage and track all vehicles in stock</p>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search vehicles..."
                  className="w-full rounded-lg border border-white/10 bg-[#070b12] pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-violet-500"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-lg border border-white/10 bg-[#070b12] px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-[#070b12] text-white">
                    {category === 'All' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <select
                value={stockFilter}
                onChange={(event) => setStockFilter(event.target.value)}
                className="rounded-lg border border-white/10 bg-[#070b12] px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500"
              >
                <option value="All" className="bg-[#070b12] text-white">All Stock Levels</option>
                <option value="healthy" className="bg-[#070b12] text-white">Healthy</option>
                <option value="low" className="bg-[#070b12] text-white">Low Stock</option>
                <option value="out" className="bg-[#070b12] text-white">Out of Stock</option>
              </select>
            </div>

            <div className="overflow-hidden rounded-lg border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-left">
                  <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Vehicle</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Price</th>
                      <th className="px-4 py-3 font-semibold">Stock</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-[#050b12]/90 text-sm text-slate-200">
                    {isLoading || isFetching ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-slate-400">Loading inventory...</td>
                      </tr>
                    ) : filteredVehicles.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-slate-400">No vehicles found</td>
                      </tr>
                    ) : (
                      filteredVehicles.map((vehicle) => {
                        const stockLabel = vehicle.quantity === 0 ? 'Out of stock' : vehicle.quantity <= 5 ? 'Low stock' : 'In stock';
                        const statusColor = vehicle.quantity === 0 ? 'bg-rose-500/20 text-rose-200' : vehicle.quantity <= 5 ? 'bg-amber-500/20 text-amber-200' : 'bg-emerald-500/20 text-emerald-200';
                        return (
                          <tr key={vehicle.id} className="hover:bg-white/5">
                            <td className="px-4 py-3">
                              <div className="font-medium text-white">{vehicle.make} {vehicle.model}</div>
                              <div className="mt-0.5 text-xs text-slate-500">ID: {vehicle.id.slice(-6)}</div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-300">{vehicle.category}</span>
                            </td>
                            <td className="px-4 py-3 font-medium text-white">{formatCurrency(vehicle.price)}</td>
                            <td className="px-4 py-3 text-white">{vehicle.quantity}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColor}`}>
                                {stockLabel}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openEditModal(vehicle)}
                                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                                  title="Edit"
                                >
                                  <FiEdit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => openRestockConfirm(vehicle)}
                                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                                  title="Restock"
                                >
                                  <FiRefreshCw className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => openDeleteConfirm(vehicle)}
                                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
                                  title="Delete"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-[#071019]/90">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                <p className="mt-1 text-sm text-slate-400">Common inventory tasks</p>
              </div>
              <div className="space-y-2">
                <Button onClick={openCreateModal} className="w-full justify-start bg-violet-600 hover:bg-violet-500">
                  <FiPlus className="mr-2" />Add New Vehicle
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <FiRefreshCw className="mr-2" />Bulk Restock
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <FiActivity className="mr-2" />View Activity Log
                </Button>
              </div>
            </Card>

            <Card className="border-white/10 bg-[#071019]/90">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <p className="mt-1 text-sm text-slate-400">Latest inventory updates</p>
              </div>
              <div className="space-y-3">
                {recentActivity.length > 0 ? recentActivity.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-start justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{vehicle.make} {vehicle.model}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{vehicle.quantity} units · {vehicle.category}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${vehicle.quantity === 0 ? 'bg-rose-500/20 text-rose-200' : vehicle.quantity <= 5 ? 'bg-amber-500/20 text-amber-200' : 'bg-emerald-500/20 text-emerald-200'}`}>
                      {vehicle.quantity === 0 ? 'Out' : vehicle.quantity <= 5 ? 'Low' : 'OK'}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400">No recent activity</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal open={isFormOpen} title={mode === 'edit' ? 'Edit vehicle' : 'Add vehicle'} onClose={resetState}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block font-medium">Make</span>
              <input value={form.make} onChange={(event) => setForm({ ...form, make: event.target.value })} className="w-full rounded-lg border border-white/10 bg-[#070b12] px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500" required />
            </label>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block font-medium">Model</span>
              <input value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value })} className="w-full rounded-lg border border-white/10 bg-[#070b12] px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500" required />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block font-medium">Category</span>
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="w-full rounded-lg border border-white/10 bg-[#070b12] px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500">
                {['SUV', 'SEDAN', 'HATCHBACK', 'TRUCK', 'COUPE'].map((category) => <option key={category} value={category} className="bg-[#070b12] text-white">{category}</option>)}
              </select>
            </label>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block font-medium">Price</span>
              <input type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="w-full rounded-lg border border-white/10 bg-[#070b12] px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500" required />
            </label>
          </div>

          <label className="block text-sm text-slate-300">
            <span className="mb-2 block font-medium">Quantity</span>
            <input type="number" min="0" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} className="w-full rounded-lg border border-white/10 bg-[#070b12] px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500" required />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={resetState}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save changes' : 'Create vehicle'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={isConfirmOpen} title={confirmType === 'delete' ? 'Delete vehicle' : 'Restock vehicle'} onClose={resetState}>
        <div className="space-y-4">
          <p className="text-sm leading-6 text-slate-300">
            {confirmType === 'delete'
              ? `Remove ${selectedVehicle?.make} ${selectedVehicle?.model} from the inventory list?`
              : `Add extra stock to ${selectedVehicle?.make} ${selectedVehicle?.model}?`}
          </p>
          {confirmType === 'restock' ? (
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block font-medium">Restock quantity</span>
              <input type="number" min="1" value={restockQty} onChange={(event) => setRestockQty(event.target.value)} className="w-full rounded-lg border border-white/10 bg-[#070b12] px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500" />
            </label>
          ) : null}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={resetState}>Cancel</Button>
            <Button type="button" variant={confirmType === 'delete' ? 'danger' : 'primary'} onClick={handleConfirmAction} disabled={isSubmitting}>
              {isSubmitting ? 'Working...' : confirmType === 'delete' ? 'Delete vehicle' : 'Restock vehicle'}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

export default AdminDashboardPage;
