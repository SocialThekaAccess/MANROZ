import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-gilt-three-74.vercel.app';

const statusColors = {
  processing: { bg: '#fff8e1', color: '#f59e0b', label: '⏳ Processing' },
  shipped: { bg: '#e0f2fe', color: '#0284c7', label: '🚚 Shipped' },
  delivered: { bg: '#dcfce7', color: '#16a34a', label: '✅ Delivered' },
  cancelled: { bg: '#fee2e2', color: '#dc2626', label: '❌ Cancelled' },
  paid: { bg: '#dcfce7', color: '#16a34a', label: '✅ Paid' },
  pending: { bg: '#fff8e1', color: '#f59e0b', label: '⏳ Pending' },
  failed: { bg: '#fee2e2', color: '#dc2626', label: '❌ Failed' },
};

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('manroz_user'))?.token;
        const { data } = await axios.get(`${API_URL}/api/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '👤';

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <main className="account-page">
      {/* Welcome Hero */}
      <section className="account-hero">
        <div className="account-hero-inner">
          <div className="account-avatar">{initials}</div>
          <div className="account-welcome-text">
            <p className="account-greeting">Welcome back 🎉</p>
            <h1 className="account-name">{user.name}</h1>
            <p className="account-email">{user.email}</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="account-actions">
        <div className="account-actions-inner">
          <Link to="/shop" className="account-action-card">
            <span className="account-action-icon">🛍️</span>
            <span className="account-action-label">Shop Now</span>
            <span className="account-action-sub">Explore new arrivals</span>
          </Link>
          <Link to="/cart" className="account-action-card">
            <span className="account-action-icon">🛒</span>
            <span className="account-action-label">My Cart</span>
            <span className="account-action-sub">View saved items</span>
          </Link>
          <div className="account-action-card">
            <span className="account-action-icon">📦</span>
            <span className="account-action-label">My Orders</span>
            <span className="account-action-sub">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="account-action-card" onClick={handleLogout} style={{cursor:'pointer'}}>
            <span className="account-action-icon">🚪</span>
            <span className="account-action-label">Logout</span>
            <span className="account-action-sub">Sign out safely</span>
          </div>
        </div>
      </section>

      {/* Orders Section */}
      <section className="account-orders">
        <div className="account-orders-inner">
          <h2 className="account-section-title">My Orders</h2>

          {ordersLoading ? (
            <div className="account-orders-loading">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="account-orders-empty">
              <div className="account-orders-empty-icon">📭</div>
              <h3>No orders yet</h3>
              <p>Looks like you haven't placed any orders. Start shopping and enjoy flat 50% off!</p>
              <Link to="/shop" className="account-shop-btn">Shop Now — 50% OFF</Link>
            </div>
          ) : (
            <div className="account-orders-list">
              {orders.map((order) => {
                const payStatus = statusColors[order.paymentStatus] || statusColors.pending;
                const ordStatus = statusColors[order.orderStatus] || statusColors.processing;
                return (
                  <div key={order._id} className="account-order-card">
                    {/* Order Header */}
                    <div className="order-card-header">
                      <div>
                        <span className="order-card-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                        <span className="order-card-date">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="order-card-badges">
                        <span className="order-badge" style={{background: payStatus.bg, color: payStatus.color}}>
                          {payStatus.label}
                        </span>
                        <span className="order-badge" style={{background: ordStatus.bg, color: ordStatus.color}}>
                          {ordStatus.label}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="order-card-items">
                      {order.items.map((item, i) => (
                        <div key={i} className="order-card-item">
                          {item.image && (
                            <img src={item.image} alt={item.title}
                              onError={(e) => { e.target.src = 'https://placehold.co/50x60/f5f0eb/333?text=M'; }} />
                          )}
                          <div className="order-item-info">
                            <p className="order-item-title">{item.title}</p>
                            <p className="order-item-meta">Size: {item.size} × {item.quantity}</p>
                            <p className="order-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="order-card-footer">
                      <div className="order-card-address">
                        <span>📍 {order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
                      </div>
                      <div className="order-card-total">
                        Total: <strong>₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Profile Details */}
      <section className="account-profile">
        <div className="account-profile-inner">
          <h2 className="account-section-title">Profile Details</h2>
          <div className="account-profile-card">
            <div className="account-profile-row">
              <span className="account-profile-label">Full Name</span>
              <span className="account-profile-value">{user.name}</span>
            </div>
            <div className="account-profile-row">
              <span className="account-profile-label">Email</span>
              <span className="account-profile-value">{user.email}</span>
            </div>
            <div className="account-profile-row">
              <span className="account-profile-label">Total Orders</span>
              <span className="account-profile-value">{orders.length}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Account;
