import { FiAlertTriangle, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import Button from '../ui/Button';
import Modal from '../common/Modal';

function ConfirmDialog({ open, onClose, onConfirm, title, message, type = 'delete', isSubmitting, confirmLabel, children }) {
  const iconColor = type === 'delete' ? 'text-rose-400' : type === 'restock' ? 'text-cyan-400' : 'text-emerald-400';
  const Icon = type === 'delete' ? FiAlertTriangle : type === 'restock' ? FiRefreshCw : FiCheckCircle;
  const buttonVariant = type === 'delete' ? 'danger' : 'primary';

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={`rounded-full bg-white/5 p-3 ${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm leading-6 text-slate-300">{message}</p>
          </div>
        </div>

        {children}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={buttonVariant}
            onClick={onConfirm}
            disabled={isSubmitting}
            className="min-w-[120px]"
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
              confirmLabel || (type === 'delete' ? 'Delete' : type === 'restock' ? 'Restock' : 'Confirm')
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
