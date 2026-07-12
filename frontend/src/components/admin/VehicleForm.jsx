import { useState } from 'react';

const initialForm = { make: '', model: '', category: 'SUV', price: '', quantity: '' };
const categories = ['SUV', 'SEDAN', 'HATCHBACK', 'TRUCK', 'COUPE'];

function VehicleForm({ initialData = initialForm, onSubmit, isSubmitting, submitLabel = 'Create Vehicle' }) {
  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.make.trim())                      e.make = 'Make is required';
    if (!form.model.trim())                     e.model = 'Model is required';
    if (!form.price || Number(form.price) <= 0) e.price = 'Price must be greater than 0';
    if (!form.quantity || Number(form.quantity) < 0) e.quantity = 'Quantity must be 0 or greater';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...form, price: Number(form.price), quantity: Number(form.quantity) });
    }
  };

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <div className="admin-form-field">
          <label className="admin-form-label">Make <span style={{ color: '#f87171' }}>*</span></label>
          <input
            className={`admin-form-input${errors.make ? ' admin-form-input--error' : ''}`}
            value={form.make} onChange={(e) => set('make', e.target.value)}
            placeholder="e.g. Toyota" required
          />
          {errors.make && <p className="admin-form-error">{errors.make}</p>}
        </div>

        <div className="admin-form-field">
          <label className="admin-form-label">Model <span style={{ color: '#f87171' }}>*</span></label>
          <input
            className={`admin-form-input${errors.model ? ' admin-form-input--error' : ''}`}
            value={form.model} onChange={(e) => set('model', e.target.value)}
            placeholder="e.g. Camry" required
          />
          {errors.model && <p className="admin-form-error">{errors.model}</p>}
        </div>

        <div className="admin-form-field">
          <label className="admin-form-label">Category <span style={{ color: '#f87171' }}>*</span></label>
          <select
            className="admin-form-select"
            value={form.category} onChange={(e) => set('category', e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c} style={{ background: '#0d0b1a' }}>{c}</option>
            ))}
          </select>
        </div>

        <div className="admin-form-field">
          <label className="admin-form-label">Price (USD) <span style={{ color: '#f87171' }}>*</span></label>
          <input
            type="number" min="0" step="0.01"
            className={`admin-form-input${errors.price ? ' admin-form-input--error' : ''}`}
            value={form.price} onChange={(e) => set('price', e.target.value)}
            placeholder="e.g. 35000" required
          />
          {errors.price && <p className="admin-form-error">{errors.price}</p>}
        </div>
      </div>

      <div className="admin-form-field" style={{ marginBottom: 24 }}>
        <label className="admin-form-label">Quantity <span style={{ color: '#f87171' }}>*</span></label>
        <input
          type="number" min="0"
          className={`admin-form-input${errors.quantity ? ' admin-form-input--error' : ''}`}
          value={form.quantity} onChange={(e) => set('quantity', e.target.value)}
          placeholder="e.g. 10" required
        />
        {errors.quantity && <p className="admin-form-error">{errors.quantity}</p>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button
          type="button"
          className="admin-action-btn admin-action-btn--secondary"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          onClick={() => setForm(initialData)}
        >
          Reset
        </button>
        <button type="submit" className="admin-action-btn" disabled={isSubmitting} style={{ minWidth: 140 }}>
          {isSubmitting ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving…
            </span>
          ) : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default VehicleForm;
