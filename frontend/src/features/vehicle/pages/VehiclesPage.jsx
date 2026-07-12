import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import PageHeader from '../../../components/ui/PageHeader';
import { searchVehicles, purchaseVehicle } from '../../../api/vehicles';

const pageSize = 6;
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price Low' },
  { value: 'price-high', label: 'Price High' },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function VehiclesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('400000');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const { data, isLoading, isFetching } = useQuery(
    ['vehicles', search, category, minPrice, maxPrice],
    () =>
      searchVehicles({
        make: search,
        model: search,
        category: category === 'All' ? undefined : category,
        minPrice: Number(minPrice) > 0 ? Number(minPrice) : undefined,
        maxPrice: Number(maxPrice) > 0 ? Number(maxPrice) : undefined,
      }),
    {
      retry: false,
      keepPreviousData: true,
      onError: (err) => {
        setError(err.response?.data?.message || 'Unable to load vehicles.');
      },
    }
  );

  const vehicles = data?.data || [];

  useEffect(() => {
    setPage(1);
  }, [search, category, minPrice, maxPrice, sort]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(vehicles.map((vehicle) => vehicle.category)))],
    [vehicles]
  );

  const sortedVehicles = useMemo(() => {
    return [...vehicles].sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [vehicles, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedVehicles.length / pageSize));
  const paginatedVehicles = sortedVehicles.slice((page - 1) * pageSize, page * pageSize);

  const handlePurchase = async (id) => {
    try {
      setError(null);
      await purchaseVehicle(id);
      queryClient.invalidateQueries(['vehicles', search, category, minPrice, maxPrice]);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to purchase vehicle.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <PageHeader
        title="Customer dashboard"
        description="Browse available vehicles, compare price ranges, and complete your next purchase with confidence."
      />

      <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-violet-300">Welcome back</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Find your next ride</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Use search, filters, and smart sorting to locate the perfect vehicle in stock.
            </p>
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-[#09060f]/80 p-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Search vehicles</label>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Make or model"
                className="w-full rounded-3xl border border-white/10 bg-[#120b1e] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Category</label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-[#120b1e] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
              >
                {categories.map((option) => (
                  <option key={option} value={option} className="bg-[#09060f] text-white">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Min price</label>
                <input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-[#120b1e] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Max price</label>
                <input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-[#120b1e] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Sort by</label>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-[#120b1e] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#09060f] text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#09060f]/80 p-5 text-sm text-slate-400">
            <p className="font-semibold text-white">Dashboard highlights</p>
            <ul className="mt-3 space-y-3">
              <li>• Instant pricing and availability across all categories</li>
              <li>• Purchase directly from the dashboard</li>
              <li>• Real-time stock updates on every vehicle</li>
            </ul>
          </div>
        </Card>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-[#0f0b1e]/80 p-6 shadow-[0_25px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-violet-300">Available models</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Browse the latest inventory</h2>
              </div>
              <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
                {vehicles.length} vehicles found
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isLoading || isFetching ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              >
                {Array.from({ length: pageSize }).map((_, index) => (
                  <Card key={index} className="animate-pulse bg-slate-900/70" hoverable={false}>
                    <div className="mb-4 h-40 rounded-3xl bg-slate-800" />
                    <div className="h-5 w-3/4 rounded-full bg-slate-800" />
                    <div className="mt-4 h-4 w-1/2 rounded-full bg-slate-800" />
                    <div className="mt-8 flex items-center justify-between gap-3">
                      <div className="h-10 w-24 rounded-full bg-slate-800" />
                      <div className="h-10 w-24 rounded-full bg-slate-800" />
                    </div>
                  </Card>
                ))}
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[32px] border border-rose-500/20 bg-[#19090f]/90 p-10 text-center text-rose-300"
              >
                <p className="text-sm uppercase tracking-[0.35em] text-rose-300">Load failed</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">{error}</h3>
              </motion.div>
            ) : paginatedVehicles.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[32px] border border-dashed border-white/15 bg-[#09060f]/90 p-10 text-center text-slate-300"
              >
                <p className="text-sm uppercase tracking-[0.35em] text-violet-300">No matches</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">We couldn't find any vehicles</h3>
                <p className="mt-3 max-w-xl mx-auto text-sm leading-6 text-slate-400">
                  Adjust your search, update price range, or clear filters to see more available models.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              >
                {paginatedVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden">
                    <div className="relative overflow-hidden rounded-3xl">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="h-52 w-full object-cover transition duration-500 hover:scale-105"
                      />
                      {vehicle.quantity === 0 ? (
                        <div className="absolute left-4 top-4 rounded-full bg-rose-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                          Out of stock
                        </div>
                      ) : (
                        <div className="absolute left-4 top-4 rounded-full bg-violet-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                          {vehicle.category}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{new Date(vehicle.createdAt).getFullYear()}</p>
                        <h3 className="mt-2 text-xl font-semibold text-white">{vehicle.make} {vehicle.model}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold text-white">{formatCurrency(vehicle.price)}</p>
                        <p className="mt-1 text-sm text-slate-400">{vehicle.quantity} in stock</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      Premium build quality, advanced safety systems, and an elevated driving experience.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="rounded-full bg-white/5 px-3 py-2 text-sm text-slate-300">
                        {vehicle.category}
                      </div>
                      <Button
                        type="button"
                        fullWidth
                        disabled={vehicle.quantity === 0}
                        className={vehicle.quantity === 0 ? 'cursor-not-allowed opacity-60' : ''}
                        onClick={() => handlePurchase(vehicle.id)}
                      >
                        {vehicle.quantity === 0 ? 'Unavailable' : 'Purchase'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && !isFetching && paginatedVehicles.length > 0 ? (
            <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-[#09060f]/80 px-6 py-5 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Page {page} of {totalPages}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className={page === 1 ? 'cursor-not-allowed opacity-60' : ''}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  className={page === totalPages ? 'cursor-not-allowed opacity-60' : ''}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}

          <div className="rounded-[32px] border border-white/10 bg-[#0f0b1e]/80 px-6 py-5 text-slate-400">
            <p className="text-sm font-semibold text-white">Need help?</p>
            <p className="mt-3 text-sm leading-6">
              Our team is ready to assist with pricing details, financing options, and delivery scheduling. Reach out any time.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default VehiclesPage;
