import { useDocuments } from '../context/DocumentContext';
import './Pages.css';

export default function Activity() {
  const { activities } = useDocuments();

  return (
    <div className="page-container">
      <h1 className="page-title">Activity History</h1>
      <p className="page-subtitle">Complete audit trail of your vault actions</p>
      {activities.length === 0 ? (
        <div className="empty-state premium-card">
          <h3>No activity yet</h3>
          <p>Upload or share a document to see activity here.</p>
        </div>
      ) : (
        <div className="activity-full">
          {activities.map((a) => (
            <div key={a.id} className="shared-item premium-card">
              <div className="timeline-dot" style={{ background: a.color, width: 12, height: 12, borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <h4>{a.title}</h4>
                <p>{a.time}</p>
              </div>
              <span className="badge" style={{ background: `${a.color}20`, color: a.color }}>{a.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
