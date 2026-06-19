import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DOCUMENT_CATEGORIES } from '../../data/mockData';
import { useDocuments } from '../../context/DocumentContext';
import './DocumentCategories.css';

export default function DocumentCategories({ onSelect }) {
  const { userDocuments } = useDocuments();

  const categories = useMemo(
    () =>
      DOCUMENT_CATEGORIES.map((cat) => ({
        ...cat,
        count: userDocuments.filter((d) => d.category === cat.id).length,
      })),
    [userDocuments]
  );

  return (
    <section className="doc-categories-section">
      <h3 className="section-title">Document Categories</h3>
      <div className="categories-grid">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            className="category-card premium-card"
            style={{ '--tint': cat.tint }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => onSelect?.(cat.id)}
          >
            <span className="cat-icon" style={{ background: cat.tint }}>{cat.icon}</span>
            <span className="cat-name">{cat.name}</span>
            <span className="cat-count">{cat.count} docs</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
