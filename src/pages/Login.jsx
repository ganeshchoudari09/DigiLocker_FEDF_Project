import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import './Login.css';

export default function Login() {
  const { login, register, forgotPassword, resetPassword, loading, isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [remember, setRemember] = useState(() => !!storage.get('savedCredentials'));
  const [resetForm, setResetForm] = useState({ email: '', code: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [resetCode, setResetCode] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      const result = await register(form);
      if (!result?.success) {
        setError(result?.error || 'Unable to register.');
      }
    } else {
      const result = await login(form.email, form.password, remember);
      if (!result?.success) {
        setError(result?.error || 'Unable to sign in.');
        return;
      }
      if (result.user?.role === 'admin') {
        setError('Please use the Admin Login page for administrator access.');
        logout();
        return;
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setResetForm({ ...resetForm, email: form.email });
    const result = await forgotPassword(form.email);
    if (result?.success) {
      setResetCode(result.code);
      setIsResetPassword(true);
      setIsForgotPassword(false);
    } else {
      setError(result?.error || 'Unable to process request.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (resetForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const result = await resetPassword(resetForm.email, resetForm.code, resetForm.newPassword);
    if (result?.success) {
      setError('');
      setResetForm({ email: '', code: '', newPassword: '', confirmPassword: '' });
      setIsResetPassword(false);
      setIsForgotPassword(false);
      setForm({ email: resetForm.email, password: resetForm.newPassword, name: '' });
      alert('Password reset successfully. Please sign in with your new password.');
    } else {
      setError(result?.error || 'Unable to reset password.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-particles">
        {[...Array(30)].map((_, i) => <span key={i} className="login-particle" style={{ '--i': i }} />)}
      </div>
      <motion.div
        className="login-card glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="login-brand">
          <div className="login-logo"><Lock size={28} /></div>
          <h1>DigiLocker</h1>
          <p>Your secure digital document vault</p>
        </div>

        {!isForgotPassword && !isResetPassword && (
          <>
            <form onSubmit={handleSubmit}>
              {isRegister && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
                </div>
              )}
              <div className="form-group">
                <label>Email</label>
                <div className="input-icon">
                  <Mail size={18} />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" required />
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="input-icon">
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
                  <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group remember-group">
                <label className="remember-label">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me
                </label>
              </div>
              <button type="submit" className="btn-primary login-btn" disabled={loading}>
                {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
              </button>
              {error && <p className="login-error">{error}</p>}
            </form>
            <p className="login-switch">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
                {isRegister ? 'Sign In' : 'Register'}
              </button>
            </p>
            {!isRegister && (
              <p className="forgot-password-link">
                <button type="button" onClick={() => { setIsForgotPassword(true); setError(''); }}>
                  Forgot Password?
                </button>
              </p>
            )}
            
          </>
        )}

        {isForgotPassword && !isResetPassword && (
          <>
            <form onSubmit={handleForgotPassword}>
              <h2 className="forgot-title">Reset Password</h2>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-icon">
                  <Mail size={18} />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" required />
                </div>
              </div>
              <button type="submit" className="btn-primary login-btn" disabled={loading}>
                {loading ? 'Please wait...' : 'Send Reset Code'}
              </button>
              {error && <p className="login-error">{error}</p>}
            </form>
            <p className="login-switch">
              <button type="button" onClick={() => { setIsForgotPassword(false); setError(''); }}>
                Back to Sign In
              </button>
            </p>
          </>
        )}

        {isResetPassword && (
          <>
            <form onSubmit={handleResetPassword}>
              <h2 className="forgot-title">Create New Password</h2>
              <div className="reset-code-box">
                <p>Code: <strong>{resetCode}</strong></p>
              </div>
              <div className="form-group">
                <label>Reset Code</label>
                <input type="text" value={resetForm.code} onChange={(e) => setResetForm({ ...resetForm, code: e.target.value })} placeholder="Enter the code" required />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <div className="input-icon">
                  <input type="password" value={resetForm.newPassword} onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })} placeholder="••••••••" required />
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-icon">
                  <input type="password" value={resetForm.confirmPassword} onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })} placeholder="••••••••" required />
                </div>
              </div>
              <button type="submit" className="btn-primary login-btn" disabled={loading}>
                {loading ? 'Please wait...' : 'Reset Password'}
              </button>
              {error && <p className="login-error">{error}</p>}
            </form>
            <p className="login-switch">
              <button type="button" onClick={() => { setIsResetPassword(false); setResetForm({ email: '', code: '', newPassword: '', confirmPassword: '' }); setError(''); }}>
                Back to Sign In
              </button>
            </p>
          </>
        )}
        <p className="demo-hint">Demo: use any email & password to sign in. Admin: admin@digilocker.com / admin123</p>
      </motion.div>
    </div>
  );
}
