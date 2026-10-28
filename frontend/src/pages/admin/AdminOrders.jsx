import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://backend-gilt-three-74.vercel.app';

const ORDER_STATUSES   = ['', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['', 'pending', 'paid', 'failed'];

const token = () => JSON.parse(localStorage.getItem('manroz_user'))?.token;
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

// ── Payment method icon ───────────────────────────────────────────────────────
const METHOD_ICON = { card: '💳', upi: '📱', netbanking: '🏦', wallet: '👝', emi: '📅' };

const PaymentMethodBadge = ({ method }) => (
  <span style={{
    background: 'rgba(41,128,185,0.15)',
    color: '#74b9ff',
    border: '1px solid rgba(41,128,185,0.3)',
    padding: '2px 10px',
    borderRadius: 20,
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  }}>
    {METHOD_ICON[method] || '💰'} {method}
  </span>
);

// ── Razorpay panel ─────────────────────────────────────────────────────────────
const RazorpayPanel = ({ orderId, paymentId }) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const fetch = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.get(`${API}/api/admin/orders/${orderId}/razorpay-payment`, { headers: authHeader() });
      setData(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load payment details');
    } finally { setLoading(false); }
  };

  if (!paymentId) return null;

  return (
    <div style={{ background: 'var(--admin-surface-2)', borderRadius: 8, padding: '14px 16px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: data ? 12 : 0 }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#74b9ff' }}>💳 Razorpay Payment</span>
        {!data && (
          <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={fetch} disabled={loading}>
            {loading ? 'Loading...' : 'Load Details'}
          </button>
        )}
      </div>
      {error && <div style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: 6 }}>{error}</div>}
      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', fontSize: '0.82rem', marginTop: 4 }}>
          <InfoRow label="Payment ID"    value={<code style={{ fontSize: '0.75rem', color: '#ccc' }}>{data.id}</code>} />
          <InfoRow label="Amount"        value={<strong style={{ color: '#55efc4' }}>₹{(data.amount / 100).toLocaleString('en-IN')}</strong>} />
          <InfoRow label="Status"        value={<span className={`badge badge--${data.status === 'captured' ? 'paid' : 'failed'}`}>{data.status}</span>} />
          <InfoRow label="Method"        value={<PaymentMethodBadge method={data.method} />} />
          {data.method === 'card' && data.card && (
            <>
              <InfoRow label="Card"     value={`${data.card.network} •••• ${data.card.last4}`} />
              <InfoRow label="Card Type" value={data.card.type} />
            </>
          )}
          {data.method === 'upi' && (
            <InfoRow label="UPI VPA" value={data.vpa} />
          )}
          {data.method === 'netbanking' && (
            <InfoRow label="Bank" value={data.bank} />
          )}
          {data.method === 'wallet' && (
            <InfoRow label="Wallet" value={data.wallet} />
          )}
          <InfoRow label="Contact" value={data.contact} />
          <InfoRow label="Email"   value={data.email} />
          <InfoRow label="Date"    value={new Date(data.created_at * 1000).toLocaleString('en-IN')} />
          {data.description && <InfoRow label="Note" value={data.description} />}
        </div>
      )}
      {!data && !loading && !error && (
        <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-dim)', marginTop: 4, fontFamily: 'monospace' }}>
          ID: {paymentId}
        </div>
      )}
    </div>
  );
};

