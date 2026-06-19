import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Shield } from 'lucide-react';
import './Login.css';

export default function ChooseLogin() {
  const navigate = useNavigate();

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
          <h1>Sign In</h1>
          <p>Choose login type</p>
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 16 }}>
          <button className="btn-primary" style={{ padding: '12px 24px' }} onClick={() => navigate('/user-login')}>
            <User size={18} style={{ marginRight: 8 }} /> User Login
          </button>
          <button className="btn-secondary" style={{ padding: '12px 24px' }} onClick={() => navigate('/admin-login')}>
            <Shield size={18} style={{ marginRight: 8 }} /> Admin Login
          </button>
        </div>

        <p className="demo-hint" style={{ marginTop: 20 }}>Demo admin: admin@digilocker.com / admin123</p>
      </motion.div>
    </div>
  );
}
