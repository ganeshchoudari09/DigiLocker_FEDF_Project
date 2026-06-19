import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, RefreshCw, Layout, Shield, Mail, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import UserAvatar from '../components/profile/UserAvatar';
import './Profile.css';

function ToggleRow({ icon: Icon, title, desc, checked, onChange }) {
  return (
    <div className="settings-row premium-card">
      <Icon size={22} color="var(--violet)" />
      <div className="settings-row-text">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
      <label className="toggle-switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}

export default function Settings() {
  const { user, updateSettings, deleteAccount, loading } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const settings = user?.settings || {};

  const handleToggle = (key, value) => {
    updateSettings({ [key]: value });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount(user.id);
    if (result?.success) {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="page-container settings-page">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Customize your DigiLocker experience</p>

      {saved && <p className="profile-message success settings-saved">Settings saved!</p>}

      <div className="settings-account premium-card">
        <UserAvatar user={user} size="lg" />
        <div>
          <strong>{user?.name}</strong>
          <p>{user?.email}</p>
        </div>
      </div>

      <h3 className="settings-section-title">Appearance</h3>
      <motion.div
        className="settings-row premium-card theme-row"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {isDark ? <Moon size={22} color="var(--violet)" /> : <Sun size={22} color="var(--violet)" />}
        <div className="settings-row-text">
          <h4>Theme</h4>
          <p>Currently using {theme === 'dark' ? 'Dark' : 'Light'} mode</p>
        </div>
        <button type="button" className="btn-secondary" onClick={toggleTheme}>
          Switch to {isDark ? 'Light' : 'Dark'}
        </button>
      </motion.div>

      <h3 className="settings-section-title">Notifications</h3>
      <div className="settings-list">
        <ToggleRow
          icon={Mail}
          title="Email Notifications"
          desc="Receive updates about document verification"
          checked={settings.emailNotifications}
          onChange={(v) => handleToggle('emailNotifications', v)}
        />
        <ToggleRow
          icon={Bell}
          title="Push Notifications"
          desc="Browser alerts for shares and uploads"
          checked={settings.pushNotifications}
          onChange={(v) => handleToggle('pushNotifications', v)}
        />
      </div>

      <h3 className="settings-section-title">Vault</h3>
      <div className="settings-list">
        <ToggleRow
          icon={RefreshCw}
          title="Auto DigiLocker Sync"
          desc="Automatically sync when you open the app"
          checked={settings.autoSync}
          onChange={(v) => handleToggle('autoSync', v)}
        />
        <ToggleRow
          icon={Layout}
          title="Compact Sidebar"
          desc="Use a narrower sidebar layout"
          checked={settings.compactSidebar}
          onChange={(v) => handleToggle('compactSidebar', v)}
        />
      </div>

      <h3 className="settings-section-title">Privacy</h3>
      <div className="settings-list">
        <div className="settings-row premium-card">
          <Shield size={22} color="var(--violet)" />
          <div className="settings-row-text">
            <h4>Data Storage</h4>
            <p>Documents stored locally in your browser</p>
          </div>
          <span className="badge badge-verified">Secure</span>
        </div>
      </div>

      <h3 className="settings-section-title">Danger Zone</h3>
      <div className="settings-list">
        <div className="settings-row premium-card" style={{ borderLeft: '4px solid #EF4444' }}>
          <Trash2 size={22} color="#EF4444" />
          <div className="settings-row-text">
            <h4>Delete Account</h4>
            <p>Permanently delete your account and all associated data</p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setDeleteModal(true)}
            style={{ background: '#EF4444', color: 'white' }}
          >
            Delete
          </button>
        </div>
      </div>

      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(false)}>
          <motion.div
            className="modal-content glass-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Delete Account?</h2>
            <p style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>
              This action cannot be undone. All your documents and data will be permanently deleted.
            </p>
            <p style={{ marginBottom: 20, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              You will be logged out immediately.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setDeleteModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleDeleteAccount}
                disabled={loading}
                style={{ background: '#EF4444' }}
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
