import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function AdminLogin() {
  const { login, register, logout, loading, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') navigate('/admin', { replace: true });
    if (isAuthenticated && user?.role !== 'admin') navigate('/', { replace: true });
  }, [isAuthenticated, user, navigate]);

  const [showPass, setShowPass] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isRegister) {
      const payload = { name: form.name, email: form.email, password: form.password, role: 'admin' };
      const result = await register(payload);
      if (!result?.success) {
        setError(result?.error || 'Unable to register.');
        return;
      }
      // ensure admin role
      if (result.user?.role !== 'admin') {
        setError('Registration did not grant admin access.');
        return;
      }
      navigate('/admin', { replace: true });
      return;
    }

    const result = await login(form.email, form.password, false);
    if (!result?.success) {
      setError(result?.error || 'Unable to sign in.');
      return;
    }
    if (result.user?.role !== 'admin') {
      setError('This account does not have admin access.');
      logout();
      return;
    }
    navigate('/admin', { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-particles">
        {[...Array(20)].map((_, i) => <span key={i} className="login-particle" style={{ '--i': i }} />)}
      </div>
      <motion.div
        className="login-card glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="login-brand">
          <div className="login-logo"><Lock size={28} /></div>
          <h1>Admin Login</h1>
          <p>Administrative access to DigiLocker</p>
        </div>

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
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@digilocker.com" required />
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
          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Create Admin' : 'Sign In'}
          </button>
          {error && <p className="login-error">{error}</p>}
        </form>

        <p className="login-switch">
          {isRegister ? 'Already have an admin account?' : "Don't have an admin account?"}{' '}
          <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </p>

        <p className="login-switch">
          <button type="button" onClick={() => navigate('/user-login')}>Back to User Login</button>
        </p>

        <p className="demo-hint">Demo admin: admin@digilocker.com / admin123</p>
      </motion.div>
    </div>
  );
}
