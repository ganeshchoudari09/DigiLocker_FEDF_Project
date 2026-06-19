import { useState } from 'react';
import HeroSection from '../components/dashboard/HeroSection';
import AnalyticsCards from '../components/dashboard/AnalyticsCards';
import DocumentCategories from '../components/dashboard/DocumentCategories';
import UploadModal from '../components/modals/UploadModal';
import ShareModal from '../components/modals/ShareModal';
import { useDocuments } from '../context/DocumentContext';
import './Dashboard.css';

export default function Dashboard() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { syncDigiLocker } = useDocuments();

  return (
    <div className="dashboard-page">
      <HeroSection
        onUpload={() => setUploadOpen(true)}
        onShare={() => setShareOpen(true)}
        onVerify={() => syncDigiLocker()}
      />
      <AnalyticsCards />
      <DocumentCategories />
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
