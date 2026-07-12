import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

function Toast({ message, type = 'success', onClose }) {
  const bgColor = type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200' : 'bg-rose-500/20 border-rose-500/30 text-rose-200';
  const Icon = type === 'success' ? FiCheckCircle : FiAlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${bgColor}`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={onClose}
        className="rounded-full p-1 hover:bg-white/10 transition"
      >
        <FiX className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export default Toast;
