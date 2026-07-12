import { motion } from 'framer-motion';
import Card from '../../../components/ui/Card';
import PageHeader from '../../../components/ui/PageHeader';

function DashboardPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <PageHeader
        title="Inventory overview"
        description="A premium control center for tracking the latest arrivals and stock health."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Live stock</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">128</h3>
          <p className="mt-2 text-sm text-slate-400">High-demand vehicles ready for customers.</p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Revenue</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">$3.4M</h3>
          <p className="mt-2 text-sm text-slate-400">Projected monthly performance.</p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Pending</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">14</h3>
          <p className="mt-2 text-sm text-slate-400">Reservations awaiting confirmation.</p>
        </Card>
      </div>
    </motion.div>
  );
}

export default DashboardPage;
