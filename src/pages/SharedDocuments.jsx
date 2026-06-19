import { Share2, ExternalLink } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import ShareModal from '../components/modals/ShareModal';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

export default function SharedDocuments() {
  const { sharedLinks, userDocuments } = useDocuments();
  const [shareOpen, setShareOpen] = useState(false);

  const sharedDocs = sharedLinks.map((l) => {
    const doc = userDocuments.find((d) => d.id === l.docId);
    return {
      id: l.id,
      docId: l.docId,
      name: doc?.name || 'Document',
      sharedWith: 'Via Link',
      date: l.created?.split('T')[0],
      status: 'active',
    };
  });

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Shared Documents</h1>
          <p className="page-subtitle">Documents shared via QR links and institutions</p>
        </div>
        <button className="btn-primary" onClick={() => setShareOpen(true)}><Share2 size={18} /> New Share</button>
      </div>
      <div className="shared-list">
        {sharedDocs.length === 0 ? (
          <div className="empty-state premium-card">
            <Share2 size={40} color="var(--violet)" />
            <h3>No shared documents yet</h3>
            <p>Upload a document first, then generate a share link to share it securely.</p>
          </div>
        ) : (
          sharedDocs.map((item) => (
            <div key={item.id} className="shared-item premium-card">
              <div>
                <h4>{item.name}</h4>
                <p>Shared with {item.sharedWith} · {item.date}</p>
              </div>
              <span className={`badge ${item.status === 'active' ? 'badge-verified' : 'badge-pending'}`}>{item.status}</span>
              <Link to={`/share/${item.docId}`} className="btn-secondary" style={{ padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <ExternalLink size={16} /> View
              </Link>
            </div>
          ))
        )}
      </div>
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
