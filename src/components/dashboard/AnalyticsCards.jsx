import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Share2, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import './AnalyticsCards.css';

const CARDS = [
  { key: 'total', label: 'Total Documents', icon: FileText, gradient: 'linear-gradient(135deg, #6A35FF, #B088FF)', trend: '', up: true },
  { key: 'verified', label: 'Verified Documents', icon: ShieldCheck, gradient: 'linear-gradient(135deg, #22C55E, #4ADE80)', trend: '', up: true },
  { key: 'shared', label: 'Shared Documents', icon: Share2, gradient: 'linear-gradient(135deg, #FF7BCB, #FFB4E0)', trend: '', up: true },
  { key: 'pending', label: 'Pending Verification', icon: Clock, gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)', trend: '', up: false },
];

export default function AnalyticsCards() {
  const { stats } = useDocuments();

  return (
    <div className="analytics-cards">
      {CARDS.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.key}
            className="kpi-card premium-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
          >
            <div className="kpi-icon" style={{ background: card.gradient }}>
              <Icon size={24} color="white" />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">{card.label}</span>
              <span className="kpi-value">{stats[card.key]}</span>
              {card.trend && (
                <span className={`kpi-trend ${card.up ? 'up' : 'down'}`}>
                  {card.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {card.trend}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
