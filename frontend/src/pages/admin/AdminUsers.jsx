import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'https://backend-gilt-three-74.vercel.app';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const token = () => JSON.parse(localStorage.getItem('manroz_user'))?.token;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/admin/users?page=${page}&limit=15`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setUsers(data.users);
      setPages(data.pages);
      setTotal(data.total);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await axios.delete(`${API}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = search
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-subtitle">{total} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card__header">
          <input
            type="text"
            className="admin-search"
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              <span className="admin-empty__icon">👥</span>
              <span className="admin-empty__text">No users found</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32,
                          background: 'linear-gradient(135deg, #c0392b, #8b1a2e)',
                          borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                        }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                      {u.email}
                    </td>
                    <td>
                      <span className={`badge badge--${u.role}`}>{u.role}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{u.orderCount}</td>
                    <td style={{ fontWeight: 600, color: '#55efc4' }}>
                      {u.totalSpent > 0 ? `₹${u.totalSpent.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td>
                      {u._id !== currentUser?._id && u.role !== 'admin' && (
                        <button
                          className="admin-btn admin-btn--danger admin-btn--sm"
                          onClick={() => handleDelete(u._id, u.name)}
                          disabled={deleting === u._id}
                        >
                          {deleting === u._id ? '...' : '🗑 Delete'}
                        </button>
                      )}
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
    </div>
  );
};

export default AdminUsers;
