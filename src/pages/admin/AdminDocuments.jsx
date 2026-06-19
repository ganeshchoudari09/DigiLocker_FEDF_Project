import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Search, Eye, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import ViewDocumentModal from '../../components/modals/ViewDocumentModal';
import '../Pages.css';
import './AdminPages.css';

const STATUS_CLASS = { verified: 'badge-verified', pending: 'badge-pending', rejected: 'badge-rejected' };

export default function AdminDocuments() {
  const { getAllUsers, getUserById } = useAuth();
  const { documents, documentsWithValidity, downloadDocument } = useDocuments();
  const [search, setSearch] = useState('');
  const [viewDoc, setViewDoc] = useState(null);
  const [filterUser, setFilterUser] = useState('all');
  const location = useLocation();

  // read query param ?user=<id> to pre-select a user filter
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const userParam = q.get('user');
    if (userParam) setFilterUser(userParam);
  }, [location.search]);

  const users = getAllUsers().filter((u) => u.role !== 'admin');

  const docsWithOwner = useMemo(() => {
    return documents.map((doc) => {
      const owner = doc.userId ? getUserById(doc.userId) : null;
      const validity = documentsWithValidity.find((d) => d.id === doc.id)?.validity;
      return {
        ...doc,
        ownerName: owner?.name || 'Unknown User',
        ownerEmail: owner?.email || '—',
        validity,
      };
    });
  }, [documents, documentsWithValidity, getUserById]);

  const filtered = useMemo(() => {
    let result = docsWithOwner;
    if (filterUser !== 'all') {
      result = result.filter((d) => d.userId === filterUser);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.ownerName.toLowerCase().includes(q) ||
          d.ownerEmail.toLowerCase().includes(q) ||
          (d.issuedBy || '').toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [docsWithOwner, search, filterUser]);

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">All User Documents</h1>
          <p className="page-subtitle">View and access documents uploaded by all users</p>
        </div>
      </div>

      <div className="admin-filters-row">
        <div className="admin-search-bar glass-card">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search documents, users, issuers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="admin-filter-select premium-card"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
        >
          <option value="all">All Users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state premium-card">
          <FileText size={48} color="var(--violet)" />
          <h3>No documents found</h3>
          <p>No documents match your search or filter criteria.</p>
        </div>
      ) : (
        <div className="admin-docs-table premium-card">
          <div className="admin-docs-table-header">
            <span>Document</span>
            <span>Owner</span>
            <span>Category</span>
            <span>Status</span>
            <span>Date</span>
            <span>Actions</span>
          </div>
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              className="admin-docs-table-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="admin-doc-cell">
                <FileText size={18} color="var(--violet)" />
                <div>
                  <strong>{doc.name}</strong>
                  <p>{doc.size} · {doc.fileName || '—'}</p>
                </div>
              </div>
              <div className="admin-doc-cell">
                <strong>{doc.ownerName}</strong>
                <p>{doc.ownerEmail}</p>
              </div>
              <span className="admin-doc-category">{doc.category?.toUpperCase()}</span>
              <span className={`badge ${STATUS_CLASS[doc.status]}`}>{doc.status}</span>
              <span className="admin-doc-date">{doc.date}</span>
              <div className="admin-doc-actions">
                <button
                  type="button"
                  className="doc-action-btn primary"
                  onClick={() => setViewDoc(doc)}
                  disabled={!doc.hasFile}
                >
                  <Eye size={14} /> View
                </button>
                <button
                  type="button"
                  className="doc-action-btn"
                  onClick={() => downloadDocument(doc.id)}
                  disabled={!doc.hasFile}
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ViewDocumentModal open={!!viewDoc} document={viewDoc} onClose={() => setViewDoc(null)} />
    </div>
  );
}
