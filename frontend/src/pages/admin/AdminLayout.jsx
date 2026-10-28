import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '▣', end: true },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/products', label: 'Products', icon: '🛍️' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/announcements', label: 'Announcements', icon: '📢' },
  { to: '/admin/sales', label: 'Sales & Offers', icon: '🏷️' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__logo">M</span>
          <span className="admin-sidebar__name">MANROZ</span>
          <span className="admin-sidebar__badge">Admin</span>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-item__icon">{item.icon}</span>
              <span className="admin-nav-item__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-name">{user?.name}</span>
              <span className="admin-sidebar__user-role">Administrator</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            ⏻ Logout
          </button>
          <a href="/" className="admin-visit-btn" target="_blank" rel="noreferrer">
            ↗ Visit Site
          </a>
        </div>
      </aside>

      {/* Main area */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <button
            className="admin-topbar__menu-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <h1 className="admin-topbar__title">Admin Panel</h1>
          <div className="admin-topbar__right">
            <span className="admin-topbar__user">Hi, {user?.name?.split(' ')[0]}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
