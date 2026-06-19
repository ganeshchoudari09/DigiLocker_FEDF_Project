import { Eye, Trash2, Download, Share2 } from 'lucide-react';

export default function DocumentActions({
  doc,
  onView,
  onRemove,
  onDownload,
  onShare,
  compact = false,
}) {
  return (
    <div className={`doc-card-actions ${compact ? 'compact' : ''}`}>
      <button
        type="button"
        className="doc-action-btn primary"
        title="View document"
        onClick={() => onView(doc)}
        disabled={!doc.hasFile}
      >
        <Eye size={16} />
        {!compact && <span>View</span>}
      </button>
      {onDownload && (
        <button
          type="button"
          className="doc-action-btn"
          title="Download"
          onClick={() => onDownload(doc)}
          disabled={!doc.hasFile}
        >
          <Download size={16} />
          {!compact && <span>Download</span>}
        </button>
      )}
      {onShare && (
        <button type="button" className="doc-action-btn" title="Share" onClick={() => onShare(doc)}>
          <Share2 size={16} />
          {!compact && <span>Share</span>}
        </button>
      )}
      <button
        type="button"
        className="doc-action-btn danger"
        title="Remove document"
        onClick={() => onRemove(doc)}
      >
        <Trash2 size={16} />
        {!compact && <span>Remove</span>}
      </button>
    </div>
  );
}
