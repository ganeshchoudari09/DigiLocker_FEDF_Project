import { useState } from 'react';
import { HardDrive, Folder, File } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import ViewDocumentModal from '../components/modals/ViewDocumentModal';
import ConfirmRemoveModal from '../components/modals/ConfirmRemoveModal';
import DocumentActions from '../components/documents/DocumentActions';
import './Pages.css';

const IDENTITY_CATEGORIES = ['aadhaar', 'pan', 'dl', 'voter', 'passport'];
const VEHICLE_CATEGORIES = ['rc', 'insurance'];

export default function Drive() {
  const { userDocuments, stats, removeDocument, downloadDocument } = useDocuments();
  const [viewDoc, setViewDoc] = useState(null);
  const [removeDoc, setRemoveDoc] = useState(null);

  const folders = [
    { name: 'Identity Documents', count: userDocuments.filter((d) => IDENTITY_CATEGORIES.includes(d.category)).length, icon: Folder },
    { name: 'Education', count: userDocuments.filter((d) => d.category === 'education').length, icon: Folder },
    { name: 'Vehicle & Insurance', count: userDocuments.filter((d) => VEHICLE_CATEGORIES.includes(d.category)).length, icon: Folder },
    { name: 'All Files', count: userDocuments.length, icon: File },
  ];

  const handleConfirmRemove = async () => {
    if (removeDoc) await removeDocument(removeDoc.id);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Drive</h1>
      <p className="page-subtitle">{stats.total} files · Cloud sync enabled</p>
      <div className="docs-grid">
        {folders.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.name} className="doc-card premium-card">
              <Icon size={40} color="var(--violet)" style={{ marginBottom: 12 }} />
              <h3>{f.name}</h3>
              <p className="doc-meta">{f.count} items</p>
            </div>
          );
        })}
      </div>
      <h3 className="section-title" style={{ marginTop: 32 }}>All Files</h3>
      <div className="shared-list" style={{ marginTop: 16 }}>
        {userDocuments.length === 0 ? (
          <div className="empty-state premium-card">
            <HardDrive size={40} color="var(--violet)" />
            <h3>No files in drive</h3>
            <p>Uploaded documents will appear here.</p>
          </div>
        ) : (
          userDocuments.map((d) => (
            <div key={d.id} className="shared-item premium-card drive-file-item">
              <File size={20} color="var(--violet)" />
              <div className="drive-file-info">
                <h4>{d.name}</h4>
                <p>{d.size} · {d.date}</p>
              </div>
              <DocumentActions
                doc={d}
                onView={setViewDoc}
                onRemove={setRemoveDoc}
                onDownload={(doc) => downloadDocument(doc.id)}
                compact
              />
            </div>
          ))
        )}
      </div>

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
