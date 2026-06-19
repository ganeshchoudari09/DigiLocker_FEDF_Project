import { Link } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';
import { GOVERNMENT_SERVICES } from '../data/mockData';
import { Users, FileText, Link2, Shield, Settings, ArrowRight } from 'lucide-react';
import './Pages.css';
import './admin/AdminPages.css';

export default function Admin() {
  const { stats, documents } = useDocuments();
  const { getAllUsers } = useAuth();

  const allUsers = getAllUsers();
  const regularUserCount = allUsers.filter((u) => u.role !== 'admin').length;

  const quickLinks = [
    { to: '/admin/users', icon: Users, label: 'Manage Users', desc: `${regularUserCount} registered users` },
    { to: '/admin/documents', icon: FileText, label: 'User Documents', desc: `${documents.length} total documents` },
    { to: '/admin/settings', icon: Settings, label: 'Admin Settings', desc: 'Platform configuration' },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Platform analytics and user management</p>

      <div className="admin-stats">
        {[
          { icon: Users, label: 'Total Users', value: regularUserCount },
          { icon: FileText, label: 'Documents', value: stats.total },
          { icon: Link2, label: 'Linked Services', value: GOVERNMENT_SERVICES.filter((s) => s.linked).length },
          { icon: Shield, label: 'Verifications', value: documents.filter((d) => d.status === 'verified').length },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="admin-stat-card premium-card">
              <Icon size={24} color="var(--violet)" style={{ marginBottom: 8 }} />
              <div className="value">{s.value}</div>
              <div className="label">{s.label}</div>
            </div>
          );
        })}
      </div>

      <h3 className="section-title">Quick Access</h3>
      <div className="admin-quick-links">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.to} to={link.to} className="admin-quick-link premium-card">
              <Icon size={24} color="var(--violet)" />
              <div>
                <strong>{link.label}</strong>
                <p>{link.desc}</p>
              </div>
              <ArrowRight size={18} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
            </Link>
          );
        })}
      </div>

      <h3 className="section-title">Government Service Linking</h3>
      <div className="service-list" style={{ marginBottom: 32 }}>
        {GOVERNMENT_SERVICES.map((s) => (
          <div key={s.id} className="service-item premium-card">
            <div>
              <h4>{s.name}</h4>
              <p>{s.dept}</p>
            </div>
            <span className={`badge ${s.linked ? 'badge-verified' : 'badge-pending'}`}>
              {s.linked ? 'Linked' : 'Not Linked'}
            </span>
            <button className="btn-secondary" style={{ padding: '8px 16px' }}>
              {s.linked ? 'Manage' : 'Link'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
