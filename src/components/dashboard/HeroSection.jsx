import { motion } from 'framer-motion';
import { Upload, Share2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import './HeroSection.css';

const FLOATING_CARDS = [
  { id: 'aadhaar', label: 'Aadhaar', emoji: '🪪', rotate: -8, delay: 0 },
  { id: 'pan', label: 'PAN Card', emoji: '💳', rotate: 4, delay: 0.1 },
  { id: 'dl', label: 'Driving License', emoji: '🚗', rotate: -4, delay: 0.2 },
];

export default function HeroSection({ onUpload, onShare, onVerify }) {
  const { user } = useAuth();
  const { stats } = useDocuments();

  return (
    <section className="hero-section">
      <div className="hero-stars">
        {[...Array(12)].map((_, i) => (
          <span key={i} className="star" style={{ '--i': i }}>✦</span>
        ))}
      </div>

      <div className="hero-content">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="hero-title">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="hero-subtitle">
            {stats.total === 0 ? (
              <>Your vault is empty. <strong>Upload your first document</strong> to get started.</>
            ) : (
              <>You have <strong>{stats.verified}</strong> verified documents securely stored in your vault</>
            )}
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onUpload}>
              <Upload size={18} /> Upload Document
            </button>
            <button className="btn-secondary" onClick={onShare}>
              <Share2 size={18} /> Share Document
            </button>
            <button className="btn-secondary" onClick={onVerify}>
              <ShieldCheck size={18} /> Verify Certificate
            </button>
          </div>
        </motion.div>

        <div className="hero-right">
          {FLOATING_CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              className="floating-doc-card"
              style={{ '--rotate': `${card.rotate}deg` }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + card.delay, duration: 0.6 }}
              whileHover={{ y: -12, rotate: 0, scale: 1.05 }}
            >
              <span className="doc-emoji">{card.emoji}</span>
              <span className="doc-label">{card.label}</span>
              <span className="doc-verified">{stats.total > 0 ? '✓ Verified' : 'Upload to add'}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
