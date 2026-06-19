import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Phone, Shield, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import UserAvatar from '../../components/profile/UserAvatar';
import '../Pages.css';
import './AdminPages.css';

export default function AdminUsers() {
  const { getAllUsers } = useAuth();
  const { documents } = useDocuments();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const allUsers = getAllUsers();

  const usersWithStats = useMemo(() => {
    return allUsers.map((u) => ({
      ...u,
      docCount: documents.filter((d) => d.userId === u.id).length,
    }));
  }, [allUsers, documents]);

  const filtered = useMemo(() => {
    if (!search.trim()) return usersWithStats;
    const q = search.toLowerCase();
    return usersWithStats.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone || '').toLowerCase().includes(q)
    );
  }, [usersWithStats, search]);

  const regularUsers = filtered.filter((u) => u.role !== 'admin');
  const adminUsers = filtered.filter((u) => u.role === 'admin');

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">All Users</h1>
          <p className="page-subtitle">View and manage all registered platform users</p>
        </div>
        <div className="admin-search-bar glass-card">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-stats" style={{ marginBottom: 24 }}>
        <div className="admin-stat-card premium-card">
          <Users size={24} color="var(--violet)" style={{ marginBottom: 8 }} />
          <div className="value">{regularUsers.length}</div>
          <div className="label">Registered Users</div>
        </div>
        <div className="admin-stat-card premium-card">
          <Shield size={24} color="var(--violet)" style={{ marginBottom: 8 }} />
          <div className="value">{adminUsers.length}</div>
          <div className="label">Administrators</div>
        </div>
        <div className="admin-stat-card premium-card">
          <FileText size={24} color="var(--violet)" style={{ marginBottom: 8 }} />
          <div className="value">{documents.length}</div>
          <div className="label">Total Documents</div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state premium-card">
          <Users size={48} color="var(--violet)" />
          <h3>No users found</h3>
          <p>No users match your search criteria.</p>
        </div>
      ) : (
        <div className="admin-users-grid">
          {filtered.map((u, i) => (
            <motion.div
              key={u.id}
              className="admin-user-card premium-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="admin-user-card-header">
                <UserAvatar user={u} size="md" />
                <div className="admin-user-card-info">
                  <h3>{u.name}</h3>
                  <span className={`badge ${u.role === 'admin' ? 'badge-rejected' : 'badge-verified'}`}>
                    {u.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>

              <div className="admin-user-details">
                <div className="admin-user-detail-row">
                  <Mail size={16} />
                  <span>{u.email}</span>
                </div>
                {u.phone && (
                  <div className="admin-user-detail-row">
                    <Phone size={16} />
                    <span>{u.phone}</span>
                  </div>
                )}
                <div className="admin-user-detail-row">
                  <FileText size={16} />
                  <span>{u.docCount} document{u.docCount !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="admin-user-status-row">
                <span className={`badge ${u.verified ? 'badge-verified' : 'badge-pending'}`}>
                  {u.verified ? 'Verified' : 'Unverified'}
                </span>
                <span className={`badge ${u.aadhaarLinked ? 'badge-verified' : 'badge-pending'}`}>
                  {u.aadhaarLinked ? 'Aadhaar Linked' : 'Aadhaar Not Linked'}
                </span>
              </div>

              <p className="admin-user-id">User ID: {u.id}</p>

              <div className="admin-user-actions">
                <button className="btn-secondary" onClick={() => navigate(`/admin/documents?user=${u.id}`)}>View Documents</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
