import { FiShoppingCart, FiX, FiTruck, FiTag, FiPackage } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

function fmt$(v) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

function PurchaseConfirmDialog({ open, onClose, onConfirm, vehicle, isSubmitting }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open || !vehicle) return null;

  const isOut = vehicle.quantity === 0;
  const isLow = !isOut && vehicle.quantity <= 5;

  const stockLabel = isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Available';
  const stockColor = isOut ? '#f87171' : isLow ? '#fbbf24' : '#34d399';
  const stockBg    = isOut ? 'rgba(239,68,68,0.15)' : isLow ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)';

  const year = vehicle.createdAt ? new Date(vehicle.createdAt).getFullYear() : '';

  return createPortal(
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        background: 'rgba(3,2,10,0.82)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Dialog */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420,
          background: 'rgba(12,8,24,0.98)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 24,
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >

        {/* ── Dialog Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FiShoppingCart size={15} style={{ color: '#a78bfa' }} />
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>
              Confirm Purchase
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 7,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              color: '#64748b', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            <FiX size={13} />
          </button>
        </div>

        {/* ── Dialog Body ── */}
        <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Vehicle image card */}
          <div style={{
            borderRadius: 16, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.03)',
            position: 'relative',
          }}>
            {/* Image / placeholder */}
            <div style={{
              height: 150, background: 'rgba(255,255,255,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {vehicle.image
                ? <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '3.5rem' }}>🚗</span>
              }
              {/* Stock badge over image */}
              <span style={{
                position: 'absolute', top: 10, left: 10,
                padding: '4px 11px', borderRadius: 999,
                fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                background: stockBg, color: stockColor,
                border: `1px solid ${stockColor}30`,
              }}>
                {stockLabel}
              </span>
            </div>

            {/* Vehicle details row */}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  {year && (
                    <p style={{ margin: '0 0 3px', fontSize: '0.7rem', color: '#475569', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {year}
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                    {vehicle.make} {vehicle.model}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                    {fmt$(vehicle.price)}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#475569' }}>
                    {isOut ? 'No stock' : `${vehicle.quantity} left`}
                  </p>
                </div>
              </div>

              {/* Category pill */}
              <div style={{ marginTop: 10 }}>
                <span style={{
                  padding: '3px 12px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b',
                }}>
                  {vehicle.category}
                </span>
              </div>
            </div>
          </div>

          {/* Order summary card */}
          <div style={{
            borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.03)', overflow: 'hidden',
          }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Order Summary
              </p>
            </div>
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: FiTruck,   label: 'Vehicle',  value: `${vehicle.make} ${vehicle.model}` },
                { icon: FiTag,     label: 'Unit Price', value: fmt$(vehicle.price) },
                { icon: FiPackage, label: 'Quantity',  value: '1 unit' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Icon size={13} style={{ color: '#475569', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{label}</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>{value}</span>
                </div>
              ))}

              {/* Total row */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginTop: 6, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.07)',
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>Total</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#a78bfa' }}>{fmt$(vehicle.price)}</span>
              </div>
            </div>
          </div>

          {/* Out of stock warning */}
          {isOut && (
            <div style={{
              borderRadius: 12, padding: '12px 14px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              textAlign: 'center',
            }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#fca5a5' }}>
                This vehicle is currently out of stock and cannot be purchased.
              </p>
            </div>
          )}

          {/* Action buttons */}
          {!isOut && (
            <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isSubmitting}
                style={{
                  flex: 2, padding: '11px 0', borderRadius: 12,
                  border: 'none',
                  background: isSubmitting ? 'rgba(124,58,237,0.55)' : '#7c3aed',
                  color: '#fff', fontSize: '0.85rem', fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: isSubmitting ? 'none' : '0 4px 14px rgba(124,58,237,0.45)',
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing…
                  </>
                ) : (
                  <><FiShoppingCart size={15} /> Confirm Purchase</>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}

export default PurchaseConfirmDialog;
