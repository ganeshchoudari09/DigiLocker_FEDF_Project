import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Loader2 } from 'lucide-react';
import { getFile } from '../../utils/fileStorage';
import { useDocuments } from '../../context/DocumentContext';
import './Modal.css';

const STATUS_CLASS = { verified: 'badge-verified', pending: 'badge-pending', rejected: 'badge-rejected' };

export default function ViewDocumentModal({ open, document: doc, onClose }) {
  const { downloadDocument } = useDocuments();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !doc) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setError('');
      return undefined;
    }

    let cancelled = false;
    let objectUrl = null;

    const loadPreview = async () => {
      setLoading(true);
      setError('');
      try {
        const file = await getFile(doc.id);
        if (cancelled) return;
        if (!file) {
          setError('File not found. It may have been removed from storage.');
          return;
        }
        objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      } catch {
        if (!cancelled) setError('Unable to load document preview.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPreview();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open, doc?.id]);

  if (!doc) return null;

  const isPdf = doc.mimeType === 'application/pdf' || doc.fileName?.toLowerCase().endsWith('.pdf');
  const isImage = doc.mimeType?.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(doc.fileName || '');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content view-modal premium-card"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>{doc.name}</h2>
                <p className="view-modal-meta">
                  {doc.category?.toUpperCase()} · {doc.size} · {doc.date}
                </p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="view-modal-info">
              {doc.issuedBy && <span>Issued by: {doc.issuedBy}</span>}
              <span className={`badge ${STATUS_CLASS[doc.status] || 'badge-pending'}`}>
                {doc.status}
              </span>
            </div>

            <div className="view-modal-preview">
              {loading && (
                <div className="view-modal-loading">
                  <Loader2 size={32} className="spin" />
                  <p>Loading document...</p>
                </div>
              )}
              {!loading && error && (
                <div className="view-modal-error">
                  <FileText size={40} color="var(--text-muted)" />
                  <p>{error}</p>
                </div>
              )}
              {!loading && !error && previewUrl && isPdf && (
                <iframe src={previewUrl} title={doc.name} className="view-iframe" />
              )}
              {!loading && !error && previewUrl && isImage && (
                <img src={previewUrl} alt={doc.name} className="view-image" />
              )}
              {!loading && !error && previewUrl && !isPdf && !isImage && (
                <div className="view-modal-error">
                  <FileText size={40} color="var(--text-muted)" />
                  <p>Preview not available for this file type.</p>
                  <button className="btn-primary" onClick={() => downloadDocument(doc.id)}>
                    <Download size={16} /> Download File
                  </button>
                </div>
              )}
            </div>

            <div className="view-modal-actions">
              <button className="btn-secondary" onClick={onClose}>Close</button>
              {doc.hasFile && (
                <button className="btn-primary" onClick={() => downloadDocument(doc.id)}>
                  <Download size={16} /> Download
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
