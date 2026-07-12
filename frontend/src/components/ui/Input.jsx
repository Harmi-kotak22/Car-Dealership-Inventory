function Input({ label, error, icon, className = '', ...props }) {
  return (
    <label className="block text-sm text-slate-300">
      {label ? <span className="mb-2 block font-medium">{label}</span> : null}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-4 inline-flex items-center text-slate-400">
            {icon}
          </span>
        ) : null}
        <input
          className={`w-full rounded-full border border-white/10 bg-[#120b1e] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500 ${icon ? 'pl-12' : 'pl-4'} ${error ? 'border-rose-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error ? <span className="mt-2 block text-xs text-rose-400">{error}</span> : null}
    </label>
  );
}

export default Input;
