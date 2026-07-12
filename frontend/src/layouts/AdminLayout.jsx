import { Outlet } from 'react-router-dom';
import { FiLogOut, FiUser, FiLayout, FiPlus, FiList, FiSettings, FiDownload } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../features/auth/store/authStore';
import { useMutation } from '@tanstack/react-query';
import { getVehicles } from '../api/vehicles';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const navTabs = [
  { to: '/admin', label: 'Dashboard', icon: FiLayout, end: true },
  { to: '/admin/vehicles', label: 'Vehicles', icon: FiList },
  { to: '/admin/add-vehicle', label: 'Add Vehicle', icon: FiPlus },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
];

function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const downloadReport = useMutation({
    mutationFn: async () => {
      // getVehicles() returns { success, data: [...] }
      const response = await getVehicles();
      const vehicles = response.data || [];

      const doc = new jsPDF();

      // Header
      doc.setFontSize(18);
      doc.setTextColor(30, 41, 59);
      doc.text('Prestige Motors - Inventory Report', 14, 22);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Total vehicles: ${vehicles.length}`, 14, 36);

      // Summary stats
      const inStock  = vehicles.filter((v) => v.quantity > 0).length;
      const lowStock = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 5).length;
      const outStock = vehicles.filter((v) => v.quantity === 0).length;
      const totalValue = vehicles.reduce((s, v) => s + v.price * v.quantity, 0);

      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`In stock: ${inStock}  |  Low stock: ${lowStock}  |  Out of stock: ${outStock}  |  Total value: $${totalValue.toLocaleString()}`, 14, 43);

      // Table — use v.id (DTO maps _id → id)
      const tableData = vehicles.map((v) => [
        v.id ? v.id.slice(-8) : '—',
        v.make,
        v.model,
        v.category,
        `$${v.price.toLocaleString()}`,
        v.quantity,
        v.quantity === 0 ? 'Out of Stock' : v.quantity <= 5 ? 'Low Stock' : 'Available',
      ]);

      autoTable(doc, {
        head: [['ID', 'Make', 'Model', 'Category', 'Price', 'Stock', 'Status']],
        body: tableData,
        startY: 50,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: { 6: { fontStyle: 'bold' } },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 6) {
            const val = data.cell.raw;
            if (val === 'Out of Stock') data.cell.styles.textColor = [220, 38, 38];
            else if (val === 'Low Stock') data.cell.styles.textColor = [217, 119, 6];
            else data.cell.styles.textColor = [5, 150, 105];
          }
        },
      });

      doc.save(`inventory-report-${new Date().toISOString().split('T')[0]}.pdf`);
    },
    onError: (err) => {
      console.error('Report generation failed:', err);
      alert('Failed to generate report. Please try again.');
    },
  });

  return (
    <div className="admin-page-bg min-h-screen flex flex-col">

      {/* ── Top Navbar ── */}
      <header className="admin-navbar">
        <div className="admin-navbar-inner">

          {/* Brand */}
          <div className="admin-brand">
            <span className="admin-brand-icon">◈</span>
            <div>
              <span className="admin-brand-name">Prestige Motors</span>
              <span className="admin-brand-badge">Admin Console</span>
            </div>
          </div>

          {/* Center tabs */}
          <nav className="admin-tabs-bar">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    `admin-tab${isActive ? ' admin-tab--active' : ''}`
                  }
                >
                  <Icon size={14} />
                  {tab.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: user + logout */}
          <div className="admin-navbar-right">
            <button
              className="admin-report-btn"
              onClick={() => downloadReport.mutate()}
              disabled={downloadReport.isPending}
            >
              <FiDownload size={14} />
              {downloadReport.isPending ? 'Generating…' : 'Report'}
            </button>
            <div className="admin-user-pill">
              <span className="admin-user-avatar">
                <FiUser size={13} />
              </span>
              <span className="admin-user-name">{user?.name || 'Admin'}</span>
            </div>
            <button className="admin-logout-btn" onClick={logout}>
              <FiLogOut size={14} />
              Logout
            </button>
          </div>

        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="admin-main">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;
