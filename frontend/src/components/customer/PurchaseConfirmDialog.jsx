import { FiShoppingCart, FiCheckCircle } from 'react-icons/fi';
import Button from '../ui/Button';
import Modal from '../common/Modal';

function PurchaseConfirmDialog({ open, onClose, onConfirm, vehicle, isSubmitting }) {
  if (!vehicle) return null;

  const isOutOfStock = vehicle.quantity === 0;

  return (
    <Modal open={open} title="Confirm Purchase" onClose={onClose}>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-violet-500/20 p-3">
            <FiShoppingCart className="h-6 w-6 text-violet-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{vehicle.make} {vehicle.model}</h3>
            <p className="mt-1 text-sm text-slate-400">{vehicle.category}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">${vehicle.price.toLocaleString()}</span>
              <span className="text-sm text-slate-400">USD</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Available Stock</span>
            <span className={`font-medium ${isOutOfStock ? 'text-rose-400' : vehicle.quantity <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isOutOfStock ? 'Out of Stock' : vehicle.quantity <= 5 ? `Low Stock (${vehicle.quantity})` : `Available (${vehicle.quantity})`}
            </span>
          </div>
        </div>

        {isOutOfStock ? (
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-4 text-center">
            <p className="text-sm text-rose-200">This vehicle is currently out of stock and cannot be purchased.</p>
          </div>
        ) : (
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="min-w-[140px] bg-violet-600 hover:bg-violet-500"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Confirm Purchase'
              )}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default PurchaseConfirmDialog;
