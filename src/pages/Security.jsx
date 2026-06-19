import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Smartphone, Bell, Check, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

export default function Security() {
  const { user, loading, changePassword, updateSecuritySettings } = useAuth();
  const [changePassModal, setChangePassModal] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });
  const [passError, setPassError] = useState('');
  const [passSaved, setPassSaved] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  const security = user?.security || {};

  const handleToggleSecurity = (key) => {
    updateSecuritySettings({ [key]: !security[key] });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');

    if (!passForm.current || !passForm.new || !passForm.confirm) {
      setPassError('All fields are required.');
      return;
    }

    if (passForm.new !== passForm.confirm) {
      setPassError('New passwords do not match.');
      return;
    }

    if (passForm.new.length < 6) {
      setPassError('Password must be at least 6 characters.');
      return;
    }

    if (passForm.current === passForm.new) {
      setPassError('New password must be different from current password.');
      return;
    }

    const result = await changePassword(user.email, passForm.current, passForm.new);
    if (!result?.success) {
      setPassError(result?.error || 'Failed to change password.');
      return;
    }

    setPassForm({ current: '', new: '', confirm: '' });
    setChangePassModal(false);
    setPassSaved(true);
    setTimeout(() => setPassSaved(false), 3000);
  };

  const settings = [
    {
      icon: Key,
      title: 'Password & PIN',
      desc: `Last changed on ${security.passwordLastChanged || 'Unknown'}`,
      status: 'Active',
      action: 'Change Password',
      onClick: () => setChangePassModal(true),
      button: true,
    },
    {
      icon: Smartphone,
      title: 'Two-Factor Authentication',
      desc: security.twoFactorEnabled ? 'SMS & Authenticator app enabled' : 'Add extra security layer',
      status: security.twoFactorEnabled ? 'Enabled' : 'Disabled',
      toggle: true,
      key: 'twoFactorEnabled',
    },
    {
      icon: Bell,
      title: 'Login Alerts',
      desc: security.loginAlertsEnabled ? 'Email notifications on new login' : 'No login notifications',
      status: security.loginAlertsEnabled ? 'On' : 'Off',
      toggle: true,
      key: 'loginAlertsEnabled',
    },
    {
      icon: Shield,
      title: 'Biometric Lock',
      desc: security.biometricLockEnabled ? 'Fingerprint/Face ID enabled' : 'Add biometric security',
      status: security.biometricLockEnabled ? 'Active' : 'Inactive',
      toggle: true,
      key: 'biometricLockEnabled',
    },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Security</h1>
      <p className="page-subtitle">Protect your digital vault with advanced security options</p>

      {passSaved && <p className="profile-message success settings-saved">Password changed successfully!</p>}

      <div className="shared-list">
        {settings.map((s, i) => {
          const Icon = s.icon;
          const isEnabled = security[s.key];
          return (
            <motion.div
              key={s.title}
              className="shared-item premium-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Icon size={24} color="var(--violet)" />
              <div style={{ flex: 1 }}>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
              {s.button && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={s.onClick}
                  disabled={loading}
                  style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                  {s.action}
                </button>
              )}
              {s.toggle && (
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => handleToggleSecurity(s.key)}
                  />
                  <span className="toggle-slider" />
                </label>
              )}
              {!s.toggle && !s.button && (
                <span className="badge badge-verified">{s.status}</span>
              )}
              {s.toggle && (
                <span
                  className={`badge ${isEnabled ? 'badge-verified' : 'badge-pending'}`}
                  style={{ marginLeft: 12 }}
                >
                  {s.status}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="security-info premium-card" style={{ marginTop: 24, padding: 20 }}>
        <h4 style={{ marginBottom: 12 }}>Security Tips</h4>
        <ul style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          <li>✓ Use a strong password with mix of letters, numbers, and symbols</li>
          <li>✓ Enable two-factor authentication for maximum security</li>
          <li>✓ Enable login alerts to monitor account access</li>
          <li>✓ Never share your password or recovery codes with anyone</li>
          <li>✓ Change your password regularly, especially after suspicious activity</li>
        </ul>
      </div>

      {changePassModal && (
        <div className="modal-overlay" onClick={() => setChangePassModal(false)}>
          <motion.div
            className="modal-content glass-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 420 }}
          >
            <h2>Change Password</h2>
            <p style={{ marginBottom: 20, color: 'var(--text-secondary)' }}>
              Enter your current password and a new password to update your account security.
            </p>

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <div className="input-icon">
                  <input
                    type={showPass.current ? 'text' : 'password'}
                    value={passForm.current}
                    onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-pass"
                    onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                  >
                    {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>New Password</label>
                <div className="input-icon">
                  <input
                    type={showPass.new ? 'text' : 'password'}
                    value={passForm.new}
                    onChange={(e) => setPassForm({ ...passForm, new: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-pass"
                    onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                  >
                    {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-icon">
                  <input
                    type={showPass.confirm ? 'text' : 'password'}
                    value={passForm.confirm}
                    onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-pass"
                    onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                  >
                    {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {passError && <p className="login-error">{passError}</p>}

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setChangePassModal(false)}
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
