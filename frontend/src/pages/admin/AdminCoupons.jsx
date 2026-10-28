import { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const API = import.meta.env.VITE_API_URL || 'https://backend-gilt-three-74.vercel.app';

const EMPTY_FORM = {
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: '',
  minOrderAmount: 0,
  maxDiscount: 0,
  usageLimit: 0,
  isActive: true,
  expiresAt: '',
};

const token = () => JSON.parse(localStorage.getItem('manroz_user'))?.token;
const authH = () => ({ Authorization: `Bearer ${token()}` });

const fmt = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const toInputDate = (iso) => (iso ? iso.split('T')[0] : '');

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/admin/coupons`, { headers: authH() });
      setCoupons(data);
    } catch {
      setError('Failed to load coupons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSaveMsg('');
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code,
      description: c.description || '',
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount || 0,
      maxDiscount: c.maxDiscount || 0,
      usageLimit: c.usageLimit || 0,
      isActive: c.isActive,
      expiresAt: toInputDate(c.expiresAt),
    });
    setSaveMsg('');
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    const payload = {
      ...form,
      code: form.code.toUpperCase().trim(),
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxDiscount: Number(form.maxDiscount) || 0,
      usageLimit: Number(form.usageLimit) || 0,
      expiresAt: form.expiresAt || null,
    };
    try {
      if (editing) {
        const { data } = await axios.put(`${API}/api/admin/coupons/${editing._id}`, payload, { headers: authH() });
        setCoupons((prev) => prev.map((c) => (c._id === editing._id ? data : c)));
      } else {
        const { data } = await axios.post(`${API}/api/admin/coupons`, payload, { headers: authH() });
        setCoupons((prev) => [data, ...prev]);
      }
      setSaveMsg('Saved!');
      setTimeout(() => setModalOpen(false), 700);
    } catch (err) {
      setSaveMsg(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await axios.delete(`${API}/api/admin/coupons/${id}`, { headers: authH() });
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert('Delete failed.');
    }
  };

  const toggleActive = async (c) => {
    try {
      const { data } = await axios.put(
        `${API}/api/admin/coupons/${c._id}`,
        { isActive: !c.isActive },
        { headers: authH() }
      );
      setCoupons((prev) => prev.map((x) => (x._id === c._id ? data : x)));
    } catch {
      alert('Toggle failed.');
    }
  };

  // Summary stats
  const active = coupons.filter((c) => c.isActive).length;
  const expired = coupons.filter(
    (c) => c.expiresAt && new Date() > new Date(c.expiresAt)
  ).length;
  const totalUsed = coupons.reduce((s, c) => s + (c.usedCount || 0), 0);

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Discount Coupons</h1>
          <p className="admin-page-subtitle">Create and manage coupon codes for your store</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>
          + New Coupon
        </button>
      </div>

      {/* Stat strip */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Coupons', value: coupons.length, color: '#74b9ff' },
          { label: 'Active', value: active, color: '#55efc4' },
          { label: 'Expired', value: expired, color: '#ff6b6b' },
          { label: 'Times Used', value: totalUsed, color: '#fdcb6e' },
        ].map((s) => (
          <div key={s.label} style={{
            background: 'var(--admin-surface)',
            border: '1px solid var(--admin-border)',
            borderRadius: 10,
            padding: '14px 20px',
            minWidth: 120,
            flex: '1 1 120px',
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-card">
        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-spinner"><div className="admin-spinner__ring" /></div>
          ) : coupons.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty__icon">🎟️</span>
              <span className="admin-empty__text">No coupons yet. Create your first one!</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Min Order</th>
                  <th>Usage</th>
                  <th>Expires</th>
                  <th>Active</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => {
                  const isExpired = c.expiresAt && new Date() > new Date(c.expiresAt);
                  return (
                    <tr key={c._id}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <code style={{
                            background: 'var(--admin-surface-2)',
                            border: '1px solid var(--admin-border)',
                            padding: '3px 10px',
                            borderRadius: 5,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            letterSpacing: '0.05em',
                            color: isExpired ? 'var(--admin-text-muted)' : '#fdcb6e',
                            display: 'inline-block',
                          }}>{c.code}</code>
                          {c.description && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{c.description}</span>
                          )}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {c.discountType === 'percentage' ? (
                          <span style={{ color: '#55efc4' }}>
                            {c.discountValue}%
                            {c.maxDiscount > 0 && (
                              <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', fontWeight: 400, marginLeft: 4 }}>
                                (max ₹{c.maxDiscount})
                              </span>
                            )}
                          </span>
                        ) : (
                          <span style={{ color: '#55efc4' }}>₹{c.discountValue} flat</span>
                        )}
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                        {c.minOrderAmount > 0 ? `₹${c.minOrderAmount}` : '—'}
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        <span style={{ color: c.usedCount > 0 ? '#fdcb6e' : 'var(--admin-text-muted)' }}>
                          {c.usedCount}
                        </span>
                        {c.usageLimit > 0 && (
                          <span style={{ color: 'var(--admin-text-muted)' }}> / {c.usageLimit}</span>
                        )}
                        {c.usageLimit === 0 && (
                          <span style={{ color: 'var(--admin-text-muted)' }}> / ∞</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {c.expiresAt ? (
                          <span style={{ color: isExpired ? '#ff6b6b' : 'var(--admin-text)' }}>
                            {isExpired ? '⚠ ' : ''}{fmt(c.expiresAt)}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--admin-text-muted)' }}>Never</span>
                        )}
                      </td>
                      <td>
                        <label className="admin-toggle">
                          <input type="checkbox" checked={c.isActive} onChange={() => toggleActive(c)} />
                          <span className="admin-toggle__track" />
                        </label>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openEdit(c)}>✏️ Edit</button>
                          <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete(c._id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">{editing ? 'Edit Coupon' : 'New Coupon'}</h2>
              <button className="admin-modal__close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="admin-modal__body">
              <form className="admin-form" onSubmit={handleSubmit}>

                {/* Code + Description */}
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Coupon Code *</label>
                    <input
                      name="code"
                      className="admin-input"
                      placeholder="SAVE50"
                      value={form.code}
                      onChange={handleChange}
                      required
                      style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.08em' }}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Description (optional)</label>
                    <input
                      name="description"
                      className="admin-input"
                      placeholder="Festive sale — 50% off"
                      value={form.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Discount type + value */}
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Discount Type</label>
                    <select name="discountType" className="admin-input" value={form.discountType} onChange={handleChange} style={{ cursor: 'pointer' }}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>{form.discountType === 'percentage' ? 'Discount %  *' : 'Discount Amount ₹  *'}</label>
                    <input
                      type="number"
                      name="discountValue"
                      className="admin-input"
                      placeholder={form.discountType === 'percentage' ? '50' : '200'}
                      value={form.discountValue}
                      onChange={handleChange}
                      min={1}
                      max={form.discountType === 'percentage' ? 100 : undefined}
                      required
                    />
                  </div>
                </div>

                {/* Min order + Max discount cap */}
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Min Order Amount ₹</label>
                    <input
                      type="number"
                      name="minOrderAmount"
                      className="admin-input"
                      placeholder="0  (no minimum)"
                      value={form.minOrderAmount}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                  {form.discountType === 'percentage' && (
                    <div className="admin-form-group">
                      <label>Max Discount ₹ (0 = no cap)</label>
                      <input
                        type="number"
                        name="maxDiscount"
                        className="admin-input"
                        placeholder="500"
                        value={form.maxDiscount}
                        onChange={handleChange}
                        min={0}
                      />
                    </div>
                  )}
                </div>

                {/* Usage limit + expiry */}
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Usage Limit (0 = unlimited)</label>
                    <input
                      type="number"
                      name="usageLimit"
                      className="admin-input"
                      placeholder="0"
                      value={form.usageLimit}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Expiry Date (leave blank = never)</label>
                    <input
                      type="date"
                      name="expiresAt"
                      className="admin-input"
                      value={form.expiresAt}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Active toggle */}
                <div className="admin-form-group">
                  <label className="admin-toggle">
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                    <span className="admin-toggle__track" />
                    <span className="admin-toggle__label">
                      {form.isActive ? '✅ Active — customers can use this coupon' : 'Draft — coupon is disabled'}
                    </span>
                  </label>
                </div>

                {/* Live preview */}
                {form.code && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(253,203,110,0.08), rgba(85,239,196,0.06))',
                    border: '1px dashed rgba(253,203,110,0.35)',
                    borderRadius: 8,
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}>
                    <span style={{ fontSize: '1.4rem' }}>🎟️</span>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Preview</div>
                      <code style={{ fontSize: '1rem', fontWeight: 800, color: '#fdcb6e', letterSpacing: '0.1em' }}>
                        {form.code.toUpperCase()}
                      </code>
                      {form.discountValue && (
                        <span style={{ marginLeft: 10, fontSize: '0.9rem', color: '#55efc4', fontWeight: 600 }}>
                          — {form.discountType === 'percentage' ? `${form.discountValue}% off` : `₹${form.discountValue} off`}
                          {form.minOrderAmount > 0 && ` on orders above ₹${form.minOrderAmount}`}
                        </span>
                      )}
                      {form.description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: 3 }}>{form.description}</div>
                      )}
                    </div>
                  </div>
                )}

                {saveMsg && (
                  <div className={`admin-alert ${saveMsg === 'Saved!' ? 'admin-alert--success' : 'admin-alert--error'}`}>
                    {saveMsg}
                  </div>
                )}

                <div className="admin-modal__footer" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                    {saving ? 'Saving...' : '💾 Save Coupon'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
