import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import ChooseLogin from './pages/ChooseLogin';
import Dashboard from './pages/Dashboard';
import MyDocuments from './pages/MyDocuments';
import SharedDocuments from './pages/SharedDocuments';
import SharePage from './pages/SharePage';
import ESign from './pages/ESign';
import IssuedDocuments from './pages/IssuedDocuments';
import Drive from './pages/Drive';
import Security from './pages/Security';
import Activity from './pages/Activity';
import Admin from './pages/Admin';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DocumentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<ChooseLogin />} />
              <Route path="/user-login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute userOnly>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="documents" element={<MyDocuments />} />
                <Route path="shared" element={<SharedDocuments />} />
                <Route path="esign" element={<ESign />} />
                <Route path="issued" element={<IssuedDocuments />} />
                <Route path="drive" element={<Drive />} />
                <Route path="security" element={<Security />} />
                <Route path="activity" element={<Activity />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Admin />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="documents" element={<AdminDocuments />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route path="share/:docId" element={<SharePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DocumentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
