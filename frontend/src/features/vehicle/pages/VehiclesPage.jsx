import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiSearch, FiShoppingCart, FiCheckCircle, FiClock, FiShoppingBag } from 'react-icons/fi';
import Toast from '../../../components/common/Toast';
import PurchaseConfirmDialog from '../../../components/customer/PurchaseConfirmDialog';
import { searchVehicles, purchaseVehicle } from '../../../api/vehicles';

const pageSize = 9;

const sortOptions = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-low',  label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
];

function fmt$(v) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

function stockBadge(qty) {
  if (qty === 0) return { label: 'Out of Stock', cls: 'cust-vehicle-stock-badge--out' };
  if (qty <= 5)  return { label: 'Low Stock',    cls: 'cust-vehicle-stock-badge--low' };
  return           { label: 'Available',          cls: 'cust-vehicle-stock-badge--available' };
}

function VehiclesPage() {
  const queryClient = useQueryClient();
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort,     setSort]     = useState('newest');
  const [page,     setPage]     = useState(1);
  const [purchaseDialog, setPurchaseDialog] = useState({ open: false, vehicle: null });
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [toast,  setToast]  = useState(null);
  const [justPurchasedId, setJustPurchasedId] = useState(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['vehicles', search, category, minPrice, maxPrice],
    queryFn: () =>
      searchVehicles({
        make: search || undefined,
        model: search || undefined,
        category: category === 'All' ? undefined : category,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      }),
    retry: false,
    keepPreviousData: true,
  });

  const vehicles = data?.data || [];

  useEffect(() => { setPage(1); }, [search, category, minPrice, maxPrice, sort]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(vehicles.map((v) => v.category)))],
    [vehicles]
  );

  const sorted = useMemo(() => {
    return [...vehicles].sort((a, b) => {
      if (sort === 'price-low')  return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [vehicles, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated  = sorted.slice((page - 1) * pageSize, page * pageSize);

  const purchaseMutation = useMutation({
    mutationFn: purchaseVehicle,
    onSuccess: (res) => {
      const v = res.data;
      setPurchaseHistory((prev) => [{ ...v, purchasedAt: new Date() }, ...prev].slice(0, 5));
      setToast({ message: `Successfully purchased ${v.make} ${v.model}!`, type: 'success' });
      setJustPurchasedId(v.id);
      setTimeout(() => setJustPurchasedId(null), 2000);
      queryClient.invalidateQueries(['vehicles', search, category, minPrice, maxPrice]);
      queryClient.invalidateQueries(['vehicles-summary']);
      setPurchaseDialog({ open: false, vehicle: null });
    },
    onError: (err) => {
      setToast({ message: err.response?.data?.message || 'Unable to complete purchase', type: 'error' });
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      {/* Page heading */}
      <div className="admin-page-heading">
        <div>
          <h1 className="admin-page-title">Browse Vehicles</h1>
          <p className="admin-page-subtitle">Explore our full inventory — filter, sort and purchase with ease</p>
        </div>
        {purchaseHistory.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#7c3aed', fontWeight: 600 }}>
            <FiShoppingBag size={14} />
            {purchaseHistory.length} purchase{purchaseHistory.length > 1 ? 's' : ''} this session
          </div>
        )}
      </div>

      {/* ── Filter bar ── */}
      <div className="cust-filter-bar">
        {/* Search */}
        <div className="cust-filter-search-wrap">
          <span className="cust-filter-search-icon"><FiSearch size={14} /></span>
          <input
            className="cust-filter-input"
            placeholder="Search make or model…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span className="cust-filter-label">Type</span>
          <select
            className="cust-filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c} style={{ background: '#0d0b1a' }}>{c}</option>
            ))}
          </select>
        </div>

        {/* Price range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span className="cust-filter-label">Price</span>
          <div className="cust-filter-price-pair">
            <input
              type="number" min="0"
              className="cust-filter-price-input"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="cust-filter-price-sep">–</span>
            <input
              type="number" min="0"
              className="cust-filter-price-input"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span className="cust-filter-label">Sort</span>
          <select
            className="cust-filter-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value} style={{ background: '#0d0b1a' }}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="cust-results-bar">
        <p className="cust-results-count">
          Showing <strong>{paginated.length}</strong> of <strong>{sorted.length}</strong> vehicles
        </p>
        {(search || category !== 'All' || minPrice || maxPrice) && (
          <button
            onClick={() => { setSearch(''); setCategory('All'); setMinPrice(''); setMaxPrice(''); }}
            style={{ fontSize: '0.78rem', color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Clear filters ×
          </button>
        )}
      </div>

      {/* ── Vehicle grid ── */}
      <AnimatePresence mode="wait">
        {isLoading || isFetching ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="cust-vehicle-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                borderRadius: 20, overflow: 'hidden',
                background: 'rgba(15,10,30,0.75)', border: '1px solid rgba(255,255,255,0.06)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}>
                <div style={{ height: 180, background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ height: 14, width: '60%', borderRadius: 8, background: 'rgba(255,255,255,0.04)', marginBottom: 10 }} />
                  <div style={{ height: 18, width: '80%', borderRadius: 8, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />
                  <div style={{ height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)' }} />
                </div>
              </div>
            ))}
          </motion.div>
        ) : paginated.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="cust-empty-state">
            <FiSearch size={36} style={{ color: '#334155', margin: '0 auto' }} />
            <p className="cust-empty-title">No vehicles found</p>
            <p className="cust-empty-sub">
              Try adjusting your search, changing the category, or clearing the price range filters.
            </p>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="cust-vehicle-grid">
            {paginated.map((v) => {
              const badge = stockBadge(v.quantity);
              const isJustPurchased = justPurchasedId === v.id;
              return (
                <motion.div
                  key={v.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="cust-vehicle-card"
                >
                  {/* Success overlay */}
                  {isJustPurchased && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="cust-success-overlay"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        style={{ background: '#fff', borderRadius: '50%', padding: 14 }}
                      >
                        <FiCheckCircle size={36} style={{ color: '#10b981' }} />
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Image */}
                  <div className="cust-vehicle-img-wrap">
                    {v.image ? (
                      <img src={v.image} alt={`${v.make} ${v.model}`} className="cust-vehicle-img" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b', fontSize: '2.5rem' }}>
                        🚗
                      </div>
                    )}
                    <span className={`cust-vehicle-stock-badge ${badge.cls}`}>{badge.label}</span>
                  </div>

                  {/* Body */}
                  <div className="cust-vehicle-body">
                    <div className="cust-vehicle-meta">
                      <div>
                        <p className="cust-vehicle-year">{new Date(v.createdAt).getFullYear()}</p>
                        <h3 className="cust-vehicle-name">{v.make} {v.model}</h3>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p className="cust-vehicle-price">{fmt$(v.price)}</p>
                        <p className="cust-vehicle-stock-count">
                          {v.quantity === 0 ? 'No stock' : `${v.quantity} left`}
                        </p>
                      </div>
                    </div>

                    <p className="cust-vehicle-desc">
                      Premium build quality, advanced safety systems, and an elevated driving experience.
                    </p>

                    <div className="cust-vehicle-footer">
                      <span className="cust-category-pill">{v.category}</span>
                      <button
                        className="cust-purchase-btn"
                        disabled={v.quantity === 0}
                        onClick={() => setPurchaseDialog({ open: true, vehicle: v })}
                      >
                        {v.quantity === 0 ? 'Out of Stock' : (
                          <><FiShoppingCart size={13} /> Purchase</>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pagination ── */}
      {!isLoading && !isFetching && sorted.length > pageSize && (
        <div className="cust-pagination">
          <span>Page {page} of {totalPages}</span>
          <div className="cust-pagination-btns">
            <button
              className="cust-pagination-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Previous
            </button>
            <button
              className="cust-pagination-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ── Purchase History (session) ── */}
      {purchaseHistory.length > 0 && (
        <div className="cust-history-card" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <FiShoppingBag size={16} style={{ color: '#7c3aed' }} />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
              Session Purchase History
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {purchaseHistory.map((item, i) => (
              <div key={i} className="cust-history-item">
                <div>
                  <p style={{ fontSize: '0.83rem', fontWeight: 600, color: '#e2e8f0', margin: '0 0 2px' }}>
                    {item.make} {item.model}
                  </p>
                  <p style={{ fontSize: '0.73rem', color: '#475569', margin: 0 }}>
                    {fmt$(item.price)} · {item.category}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.73rem', color: '#334155' }}>
                  <FiClock size={12} />
                  {item.purchasedAt && new Date(item.purchasedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm purchase dialog */}
      <PurchaseConfirmDialog
        open={purchaseDialog.open}
        onClose={() => setPurchaseDialog({ open: false, vehicle: null })}
        onConfirm={() => purchaseDialog.vehicle && purchaseMutation.mutate(purchaseDialog.vehicle.id)}
        vehicle={purchaseDialog.vehicle}
        isSubmitting={purchaseMutation.isPending}
      />

      {toast && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }}>
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </motion.div>
  );
}

export default VehiclesPage;
