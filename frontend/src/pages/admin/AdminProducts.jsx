import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://backend-gilt-three-74.vercel.app';
const token = () => JSON.parse(localStorage.getItem('manroz_user'))?.token;
const authH = () => ({ Authorization: `Bearer ${token()}` });

const STATUS_COLORS = {
  active:   { bg: 'rgba(39,174,96,0.15)',  color: '#55efc4', border: 'rgba(39,174,96,0.3)' },
  draft:    { bg: 'rgba(243,156,18,0.15)', color: '#fdcb6e', border: 'rgba(243,156,18,0.3)' },
  archived: { bg: 'rgba(85,85,85,0.2)',    color: '#888',    border: 'rgba(85,85,85,0.3)' },
  soldout:  { bg: 'rgba(192,57,43,0.15)',  color: '#ff6b6b', border: 'rgba(192,57,43,0.3)' },
};

// Is product in stock? (any variant with inventory > 0, or status is active)
const isInStock = (p) =>
  p.status === 'active' && p.variants.some(v => v.inventory > 0);

const AdminProducts = () => {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [search, setSearch]           = useState('');
  const [editing, setEditing]         = useState(null);
  const [saving, setSaving]           = useState(false);
  const [saveMsg, setSaveMsg]         = useState('');
  const [togglingId, setTogglingId]   = useState(null); // track which row is toggling

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/api/admin/products`, { headers: authH() });
        setProducts(data);
      } catch { setError('Failed to load products.'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  // Quick toggle: in-stock ↔ out-of-stock without opening modal
  const handleStockToggle = async (p) => {
    setTogglingId(p._id);
    const currentlyInStock = isInStock(p);

    try {
      if (currentlyInStock) {
        // Mark all variants inventory = 0 and status = soldout
        const updatedVariants = p.variants.map(v => ({ ...v, inventory: 0 }));
        const { data } = await axios.put(
          `${API}/api/admin/products/${p._id}`,
          { status: 'soldout', variants: updatedVariants },
          { headers: authH() }
        );
        setProducts(prev => prev.map(x => x._id === data._id ? data : x));
      } else {
        // Mark all variants inventory = 1 and status = active
        const updatedVariants = p.variants.map(v => ({ ...v, inventory: v.inventory > 0 ? v.inventory : 1 }));
        const { data } = await axios.put(
          `${API}/api/admin/products/${p._id}`,
          { status: 'active', variants: updatedVariants },
          { headers: authH() }
        );
        setProducts(prev => prev.map(x => x._id === data._id ? data : x));
      }
    } catch {
      alert('Stock toggle failed.');
    } finally {
      setTogglingId(null);
    }
  };

  const openEdit = (p) => {
    setEditing({
      _id: p._id,
      title: p.title,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice || '',
      status: p.status,
      featured: p.featured,
      variants: p.variants.map(v => ({ ...v })),
      images: p.images,
      category: p.category,
    });
    setSaveMsg('');
  };

  const handleVariantChange = (i, field, val) => {
    setEditing(prev => {
      const variants = [...prev.variants];
      variants[i] = { ...variants[i], [field]: field === 'size' ? val : Number(val) };
      return { ...prev, variants };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setSaveMsg('');
    try {
      const payload = {
        basePrice:      Number(editing.basePrice),
        compareAtPrice: editing.compareAtPrice ? Number(editing.compareAtPrice) : undefined,
        status:         editing.status,
        featured:       editing.featured,
        variants:       editing.variants,
      };
      const { data } = await axios.put(`${API}/api/admin/products/${editing._id}`, payload, { headers: authH() });
      setProducts(prev => prev.map(p => p._id === data._id ? data : p));
      setSaveMsg('Saved!');
      setTimeout(() => setEditing(null), 700);
    } catch (e) {
      setSaveMsg(e.response?.data?.message || 'Save failed.');
    } finally { setSaving(false); }
  };

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">{products.length} products in store</p>
        </div>
      </div>

      {/* Search */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card__header">
          <input
            className="admin-search"
            placeholder="🔍 Search by name or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-card">
        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-spinner"><div className="admin-spinner__ring" /></div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty__icon">🛍️</span>
              <span className="admin-empty__text">No products found</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Base Price</th>
                  <th>Compare Price</th>
                  <th>Discount</th>
                  <th>Variants</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const disc = p.compareAtPrice
                    ? Math.round(((p.compareAtPrice - p.basePrice) / p.compareAtPrice) * 100)
                    : 0;
                  const st = STATUS_COLORS[p.status] || STATUS_COLORS.draft;
                  return (
                    <tr key={p._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {p.images?.[0] && (
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', maxWidth: 200 }}>{p.title}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>{p.handle}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>{p.category}</td>
                      <td style={{ fontWeight: 700, color: '#55efc4' }}>₹{p.basePrice.toLocaleString('en-IN')}</td>
                      <td style={{ color: 'var(--admin-text-muted)', textDecoration: 'line-through', fontSize: '0.82rem' }}>
                        {p.compareAtPrice ? `₹${p.compareAtPrice.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td>
                        {disc > 0 ? (
                          <span style={{ background: 'rgba(39,174,96,0.15)', color: '#55efc4', border: '1px solid rgba(39,174,96,0.3)', padding: '2px 8px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                            -{disc}%
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                        {p.variants.map(v => v.size).join(', ')}
                      </td>
                      {/* ── Stock toggle ── */}
                      <td>
                        <label className="admin-toggle" style={{ cursor: togglingId === p._id ? 'wait' : 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={isInStock(p)}
                            disabled={togglingId === p._id}
                            onChange={() => handleStockToggle(p)}
                          />
                          <span className="admin-toggle__track" />
                          <span className="admin-toggle__label" style={{
                            fontSize: '0.75rem',
                            color: isInStock(p) ? '#55efc4' : '#ff6b6b',
                            fontWeight: 600,
                          }}>
                            {togglingId === p._id ? '...' : isInStock(p) ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </label>
                      </td>
                      <td>
                        <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize' }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {p.featured ? '⭐' : <span style={{ color: 'var(--admin-text-dim)' }}>—</span>}
                      </td>
                      <td>
                        <button className="admin-btn admin-btn--primary admin-btn--sm" onClick={() => openEdit(p)}>
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Edit modal ─────────────────────────────────────────────────────── */}
      {editing && (
        <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
          <div className="admin-modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">Edit Product</h2>
              <button className="admin-modal__close" onClick={() => setEditing(null)}>✕</button>
            </div>
            <div className="admin-modal__body">
              {/* Product thumbnail header */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20, background: 'var(--admin-surface-2)', padding: '12px 14px', borderRadius: 8 }}>
                {editing.images?.[0] && (
                  <img src={editing.images[0]} alt={editing.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{editing.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: 2 }}>{editing.category}</div>
                </div>
              </div>

              <form className="admin-form" onSubmit={handleSave}>
                {/* Base price + Compare price */}
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Base Price (₹) *</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={editing.basePrice}
                      onChange={e => setEditing(p => ({ ...p, basePrice: e.target.value }))}
                      min={0}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Compare At Price (₹) <span style={{ color: 'var(--admin-text-dim)', fontWeight: 400 }}>(original/MRP)</span></label>
                    <input
                      type="number"
                      className="admin-input"
                      value={editing.compareAtPrice}
                      onChange={e => setEditing(p => ({ ...p, compareAtPrice: e.target.value }))}
                      min={0}
                      placeholder="Leave blank to remove discount"
                    />
                  </div>
                </div>

                {/* Live discount preview */}
                {editing.compareAtPrice && Number(editing.compareAtPrice) > Number(editing.basePrice) && (
                  <div style={{ background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', color: '#55efc4', marginTop: -4 }}>
                    🏷️ Discount: <strong>{Math.round(((editing.compareAtPrice - editing.basePrice) / editing.compareAtPrice) * 100)}% off</strong>
                    {' '}— Customer pays ₹{Number(editing.basePrice).toLocaleString('en-IN')} instead of ₹{Number(editing.compareAtPrice).toLocaleString('en-IN')}
                  </div>
                )}

                {/* Status + Featured */}
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Status</label>
                    <select
                      className="admin-select"
                      value={editing.status}
                      onChange={e => setEditing(p => ({ ...p, status: e.target.value }))}
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="soldout">Sold Out</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="admin-form-group" style={{ justifyContent: 'flex-end' }}>
                    <label>Featured on Homepage</label>
                    <label className="admin-toggle">
                      <input
                        type="checkbox"
                        checked={editing.featured}
                        onChange={e => setEditing(p => ({ ...p, featured: e.target.checked }))}
                      />
                      <span className="admin-toggle__track" />
                      <span className="admin-toggle__label">{editing.featured ? '⭐ Featured' : 'Not featured'}</span>
                    </label>
                  </div>
                </div>

                {/* Per-variant pricing */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Variant Pricing & Inventory
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {editing.variants.map((v, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 80px', gap: 8, alignItems: 'center', background: 'var(--admin-surface-2)', padding: '10px 12px', borderRadius: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#74b9ff' }}>{v.size}</div>
                        <div className="admin-form-group" style={{ gap: 3 }}>
                          <label style={{ fontSize: '0.68rem' }}>Price (₹)</label>
                          <input
                            type="number"
                            className="admin-input"
                            value={v.price}
                            onChange={e => handleVariantChange(i, 'price', e.target.value)}
                            min={0}
                            style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                          />
                        </div>
                        <div className="admin-form-group" style={{ gap: 3 }}>
                          <label style={{ fontSize: '0.68rem' }}>Compare (₹)</label>
                          <input
                            type="number"
                            className="admin-input"
                            value={v.compareAtPrice || ''}
                            onChange={e => handleVariantChange(i, 'compareAtPrice', e.target.value)}
                            min={0}
                            style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                          />
                        </div>
                        <div className="admin-form-group" style={{ gap: 3 }}>
                          <label style={{ fontSize: '0.68rem' }}>Stock</label>
                          <input
                            type="number"
                            className="admin-input"
                            value={v.inventory}
                            onChange={e => handleVariantChange(i, 'inventory', e.target.value)}
                            min={0}
                            style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {saveMsg && (
                  <div className={`admin-alert ${saveMsg === 'Saved!' ? 'admin-alert--success' : 'admin-alert--error'}`}>
                    {saveMsg}
                  </div>
                )}

                <div className="admin-modal__footer" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setEditing(null)}>Cancel</button>
                  <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                    {saving ? 'Saving...' : '💾 Save Changes'}
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

export default AdminProducts;
