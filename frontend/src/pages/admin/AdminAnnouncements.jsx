import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://backend-gilt-three-74.vercel.app';

const EMPTY_FORM = {
  text: '',
  link: '',
  linkLabel: '',
  bgColor: '#8b1a2e',
  textColor: '#ffffff',
  isActive: true,
  priority: 0,
};

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = new
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const token = () => JSON.parse(localStorage.getItem('manroz_user'))?.token;

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/admin/announcements`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setAnnouncements(data);
    } catch {
      setError('Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSaveMsg('');
    setModalOpen(true);
  };

  const openEdit = (ann) => {
    setEditing(ann);
    setForm({
      text: ann.text,
      link: ann.link || '',
      linkLabel: ann.linkLabel || '',
      bgColor: ann.bgColor || '#8b1a2e',
      textColor: ann.textColor || '#ffffff',
      isActive: ann.isActive,
      priority: ann.priority || 0,
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
    try {
      if (editing) {
        const { data } = await axios.put(
          `${API}/api/admin/announcements/${editing._id}`,
          form,
          { headers: { Authorization: `Bearer ${token()}` } }
        );
        setAnnouncements((prev) => prev.map((a) => (a._id === editing._id ? data : a)));
      } else {
        const { data } = await axios.post(`${API}/api/admin/announcements`, form, {
          headers: { Authorization: `Bearer ${token()}` },
        });
        setAnnouncements((prev) => [data, ...prev]);
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
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await axios.delete(`${API}/api/admin/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert('Delete failed.');
    }
  };

  const toggleActive = async (ann) => {
    try {
      const { data } = await axios.put(
        `${API}/api/admin/announcements/${ann._id}`,
        { isActive: !ann.isActive },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setAnnouncements((prev) => prev.map((a) => (a._id === ann._id ? data : a)));
    } catch {
      alert('Toggle failed.');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Announcements</h1>
          <p className="admin-page-subtitle">Manage the marquee / top-bar announcements shown on your store</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>
          + New Announcement
        </button>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-card">
        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-spinner"><div className="admin-spinner__ring" /></div>
          ) : announcements.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty__icon">📢</span>
              <span className="admin-empty__text">No announcements yet. Create one!</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Text</th>
                  <th>Preview</th>
                  <th>Link</th>
                  <th>Priority</th>
                  <th>Active</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((ann) => (
                  <tr key={ann._id}>
                    <td style={{ maxWidth: 260 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.87rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ann.text}
                      </div>
                    </td>
                    <td>
                      <div style={{
                        background: ann.bgColor,
                        color: ann.textColor,
                        padding: '4px 12px',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-block',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {ann.text}
                      </div>
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                      {ann.link || '—'}
                    </td>
                    <td style={{ textAlign: 'center' }}>{ann.priority}</td>
                    <td>
                      <label className="admin-toggle">
                        <input
                          type="checkbox"
                          checked={ann.isActive}
                          onChange={() => toggleActive(ann)}
                        />
                        <span className="admin-toggle__track" />
                      </label>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openEdit(ann)}>✏️ Edit</button>
                        <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete(ann._id)}>🗑</button>
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
                {editing ? 'Edit Announcement' : 'New Announcement'}
              </h2>
              <button className="admin-modal__close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="admin-modal__body">
              <form className="admin-form" onSubmit={handleSubmit}>
                <div className="admin-form-group">
                  <label>Announcement Text *</label>
                  <input
                    name="text"
                    className="admin-input"
                    placeholder="🎉 Free shipping on orders above ₹2000!"
                    value={form.text}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Link URL (optional)</label>
                    <input
                      name="link"
                      className="admin-input"
                      placeholder="/shop"
                      value={form.link}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Link Label (optional)</label>
                    <input
                      name="linkLabel"
                      className="admin-input"
                      placeholder="Shop Now"
                      value={form.linkLabel}
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

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Priority (higher = first)</label>
                    <input
                      type="number"
                      name="priority"
                      className="admin-input"
                      value={form.priority}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                  <div className="admin-form-group" style={{ justifyContent: 'flex-end' }}>
                    <label>Active</label>
                    <label className="admin-toggle">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                      />
                      <span className="admin-toggle__track" />
                      <span className="admin-toggle__label">{form.isActive ? 'Visible on store' : 'Hidden'}</span>
                    </label>
                  </div>
                </div>

                {/* Live preview */}
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Preview</div>
                  <div style={{
                    background: form.bgColor,
                    color: form.textColor,
                    padding: '10px 20px',
                    borderRadius: 6,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}>
                    {form.text || 'Your announcement text here...'}
                    {form.linkLabel && <span style={{ marginLeft: 12, textDecoration: 'underline' }}>{form.linkLabel}</span>}
                  </div>
                </div>

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

export default AdminAnnouncements;
