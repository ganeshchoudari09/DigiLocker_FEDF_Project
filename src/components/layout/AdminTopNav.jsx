import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

export default function AdminTopNav({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="admin-topnav">
      <button className="admin-menu-btn" onClick={onMenuClick} aria-label="Menu">
        <Menu size={22} />
      </button>

      <div className="admin-topnav-title">
        <h2>Platform Administration</h2>
        <p>Logged in as {user?.name}</p>
      </div>

      <div className="admin-topnav-actions">
        <button className="admin-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
}
