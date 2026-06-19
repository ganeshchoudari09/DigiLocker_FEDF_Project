import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Users, FileText, Bell, Wrench, Mail, ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../../components/profile/UserAvatar';
import '../Profile.css';
import './AdminPages.css';

function ToggleRow({ icon: Icon, title, desc, checked, onChange }) {
  return (
    <div className="settings-row premium-card">
      <Icon size={22} color="#ef4444" />
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

export default function AdminSettings() {
  const { user, adminSettings, updateAdminSettings } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleToggle = (key, value) => {
    updateAdminSettings({ [key]: value });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLimitChange = (e) => {
    const value = Math.max(1, Math.min(500, parseInt(e.target.value, 10) || 50));
    updateAdminSettings({ maxDocumentsPerUser: value });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-container settings-page admin-settings-page">
      <h1 className="page-title">Admin Settings</h1>
      <p className="page-subtitle">Configure platform-wide administration preferences</p>

      {saved && <p className="profile-message success settings-saved">Settings saved!</p>}

      <div className="settings-account premium-card admin-settings-account">
        <UserAvatar user={user} size="lg" />
        <div>
          <strong>{user?.name}</strong>
          <p>{user?.email}</p>
          <span className="badge badge-rejected" style={{ marginTop: 6 }}>Administrator</span>
        </div>
      </div>

      <h3 className="settings-section-title">Platform Control</h3>
      <div className="settings-list">
        <ToggleRow
          icon={Wrench}
          title="Maintenance Mode"
          desc="Temporarily disable user access to the platform"
          checked={adminSettings.maintenanceMode}
          onChange={(v) => handleToggle('maintenanceMode', v)}
        />
        <ToggleRow
          icon={Users}
          title="Allow Registration"
          desc="Let new users create accounts on the platform"
          checked={adminSettings.allowRegistration}
          onChange={(v) => handleToggle('allowRegistration', v)}
        />
        <ToggleRow
          icon={Mail}
          title="Require Email Verification"
          desc="Users must verify email before uploading documents"
          checked={adminSettings.requireEmailVerification}
          onChange={(v) => handleToggle('requireEmailVerification', v)}
        />
      </div>

      <h3 className="settings-section-title">Document Policies</h3>
      <motion.div
        className="settings-row premium-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FileText size={22} color="#ef4444" />
        <div className="settings-row-text">
          <h4>Max Documents Per User</h4>
          <p>Limit how many documents each user can store</p>
        </div>
        <input
          type="number"
          className="admin-limit-input"
          min={1}
          max={500}
          value={adminSettings.maxDocumentsPerUser}
          onChange={handleLimitChange}
        />
      </motion.div>

      <h3 className="settings-section-title">Monitoring</h3>
      <div className="settings-list">
        <ToggleRow
          icon={ClipboardList}
          title="Audit Logging"
          desc="Log all admin and user actions for review"
          checked={adminSettings.auditLogging}
          onChange={(v) => handleToggle('auditLogging', v)}
        />
        <ToggleRow
          icon={Bell}
          title="Notify on New User"
          desc="Send admin alert when a new user registers"
          checked={adminSettings.notifyOnNewUser}
          onChange={(v) => handleToggle('notifyOnNewUser', v)}
        />
      </div>

      <h3 className="settings-section-title">Security</h3>
      <div className="settings-list">
        <div className="settings-row premium-card">
          <Shield size={22} color="#ef4444" />
          <div className="settings-row-text">
            <h4>Admin Access</h4>
            <p>Only accounts with admin role can access this panel</p>
          </div>
          <span className="badge badge-verified">Protected</span>
        </div>
      </div>
    </div>
  );
}
