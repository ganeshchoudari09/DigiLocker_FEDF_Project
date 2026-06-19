import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import './Modal.css';

export default function ConfirmRemoveModal({ open, document: doc, onClose, onConfirm }) {
  const [removing, setRemoving] = useState(false);

  const handleConfirm = async () => {
    setRemoving(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setRemoving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && doc && (
        <motion.div
          className="modal-overlay confirm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content confirm-modal premium-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon">
              <AlertTriangle size={28} />
            </div>
            <h2>Remove Document?</h2>
            <p>
              <strong>{doc.name}</strong> will be permanently removed from your vault.
              This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={removing}>
                Cancel
              </button>
              <button type="button" className="btn-danger" onClick={handleConfirm} disabled={removing}>
                {removing ? (
                  <>
                    <Loader2 size={16} className="spin" /> Removing...
                  </>
                ) : (
                  'Remove Document'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
