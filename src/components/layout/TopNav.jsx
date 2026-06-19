import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, Menu, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import UserAvatar from '../profile/UserAvatar';
import './TopNav.css';

export default function TopNav({ onMenuClick }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery, notifications, markNotificationRead } = useDocuments();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const goTo = (path) => {
    setShowProfile(false);
    navigate(path);
  };

  return (
    <header className="topnav">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Menu">
        <Menu size={22} />
      </button>

      <div className="search-bar glass-card">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search documents, issuers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <kbd className="search-kbd">⌘K</kbd>
      </div>

      <div className="topnav-actions">
        <div className="notif-wrapper" ref={notifRef}>
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="dropdown notif-dropdown premium-card"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
              >
                <h4>Notifications</h4>
                {notifications.length === 0 ? (
                  <p className="dropdown-empty">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${n.read ? '' : 'unread'}`}
                      onClick={() => markNotificationRead(n.id)}
                    >
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                      <span>{n.time}</span>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="profile-wrapper" ref={profileRef}>
          <button className="profile-btn" onClick={() => setShowProfile(!showProfile)}>
            <UserAvatar user={user} size="sm" />
            <span className="profile-name">{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={16} />
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                className="dropdown profile-dropdown premium-card"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
              >
                <div className="profile-header">
                  <UserAvatar user={user} size="md" />
                  <div>
                    <strong>{user?.name}</strong>
                    <p>{user?.email}</p>
                  </div>
                </div>
                <button type="button" className="dropdown-item" onClick={() => goTo('/profile')}>
                  <User size={16} /> Profile
                </button>
                <button type="button" className="dropdown-item" onClick={() => goTo('/settings')}>
                  <Settings size={16} /> Settings
                </button>
                <button type="button" className="dropdown-item danger" onClick={logout}>
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
