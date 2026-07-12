import { motion } from 'framer-motion';

function Button({ children, variant = 'primary', fullWidth = false, className = '', ...props }) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400/60';
  const variants = {
    primary: 'bg-violet-600 text-white shadow-lg shadow-violet-900/20 hover:bg-violet-500',
    secondary: 'border border-white/15 bg-white/10 text-white hover:bg-white/20',
    ghost: 'bg-transparent text-slate-300 hover:bg-white/10 hover:text-white',
    danger: 'bg-rose-600 text-white shadow-lg shadow-rose-900/20 hover:bg-rose-500',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
