import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';
import './AdminLayout.css';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="admin-main-content">
        <AdminTopNav onMenuClick={() => setMobileOpen(true)} />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
