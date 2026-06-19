import { Award, FileText } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import './Pages.css';

export default function IssuedDocuments() {
  const { userDocuments } = useDocuments();
  const issued = userDocuments.filter((d) => d.status === 'verified');

  return (
    <div className="page-container">
      <h1 className="page-title">Issued Documents</h1>
      <p className="page-subtitle">Government-issued documents pulled from DigiLocker</p>
      {issued.length === 0 ? (
        <div className="empty-state premium-card">
          <FileText size={48} color="var(--violet)" />
          <h3>No issued documents</h3>
          <p>Verified documents from DigiLocker sync will appear here after you upload and verify them.</p>
        </div>
      ) : (
      <div className="docs-grid">
        {issued.map((doc) => (
          <div key={doc.id} className="doc-card premium-card">
            <div className="doc-card-header">
              <Award size={24} color="var(--violet)" />
              <span className="badge badge-verified">Issued</span>
            </div>
            <h3>{doc.name}</h3>
            <p className="doc-meta">Issued by {doc.issuedBy}</p>
            <p className="doc-meta">Verified on {doc.date}</p>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
