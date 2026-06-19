import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, Settings, Shield, LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const ADMIN_NAV = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/documents', label: 'Documents', icon: FileText },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose?.();
    window.location.href = '/admin-login';
  };

  return (
    <>
      <div className={`admin-sidebar-overlay ${mobileOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-brand-logo">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="admin-brand-title">Admin Panel</h1>
            <p className="admin-brand-tagline">DigiLocker Control</p>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        className="admin-nav-active-bg"
                        layoutId="admin-sidebar-active"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">{user?.avatar || 'AD'}</div>
            <div>
              <strong>{user?.name}</strong>
              <p>{user?.email}</p>
            </div>
          </div>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
