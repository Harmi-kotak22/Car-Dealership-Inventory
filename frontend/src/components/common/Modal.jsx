function Modal({ children, open, title, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-[30px] border border-white/10 bg-[#071019] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            {title ? <h3 className="text-xl font-semibold text-white">{title}</h3> : null}
            <p className="mt-1 text-sm text-slate-400">Manage inventory details with a polished workflow.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">Close</button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
