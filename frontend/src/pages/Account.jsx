import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // First letter for avatar
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '👤';

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
            <span className="account-action-sub">Track your orders</span>
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
          <div className="account-orders-empty">
            <div className="account-orders-empty-icon">📭</div>
            <h3>No orders yet</h3>
            <p>Looks like you haven't placed any orders. Start shopping and enjoy flat 50% off!</p>
            <Link to="/shop" className="account-shop-btn">
              Shop Now — 50% OFF
            </Link>
          </div>
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
              <span className="account-profile-label">Member Since</span>
              <span className="account-profile-value">October 2026</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Account;
