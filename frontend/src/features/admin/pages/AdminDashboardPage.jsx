import { motion } from 'framer-motion';
import Card from '../../../components/ui/Card';
import PageHeader from '../../../components/ui/PageHeader';

function AdminDashboardPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <PageHeader
        title="Admin dashboard"
        description="Manage inventory, review sales, and access admin controls for the dealership."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Admin access</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">Role-based control</h3>
          <p className="mt-2 text-sm text-slate-400">Only admin users can create, update, and restock vehicles.</p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Inventory actions</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">Create & restock</h3>
          <p className="mt-2 text-sm text-slate-400">Admin users are authorized for vehicle data management endpoints.</p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Secure auth</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">Admin tokens</h3>
          <p className="mt-2 text-sm text-slate-400">Admin account access is controlled by an admin signup code.</p>
        </Card>
      </div>
    </motion.div>
  );
}

export default AdminDashboardPage;
