import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import './Modal.css';

export default function ShareModal({ open, onClose, initialDocId = '' }) {
  const { userDocuments, createShareLink } = useDocuments();
  const [selectedDoc, setSelectedDoc] = useState(userDocuments[0]?.id || '');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setShareUrl('');
      return;
    }
    if (initialDocId && userDocuments.some((d) => d.id === initialDocId)) {
      setSelectedDoc(initialDocId);
    } else if (userDocuments.length > 0) {
      setSelectedDoc((prev) => (userDocuments.some((d) => d.id === prev) ? prev : userDocuments[0].id));
    } else {
      setSelectedDoc('');
    }
  }, [userDocuments, open, initialDocId]);

  const handleGenerate = () => {
    if (!selectedDoc) return;
    const link = createShareLink(selectedDoc);
    if (!link) return;
    setShareUrl(link.url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="modal-content premium-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>QR Share Document</h2>
              <button onClick={onClose}><X size={20} /></button>
            </div>
            {userDocuments.length === 0 ? (
              <p className="modal-empty-hint">Upload a document first before you can generate a share link.</p>
            ) : (
              <>
                <div className="form-group">
                  <label>Select Document</label>
                  <select value={selectedDoc} onChange={(e) => setSelectedDoc(e.target.value)}>
                    {userDocuments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <button className="btn-primary" onClick={handleGenerate} style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}>
                  Generate Share Link
                </button>
              </>
            )}
            {shareUrl && (
              <div className="qr-section">
                <div className="qr-code">
                  <QRCodeSVG value={shareUrl} size={160} fgColor="#2D0B45" />
                </div>
                <div className="share-url">
                  <input readOnly value={shareUrl} />
                  <button onClick={handleCopy}>
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
