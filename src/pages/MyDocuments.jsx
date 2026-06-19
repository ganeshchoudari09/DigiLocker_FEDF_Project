import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, RefreshCw, FileText } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import UploadModal from '../components/modals/UploadModal';
import ShareModal from '../components/modals/ShareModal';
import ViewDocumentModal from '../components/modals/ViewDocumentModal';
import ConfirmRemoveModal from '../components/modals/ConfirmRemoveModal';
import DocumentActions from '../components/documents/DocumentActions';
import './Pages.css';

const STATUS_CLASS = { verified: 'badge-verified', pending: 'badge-pending', rejected: 'badge-rejected' };

export default function MyDocuments() {
  const {
    filteredDocuments,
    documentsWithValidity,
    removeDocument,
    downloadDocument,
    syncDigiLocker,
    exportDocuments,
  } = useDocuments();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareDocId, setShareDocId] = useState('');
  const [viewDoc, setViewDoc] = useState(null);
  const [removeDoc, setRemoveDoc] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await syncDigiLocker();
    setSyncing(false);
  };

  const handleShare = (doc) => {
    setShareDocId(doc.id);
    setShareOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (removeDoc) await removeDocument(removeDoc.id);
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">My Documents</h1>
          <p className="page-subtitle">Manage your digital document vault</p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary" onClick={handleSync} disabled={syncing}>
            <RefreshCw size={18} className={syncing ? 'spin' : ''} /> DigiLocker Sync
          </button>
          <button className="btn-secondary" onClick={exportDocuments}>Export</button>
          <button className="btn-primary" onClick={() => setUploadOpen(true)}>
            <Upload size={18} /> Upload
          </button>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="empty-state premium-card">
          <FileText size={48} color="var(--violet)" />
          <h3>Your vault is empty</h3>
          <p>No documents have been added yet. Upload your first document to start building your digital vault.</p>
          <button className="btn-primary" onClick={() => setUploadOpen(true)} style={{ marginTop: 16 }}>
            <Upload size={18} /> Upload Document
          </button>
        </div>
      ) : (
        <div className="docs-grid">
          {filteredDocuments.map((doc, i) => {
            const validity = documentsWithValidity.find((d) => d.id === doc.id)?.validity;
            return (
              <motion.div
                key={doc.id}
                className="doc-card premium-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <div className="doc-card-header">
                  <span className="doc-emoji">📄</span>
                  <span className={`badge ${STATUS_CLASS[doc.status]}`}>{doc.status}</span>
                </div>
                <h3>{doc.name}</h3>
                <p className="doc-meta">{doc.issuedBy || '—'}</p>
                <p className="doc-meta">{doc.date} · {doc.size}</p>
                {validity && (
                  <p className={`validity ${validity.isValid ? 'valid' : 'expiring'}`}>
                    {validity.isValid ? `Valid · ${validity.validityLabel}` : 'Expiring soon'}
                  </p>
                )}
                <DocumentActions
                  doc={doc}
                  onView={setViewDoc}
                  onRemove={setRemoveDoc}
                  onDownload={(d) => downloadDocument(d.id)}
                  onShare={handleShare}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} initialDocId={shareDocId} />
      <ViewDocumentModal open={!!viewDoc} document={viewDoc} onClose={() => setViewDoc(null)} />
      <ConfirmRemoveModal
        open={!!removeDoc}
        document={removeDoc}
        onClose={() => setRemoveDoc(null)}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}
