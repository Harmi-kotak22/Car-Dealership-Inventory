import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import VehicleForm from '../../../components/admin/VehicleForm';
import Toast from '../../../components/common/Toast';
import { createVehicle } from '../../../api/vehicles';

function AddVehiclePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [toast, setToast] = useState(null);

  const mutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: (data) => {
      setToast({ message: `${data.data.make} ${data.data.model} added successfully!`, type: 'success' });
      queryClient.invalidateQueries(['admin-vehicles']);
      setTimeout(() => navigate('/admin'), 1500);
    },
    onError: (err) => {
      setToast({ message: err.response?.data?.message || 'Failed to add vehicle', type: 'error' });
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      <div className="admin-page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="admin-back-btn" onClick={() => navigate('/admin')}>
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="admin-page-title">Add New Vehicle</h1>
            <p className="admin-page-subtitle">Fill in the details to add a vehicle to inventory</p>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: 680 }}>
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
            <FiPlus size={18} />
          </div>
          <div>
            <h3 className="admin-card-title" style={{ marginBottom: 0 }}>Vehicle Details</h3>
            <p className="admin-card-subtitle">Fill in the vehicle information below</p>
          </div>
        </div>

        <VehicleForm
          onSubmit={(data) => mutation.mutate(data)}
          isSubmitting={mutation.isPending}
          submitLabel="Add Vehicle"
        />
      </div>

      {toast && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }}>
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </motion.div>
  );
}

export default AddVehiclePage;
