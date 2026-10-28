import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://backend-gilt-three-74.vercel.app';

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  discountCode: '',
  discountPercent: '',
  isActive: false,
  startDate: '',
  endDate: '',
  bgColor: '#8b1a2e',
  textColor: '#ffffff',
  imageUrl: '',
};

const AdminSales = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const token = () => JSON.parse(localStorage.getItem('manroz_user'))?.token;

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/admin/sales`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setBanners(data);
    } catch {
      setError('Failed to load sale banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const toInputDate = (iso) => (iso ? iso.split('T')[0] : '');

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSaveMsg('');
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle || '',
      discountCode: b.discountCode || '',
      discountPercent: b.discountPercent || '',
      isActive: b.isActive,
      startDate: toInputDate(b.startDate),
      endDate: toInputDate(b.endDate),
      bgColor: b.bgColor || '#8b1a2e',
      textColor: b.textColor || '#ffffff',
      imageUrl: b.imageUrl || '',
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
      discountPercent: Number(form.discountPercent) || 0,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    };
    try {
      if (editing) {
        const { data } = await axios.put(
          `${API}/api/admin/sales/${editing._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token()}` } }
        );
        setBanners((prev) => prev.map((b) => (b._id === editing._id ? data : b)));
      } else {
        const { data } = await axios.post(`${API}/api/admin/sales`, payload, {
          headers: { Authorization: `Bearer ${token()}` },
        });
        setBanners((prev) => [data, ...prev]);
      }
      setSaveMsg('Saved!');
      setTimeout(() => setModalOpen(false), 700);
    } catch {
      setSaveMsg('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sale banner?')) return;
    try {
      await axios.delete(`${API}/api/admin/sales/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch {
      alert('Delete failed.');
    }
  };

  const toggleActive = async (banner) => {
    // Deactivate all others first if activating
    try {
      if (!banner.isActive) {
        // Deactivate all
        await Promise.all(
          banners
            .filter((b) => b._id !== banner._id && b.isActive)
            .map((b) =>
              axios.put(`${API}/api/admin/sales/${b._id}`, { isActive: false }, {
                headers: { Authorization: `Bearer ${token()}` },
              })
            )
        );
      }
      const { data } = await axios.put(
        `${API}/api/admin/sales/${banner._id}`,
        { isActive: !banner.isActive },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      // Refresh
      fetchBanners();
    } catch {
      alert('Toggle failed.');
    }
  };

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Sales & Offers</h1>
          <p className="admin-page-subtitle">Create sale banners and promotional campaigns for your store</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>
          + New Sale Banner
        </button>
      </div>

      {/* Active sale highlight */}
      {banners.find((b) => b.isActive) && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(192,57,43,0.2), rgba(139,26,46,0.1))',
          border: '1px solid rgba(192,57,43,0.35)',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <span style={{ fontSize: '1.5rem' }}>🔥</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ff6b6b' }}>
              Active Sale: {banners.find((b) => b.isActive).title}
            </div>
            {banners.find((b) => b.isActive).discountCode && (
              <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginTop: 2 }}>
                Code: <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
                  {banners.find((b) => b.isActive).discountCode}
                </code>
                {' '}— {banners.find((b) => b.isActive).discountPercent}% off
              </div>
            )}
          </div>
          <span className="badge badge--active" style={{ marginLeft: 'auto' }}>● LIVE</span>
        </div>
      )}

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-card">
        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-spinner"><div className="admin-spinner__ring" /></div>
          ) : banners.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty__icon">🏷️</span>
              <span className="admin-empty__text">No sale banners yet. Create one!</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Duration</th>
                  <th>Active</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {banners.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          className="admin-color-preview"
                          style={{ background: b.bgColor }}
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{b.title}</div>
                          {b.subtitle && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                              {b.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      {b.discountCode ? (
                        <code style={{
                          background: 'var(--admin-surface-2)',
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: '0.82rem',
                          fontFamily: 'monospace',
                          border: '1px solid var(--admin-border)',
                        }}>
                          {b.discountCode}
                        </code>
                      ) : '—'}
                    </td>
                    <td style={{ fontWeight: 700, color: '#fdcb6e' }}>
                      {b.discountPercent ? `${b.discountPercent}%` : '—'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                      {b.startDate || b.endDate ? (
                        <span>{formatDate(b.startDate)} → {formatDate(b.endDate)}</span>
                      ) : <span>Always</span>}
                    </td>
                    <td>
                      <label className="admin-toggle">
                        <input
                          type="checkbox"
                          checked={b.isActive}
                          onChange={() => toggleActive(b)}
                        />
                        <span className="admin-toggle__track" />
                      </label>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openEdit(b)}>✏️ Edit</button>
                        <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete(b._id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">
                {editing ? 'Edit Sale Banner' : 'New Sale Banner'}
              </h2>
              <button className="admin-modal__close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="admin-modal__body">
              <form className="admin-form" onSubmit={handleSubmit}>
                <div className="admin-form-group">
                  <label>Sale Title *</label>
                  <input
                    name="title"
                    className="admin-input"
                    placeholder="Festive Season Sale"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Subtitle</label>
                  <input
                    name="subtitle"
                    className="admin-input"
                    placeholder="Up to 40% off on all ethnic wear"
                    value={form.subtitle}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Discount Code</label>
                    <input
                      name="discountCode"
                      className="admin-input"
                      placeholder="FESTIVE40"
                      value={form.discountCode}
                      onChange={handleChange}
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Discount %</label>
                    <input
                      type="number"
                      name="discountPercent"
                      className="admin-input"
                      placeholder="40"
                      min={0}
                      max={100}
                      value={form.discountPercent}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      className="admin-input"
                      value={form.startDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      className="admin-input"
                      value={form.endDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Background Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input
                        type="color"
                        name="bgColor"
                        value={form.bgColor}
                        onChange={handleChange}
                        style={{ width: 40, height: 36, padding: 2, background: 'none', border: '1px solid var(--admin-border)', borderRadius: 6, cursor: 'pointer' }}
                      />
                      <input
                        name="bgColor"
                        className="admin-input"
                        value={form.bgColor}
                        onChange={handleChange}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Text Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input
                        type="color"
                        name="textColor"
                        value={form.textColor}
                        onChange={handleChange}
                        style={{ width: 40, height: 36, padding: 2, background: 'none', border: '1px solid var(--admin-border)', borderRadius: 6, cursor: 'pointer' }}
                      />
                      <input
                        name="textColor"
                        className="admin-input"
                        value={form.textColor}
                        onChange={handleChange}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Banner Image URL (optional)</label>
                  <input
                    name="imageUrl"
                    className="admin-input"
                    placeholder="https://..."
                    value={form.imageUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-toggle">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                    />
                    <span className="admin-toggle__track" />
                    <span className="admin-toggle__label">
                      {form.isActive ? '🔥 Make this sale live on store' : 'Keep as draft'}
                    </span>
                  </label>
                </div>

                {/* Preview */}
                {(form.title || form.subtitle) && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Banner Preview</div>
                    <div style={{
                      background: form.bgColor,
                      color: form.textColor,
                      padding: '20px 24px',
                      borderRadius: 8,
                      textAlign: 'center',
                      backgroundImage: form.imageUrl ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${form.imageUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}>
                      {form.discountPercent && (
                        <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>
                          {form.discountPercent}% OFF
                        </div>
                      )}
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: 4 }}>{form.title}</div>
                      {form.subtitle && <div style={{ opacity: 0.85, fontSize: '0.85rem', marginTop: 4 }}>{form.subtitle}</div>}
                      {form.discountCode && (
                        <div style={{ marginTop: 10, display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: 20, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>
                          Use code: {form.discountCode.toUpperCase()}
                        </div>
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
                    {saving ? 'Saving...' : '💾 Save'}
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

export default AdminSales;