// ── Shiprocket tracking panel ──────────────────────────────────────────────────
const ShiprocketPanel = ({ shipmentId, shiprocketOrderId }) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const track = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.get(`${API}/api/shiprocket/track/${shipmentId}`, { headers: authHeader() });
      setData(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Tracking failed. Shipment may not be assigned yet.');
    } finally { setLoading(false); }
  };

  if (!shipmentId && !shiprocketOrderId) return null;

  const trackInfo = data?.tracking_data?.shipment_track?.[0];
  const activities = data?.tracking_data?.shipment_track_activities || [];

  return (
    <div style={{ background: 'var(--admin-surface-2)', borderRadius: 8, padding: '14px 16px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: data ? 12 : 0 }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fdcb6e' }}>🚚 Shiprocket Tracking</span>
        {shipmentId && (
          <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={track} disabled={loading}>
            {loading ? 'Tracking...' : data ? '🔄 Refresh' : 'Track Shipment'}
          </button>
        )}
      </div>

      {/* IDs row */}
      <div style={{ fontFamily: 'monospace', fontSize: '0.73rem', color: 'var(--admin-text-dim)', marginBottom: data ? 10 : 0 }}>
        {shiprocketOrderId && <span style={{ marginRight: 12 }}>Order: {shiprocketOrderId}</span>}
        {shipmentId       && <span>Shipment: {shipmentId}</span>}
      </div>

      {error && <div style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: 6 }}>{error}</div>}

      {trackInfo && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', fontSize: '0.82rem', margin: '10px 0 14px' }}>
            <InfoRow label="Current Status" value={
              <span style={{ fontWeight: 700, color: '#fdcb6e' }}>{trackInfo.current_status}</span>
            } />
            <InfoRow label="Courier"   value={trackInfo.courier_name} />
            <InfoRow label="AWB Code"  value={<code style={{ fontSize: '0.75rem', color: '#ccc' }}>{trackInfo.awb_code}</code>} />
            {trackInfo.etd && <InfoRow label="ETA" value={trackInfo.etd} />}
            {trackInfo.delivered_date && <InfoRow label="Delivered" value={trackInfo.delivered_date} />}
          </div>

          {/* Activity log */}
          {activities.length > 0 && (
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Shipment Activity
              </div>
              <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {activities.map((act, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 12, padding: '8px 10px',
                    background: i === 0 ? 'rgba(243,156,18,0.08)' : 'var(--admin-surface-3)',
                    borderRadius: 6,
                    borderLeft: i === 0 ? '3px solid #fdcb6e' : '3px solid transparent',
                  }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', flexShrink: 0, width: 120 }}>
                      {act.date}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: i === 0 ? 600 : 400 }}>{act.activity}</div>
                      {act.location && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: 1 }}>
                          📍 {act.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ── Helper ─────────────────────────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <>
    <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>{label}</span>
    <span>{value || '—'}</span>
  </>
);

// ── Main component ─────────────────────────────────────────────────────────────
const AdminOrders = () => {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [page, setPage]                   = useState(1);
  const [pages, setPages]                 = useState(1);
  const [total, setTotal]                 = useState(0);
  const [statusFilter, setStatusFilter]   = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating]           = useState(false);
  const [updateMsg, setUpdateMsg]         = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (statusFilter)  params.append('status', statusFilter);
      if (paymentFilter) params.append('payment', paymentFilter);
      const { data } = await axios.get(`${API}/api/admin/orders?${params}`, { headers: authHeader() });
      setOrders(data.orders);
      setPages(data.pages);
      setTotal(data.total);
    } catch {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, paymentFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const openDetail = async (id) => {
    try {
      const { data } = await axios.get(`${API}/api/admin/orders/${id}`, { headers: authHeader() });
      setSelectedOrder(data);
      setUpdateMsg('');
    } catch { alert('Could not load order details.'); }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true); setUpdateMsg('');
    const form = e.target;
    try {
      await axios.put(
        `${API}/api/admin/orders/${selectedOrder._id}/status`,
        { orderStatus: form.orderStatus.value, paymentStatus: form.paymentStatus.value },
        { headers: authHeader() }
      );
      setUpdateMsg('Updated successfully!');
      fetchOrders();
      openDetail(selectedOrder._id);
    } catch { setUpdateMsg('Update failed.'); }
    finally { setUpdating(false); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-subtitle">{total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card__header">
          <div className="admin-filters">
            <select className="admin-select" style={{ width: 160 }} value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              {ORDER_STATUSES.map(s => <option value={s} key={s}>{s || 'All Statuses'}</option>)}
            </select>
            <select className="admin-select" style={{ width: 160 }} value={paymentFilter}
              onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}>
              {PAYMENT_STATUSES.map(s => <option value={s} key={s}>{s || 'All Payments'}</option>)}
            </select>
          </div>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-card">
        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-spinner"><div className="admin-spinner__ring" /></div>
          ) : orders.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty__icon">📭</span>
              <span className="admin-empty__text">No orders found</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Shiprocket</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#888' }}>
                      #{order._id.toString().slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.user?.name || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{order.user?.email}</div>
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)' }}>{order.items?.length} item(s)</td>
                    <td style={{ fontWeight: 700, color: '#55efc4' }}>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td><span className={`badge badge--${order.paymentStatus}`}>{order.paymentStatus}</span></td>
                    <td><span className={`badge badge--${order.orderStatus}`}>{order.orderStatus}</span></td>
                    <td>
                      {order.shiprocketOrderId ? (
                        <span className="badge badge--shipped">✓ Created</span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}>—</span>
                      )}
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td>
                      <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openDetail(order._id)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pages > 1 && (
          <div className="admin-pagination">
            <span className="admin-pagination__info">Page {page} of {pages}</span>
            <button className="admin-btn admin-btn--ghost admin-btn--sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <button className="admin-btn admin-btn--ghost admin-btn--sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      {/* ── Order detail modal ─────────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">
                Order #{selectedOrder._id.toString().slice(-8).toUpperCase()}
              </h2>
              <button className="admin-modal__close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="admin-modal__body">

              {/* Customer */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</div>
                <div style={{ fontWeight: 600 }}>{selectedOrder.user?.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>{selectedOrder.user?.email}</div>
              </div>

              {/* Shipping address */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shipping Address</div>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.7, background: 'var(--admin-surface-2)', padding: '10px 14px', borderRadius: 8 }}>
                  {selectedOrder.shippingAddress.fullName}<br />
                  {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}<br />
                  {selectedOrder.shippingAddress.state} — {selectedOrder.shippingAddress.pincode}<br />
                  📱 {selectedOrder.shippingAddress.phone}
                </div>
              </div>

              {/* Items */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items</div>
                <div className="admin-order-items">
                  {selectedOrder.items.map((item, i) => (
                    <div className="admin-order-item" key={i}>
                      {item.image && <img src={item.image} alt={item.title} className="admin-order-item__img" />}
                      <div className="admin-order-item__info">
                        <div className="admin-order-item__title">{item.title}</div>
                        <div className="admin-order-item__meta">Size: {item.size} · Qty: {item.quantity}</div>
                      </div>
                      <div className="admin-order-item__price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', fontWeight: 700, fontSize: '1rem', marginBottom: 16, color: '#55efc4' }}>
                Total: ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
              </div>

              <hr className="admin-divider" />

              {/* ── Razorpay live payment details ── */}
              <RazorpayPanel
                orderId={selectedOrder._id}
                paymentId={selectedOrder.razorpayPaymentId}
              />

              {/* ── Shiprocket live tracking ── */}
              <ShiprocketPanel
                shipmentId={selectedOrder.shiprocketShipmentId}
                shiprocketOrderId={selectedOrder.shiprocketOrderId}
              />

              <hr className="admin-divider" />

              {/* Status update form */}
              <form onSubmit={handleStatusUpdate}>
                <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Update Status
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Order Status</label>
                    <select name="orderStatus" className="admin-select" defaultValue={selectedOrder.orderStatus}>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Payment Status</label>
                    <select name="paymentStatus" className="admin-select" defaultValue={selectedOrder.paymentStatus}>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
                {updateMsg && (
                  <div className={`admin-alert ${updateMsg.includes('success') ? 'admin-alert--success' : 'admin-alert--error'}`} style={{ marginTop: 10 }}>
                    {updateMsg}
                  </div>
                )}
                <div className="admin-modal__footer" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setSelectedOrder(null)}>Cancel</button>
                  <button type="submit" className="admin-btn admin-btn--primary" disabled={updating}>
                    {updating ? 'Saving...' : '💾 Save Changes'}
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

export default AdminOrders;
