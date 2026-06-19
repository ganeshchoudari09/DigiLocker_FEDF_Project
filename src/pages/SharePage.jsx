import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, FileText, Loader2, ChevronLeft } from 'lucide-react';
import { getFile } from '../utils/fileStorage';
import { useDocuments } from '../context/DocumentContext';
import './Pages.css';

export default function SharePage() {
  const { docId } = useParams();
  const { documents, sharedLinks, downloadDocument } = useDocuments();
  const matchedDocument = documents.find((d) => d.id === docId);
  const sharedLink = sharedLinks.find((link) => link.id === docId);
  const doc = matchedDocument || documents.find((d) => d.id === sharedLink?.docId);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    let objectUrl = null;

    const load = async () => {
      if (!doc) {
        setError('Document not found. It may have been removed or never uploaded.');
        setLoading(false);
        return;
      }

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
        if (!cancelled) setError('Unable to load the shared document.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [doc]);

  if (!doc) {
    return (
      <div className="page-container">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Shared Document</h1>
            <p className="page-subtitle">Unable to locate the requested document.</p>
          </div>
        </div>
        <div className="empty-state premium-card">
          <FileText size={48} color="var(--violet)" />
          <h3>Document not found</h3>
          <p>The shared document could not be loaded. It may have been deleted, removed, or the link is invalid.</p>
          <p style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Note: Uploaded files are stored locally in your browser. QR links will only show the document if the same browser/profile still has the file available.
          </p>
          <Link to="/" className="btn-primary" style={{ marginTop: 16 }}>
            <ChevronLeft size={16} /> Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isPdf = doc.mimeType === 'application/pdf' || doc.fileName?.toLowerCase().endsWith('.pdf');
  const isImage = doc.mimeType?.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(doc.fileName || '');

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Shared Document</h1>
          <p className="page-subtitle">Open the shared document below.</p>
        </div>
        <Link to="/" className="btn-secondary">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="premium-card view-modal share-page-card">
        <div className="view-modal-header">
          <div>
            <h2>{doc.name}</h2>
            <p className="view-modal-meta">
              {doc.category?.toUpperCase()} · {doc.size} · {doc.date}
            </p>
          </div>
        </div>

        <div className="view-modal-info">
          {doc.issuedBy && <span>Issued by: {doc.issuedBy}</span>}
          <span className={`badge ${doc.status === 'verified' ? 'badge-verified' : doc.status === 'pending' ? 'badge-pending' : 'badge-rejected'}`}>
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
            </div>
          )}
        </div>

        <div className="view-modal-actions">
          {doc.hasFile && (
            <button className="btn-primary" onClick={() => downloadDocument(doc.id)}>
              <Download size={16} /> Download Document
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
