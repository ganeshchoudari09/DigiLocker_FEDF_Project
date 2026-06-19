import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileText, Share2, PenTool, Award, HardDrive, Shield, Activity,
  Lock,
} from 'lucide-react';
import { NAV_ITEMS } from '../../data/mockData';
import { useDocuments } from '../../context/DocumentContext';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const ICON_MAP = {
  LayoutDashboard, FileText, Share2, PenTool, Award, HardDrive, Shield, Activity,
};

export default function Sidebar({ mobileOpen, onClose }) {
  const { stats } = useDocuments();
  const { adminSettings } = useAuth();
  const storagePercent = Math.min(100, Math.round((stats.total / (adminSettings?.maxDocumentsPerUser || 50)) * 100));

  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-particles">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="particle" style={{ '--i': i }} />
          ))}
        </div>

        <div className="sidebar-brand">
          <div className="brand-logo">
            <Lock size={22} />
          </div>
          <div>
            <h1 className="brand-title">DigiLocker</h1>
            <p className="brand-tagline">Your Digital Vault</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        className="nav-active-bg"
                        layoutId="sidebar-active"
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

        <div className="sidebar-storage">
          <div className="storage-header">
            <span>Storage Used</span>
            <span>{storagePercent}%</span>
          </div>
          <div className="storage-bar">
            <motion.div
              className="storage-fill"
              initial={{ width: 0 }}
              animate={{ width: `${storagePercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="storage-text">{stats.total} of {adminSettings?.maxDocumentsPerUser || 50} documents</p>
        </div>

        <div className="sidebar-security-art">
          <div className="security-shield">🛡️</div>
          <p>256-bit encrypted vault</p>
        </div>
      </aside>
    </>
  );
}
