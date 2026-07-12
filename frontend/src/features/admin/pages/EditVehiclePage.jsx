import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiArrowLeft, FiEdit3, FiLoader } from 'react-icons/fi';
import VehicleForm from '../../../components/admin/VehicleForm';
import Toast from '../../../components/common/Toast';
import { getVehicleById, updateVehicle } from '../../../api/vehicles';

function EditVehiclePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [toast, setToast] = useState(null);

  const { data: vehicleData, isLoading, isError } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicleById(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: ({ vehicleId, data }) => updateVehicle(vehicleId, data),
    onSuccess: (data) => {
      setToast({ message: `${data.data.make} ${data.data.model} updated successfully!`, type: 'success' });
      queryClient.invalidateQueries(['admin-vehicles']);
      queryClient.invalidateQueries(['vehicle', id]);
      setTimeout(() => navigate('/admin/vehicles'), 1500);
    },
    onError: (err) => {
      setToast({ message: err.response?.data?.message || 'Failed to update vehicle', type: 'error' });
    },
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <FiLoader style={{ width: 32, height: 32, animation: 'spin 1s linear infinite', color: '#7c3aed' }} />
      </div>
    );
  }

  if (isError || !vehicleData) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p style={{ color: '#475569', marginBottom: 16 }}>Vehicle not found or failed to load.</p>
        <button className="admin-action-btn" onClick={() => navigate('/admin/vehicles')}>
          Go to Vehicle List
        </button>
      </div>
    );
  }

  const vehicle = vehicleData.data;
  const initialFormData = {
    make: vehicle.make, model: vehicle.model, category: vehicle.category,
    price: String(vehicle.price), quantity: String(vehicle.quantity),
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      <div className="admin-page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="admin-back-btn" onClick={() => navigate('/admin/vehicles')}>
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="admin-page-title">Edit Vehicle</h1>
            <p className="admin-page-subtitle">Editing {vehicle.make} {vehicle.model}</p>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: 680 }}>
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
            <FiEdit3 size={18} />
          </div>
          <div>
            <h3 className="admin-card-title" style={{ marginBottom: 0 }}>Vehicle Details</h3>
            <p className="admin-card-subtitle">Update the vehicle information below</p>
          </div>
        </div>

        <VehicleForm
          initialData={initialFormData}
          onSubmit={(data) => mutation.mutate({ vehicleId: id, data })}
          isSubmitting={mutation.isPending}
          submitLabel="Save Changes"
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

export default EditVehiclePage;
