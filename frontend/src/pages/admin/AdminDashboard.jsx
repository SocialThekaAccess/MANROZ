import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'https://backend-gilt-three-74.vercel.app';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const StatCard = ({ icon, value, label, color }) => (
  <div className={`admin-stat-card admin-stat-card--${color}`}>
    <div className="admin-stat-card__glow" />
    <span className="admin-stat-card__icon">{icon}</span>
    <div className="admin-stat-card__value">{value}</div>
    <div className="admin-stat-card__label">{label}</div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('manroz_user'))?.token;
        const { data } = await axios.get(`${API}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
      } catch {
        setError('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="admin-spinner"><div className="admin-spinner__ring" /></div>
  );

  if (error) return (
    <div className="admin-alert admin-alert--error">{error}</div>
  );

  const maxRevenue = Math.max(...(stats.monthlyRevenue.map(m => m.revenue)), 1);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back, {user?.name?.split(' ')[0]} 👋</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="admin-stats-grid">
        <StatCard icon="💰" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} label="Total Revenue" color="green" />
        <StatCard icon="📦" value={stats.totalOrders} label="Total Orders" color="blue" />
        <StatCard icon="✅" value={stats.paidOrders} label="Paid Orders" color="green" />
        <StatCard icon="⏳" value={stats.pendingOrders} label="Pending Payments" color="yellow" />
        <StatCard icon="👥" value={stats.totalUsers} label="Registered Users" color="blue" />
        <StatCard icon="🚚" value={stats.orderStatus.shipped} label="Shipped" color="blue" />
        <StatCard icon="🎉" value={stats.orderStatus.delivered} label="Delivered" color="green" />
        <StatCard icon="❌" value={stats.orderStatus.cancelled} label="Cancelled" color="red" />
      </div>

      {/* Charts row */}
      <div className="admin-chart-row">
        {/* Monthly revenue bar */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">📈 Monthly Revenue</h3>
          </div>
          <div className="admin-mini-bar">
            {stats.monthlyRevenue.length === 0 ? (
              <div className="admin-empty"><span className="admin-empty__icon">📊</span><span className="admin-empty__text">No revenue data yet</span></div>
            ) : (
              stats.monthlyRevenue.map((m) => (
                <div className="admin-mini-bar__item" key={`${m._id.year}-${m._id.month}`}>
                  <span className="admin-mini-bar__label">
                    {MONTH_NAMES[(m._id.month - 1)]} {m._id.year}
                  </span>
                  <div className="admin-mini-bar__track">
                    <div
                      className="admin-mini-bar__fill"
                      style={{
                        width: `${(m.revenue / maxRevenue) * 100}%`,
                        background: 'linear-gradient(90deg, #c0392b, #e74c3c)',
                      }}
                    />
                  </div>
                  <span className="admin-mini-bar__val" style={{ width: 80 }}>
                    ₹{(m.revenue / 1000).toFixed(1)}k
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order status breakdown */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">📊 Order Status Breakdown</h3>
          </div>
          <div className="admin-mini-bar">
            {[
              { label: 'Processing', val: stats.orderStatus.processing, color: '#fdcb6e' },
              { label: 'Shipped',    val: stats.orderStatus.shipped,    color: '#74b9ff' },
              { label: 'Delivered',  val: stats.orderStatus.delivered,  color: '#55efc4' },
              { label: 'Cancelled',  val: stats.orderStatus.cancelled,  color: '#ff6b6b' },
            ].map((row) => {
              const max = Math.max(
                stats.orderStatus.processing,
                stats.orderStatus.shipped,
                stats.orderStatus.delivered,
                stats.orderStatus.cancelled, 1
              );
              return (
                <div className="admin-mini-bar__item" key={row.label}>
                  <span className="admin-mini-bar__label">{row.label}</span>
                  <div className="admin-mini-bar__track">
                    <div
                      className="admin-mini-bar__fill"
                      style={{ width: `${(row.val / max) * 100}%`, background: row.color }}
                    />
                  </div>
                  <span className="admin-mini-bar__val">{row.val}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">🕐 Recent Paid Orders</h3>
          <Link to="/admin/orders" className="admin-btn admin-btn--ghost admin-btn--sm">
            View All →
          </Link>
        </div>
        <div className="admin-table-wrap">
          {stats.recentOrders.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty__icon">📭</span>
              <span className="admin-empty__text">No orders yet</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#888' }}>
                      #{order._id.toString().slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.user?.name || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        {order.user?.email}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#55efc4' }}>
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={`badge badge--${order.orderStatus}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
