import { PenTool, Fingerprint, FileCheck } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import './Pages.css';

export default function ESign() {
  const { userDocuments } = useDocuments();
  const pendingCount = userDocuments.filter((d) => d.status === 'pending').length;
  return (
    <div className="page-container">
      <h1 className="page-title">eSign & eKYC</h1>
      <p className="page-subtitle">Digital signatures and identity verification</p>
      <div className="esign-grid">
        <div className="esign-card premium-card">
          <div className="icon"><PenTool size={28} /></div>
          <h3>Request eSign</h3>
          <p>Get documents digitally signed with legally valid eSign</p>
          <button className="btn-primary" style={{ marginTop: 20 }}>Start eSign</button>
        </div>
        <div className="esign-card premium-card">
          <div className="icon"><Fingerprint size={28} /></div>
          <h3>eKYC Verification</h3>
          <p>Complete Aadhaar-based eKYC for instant identity proof</p>
          <button className="btn-primary" style={{ marginTop: 20 }}>Verify Identity</button>
        </div>
        <div className="esign-card premium-card">
          <div className="icon"><FileCheck size={28} /></div>
          <h3>Certificate Verification</h3>
          <p>Verify educational and government certificates instantly</p>
          <button className="btn-secondary" style={{ marginTop: 20 }}>Verify Now</button>
        </div>
        <div className="esign-card premium-card">
          <div className="icon"><PenTool size={28} /></div>
          <h3>Pending Signatures</h3>
          <p>{pendingCount === 0 ? 'No documents awaiting signature' : `${pendingCount} document${pendingCount > 1 ? 's' : ''} awaiting your digital signature`}</p>
          <button className="btn-secondary" style={{ marginTop: 20 }}>View Pending</button>
        </div>
      </div>
    </div>
  );
}
