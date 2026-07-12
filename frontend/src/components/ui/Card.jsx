function Card({ children, className = '', hoverable = true }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl ${hoverable ? 'transition-transform duration-300 hover:-translate-y-1' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
