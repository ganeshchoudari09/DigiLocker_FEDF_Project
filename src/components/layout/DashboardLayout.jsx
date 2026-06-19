import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import AIAssistant from '../dashboard/AIAssistant';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-content">
        <TopNav onMenuClick={() => setMobileOpen(true)} />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}
