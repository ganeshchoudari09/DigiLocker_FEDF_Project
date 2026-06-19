import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { getInitials, readImageAsDataUrl, validateProfile, validateProfilePicture } from '../utils/profileUtils';

const AuthContext = createContext(null);

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  pushNotifications: true,
  autoSync: false,
  compactSidebar: false,
};

const DEFAULT_SECURITY_SETTINGS = {
  twoFactorEnabled: false,
  loginAlertsEnabled: true,
  biometricLockEnabled: false,
  passwordLastChanged: new Date().toISOString().split('T')[0],
};

const DEFAULT_ADMIN_SETTINGS = {
  maintenanceMode: false,
  allowRegistration: true,
  maxDocumentsPerUser: 50,
  requireEmailVerification: false,
  auditLogging: true,
  notifyOnNewUser: true,
};

const USER_STORAGE_KEY = 'users';

const DEMO_USER = {
  id: '1',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@email.com',
  phone: '+91 98765 43210',
  avatar: 'RS',
  profilePicture: null,
  verified: true,
  aadhaarLinked: true,
  settings: DEFAULT_SETTINGS,
  security: DEFAULT_SECURITY_SETTINGS,
};

const DEMO_ADMIN = {
  id: 'admin-1',
  name: 'Administrator',
  email: 'admin@digilocker.com',
  phone: '',
  avatar: 'AD',
  profilePicture: null,
  verified: true,
  role: 'admin',
  settings: DEFAULT_SETTINGS,
  password: 'admin123',
};

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...DEMO_USER,
    ...user,
    avatar: getInitials(user?.name),
    settings: { ...DEFAULT_SETTINGS, ...user.settings },
    security: { ...DEFAULT_SECURITY_SETTINGS, ...user.security },
  };
}

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return normalizeUser(safe);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => normalizeUser(storage.get('user', null)));
  const [users, setUsers] = useState(() => storage.get(USER_STORAGE_KEY, []));
  const [adminSettings, setAdminSettings] = useState(() =>
    storage.get('admin_settings', DEFAULT_ADMIN_SETTINGS)
  );
  const [loading, setLoading] = useState(false);
  const [resetCodes, setResetCodes] = useState({});

  // If credentials were saved with "remember me", auto-login on app start
  useEffect(() => {
    const creds = storage.get('savedCredentials', null);
    if (!user && creds && creds.email && creds.password) {
      // attempt a silent login using saved credentials
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      login(creds.email, creds.password, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) storage.set('user', user);
    else storage.remove('user');
  }, [user]);

  useEffect(() => {
    storage.set(USER_STORAGE_KEY, users);
  }, [users]);

  useEffect(() => {
    storage.set('admin_settings', adminSettings);
  }, [adminSettings]);

  // Ensure a default admin account exists for platform administration
  useEffect(() => {
    setUsers((prev) => {
      if (prev.find((u) => u.role === 'admin')) return prev;
      return [{ ...DEMO_ADMIN }, ...prev];
    });
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProfile = (updates) => {
    const hasProfileFields = 'name' in updates || 'email' in updates || 'phone' in updates;
    let sanitized = {};

    if (hasProfileFields) {
      const validation = validateProfile({
        name: updates.name ?? user?.name,
        email: updates.email ?? user?.email,
        phone: updates.phone ?? user?.phone,
      });

      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }
      sanitized = validation.sanitized;
    }

    setUser((prev) => {
      const next = normalizeUser({ ...prev, ...updates, ...sanitized });
      if (sanitized.name) next.avatar = getInitials(sanitized.name);
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === next.id ? { ...u, ...next } : u)));
      return next;
    });

    return { success: true, errors: {} };
  };

  const updateProfilePicture = async (file) => {
    const validation = validateProfilePicture(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const dataUrl = await readImageAsDataUrl(file);
    setUser((prev) => {
      const next = normalizeUser({ ...prev, profilePicture: dataUrl });
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === next.id ? { ...u, ...next } : u)));
      return next;
    });
    return { success: true };
  };

  const removeProfilePicture = () => {
    updateProfile({ profilePicture: null });
  };

  const updateSettings = (updates) => {
    setUser((prev) => {
      const next = normalizeUser({
        ...prev,
        settings: { ...prev.settings, ...updates },
      });
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === next.id ? { ...u, ...next } : u)));
      return next;
    });
  };

  const updateAdminSettings = (updates) => {
    setAdminSettings((prev) => ({ ...prev, ...updates }));
  };

  const getAllUsers = () => users.map(sanitizeUser);

  const getUserById = (id) => sanitizeUser(users.find((u) => u.id === id));

  const getDocumentCountForUser = (userId, documents) =>
    documents.filter((d) => d.userId === userId).length;

  const login = async (email, password, remember = false) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const storedUser = users.find((u) => u.email === email && u.password === password);
    if (!storedUser) {
      setLoading(false);
      return { success: false, error: 'Invalid email or password.' };
    }
    const loggedIn = normalizeUser(storedUser);
    setUser(loggedIn);
    if (remember) {
      storage.set('savedCredentials', { email, password });
    } else {
      storage.remove('savedCredentials');
    }
    setLoading(false);
    return { success: true, user: loggedIn };
  };

  const logout = () => {
    setUser(null);
    storage.remove('user');
    // do not remove saved credentials so "remember me" keeps email/password
  };

  const register = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (!adminSettings.allowRegistration) {
      setLoading(false);
      return { success: false, error: 'Registration is currently disabled.' };
    }
    const existingUser = users.find((u) => u.email === data.email);
    if (existingUser) {
      setLoading(false);
      return { success: false, error: 'Email already registered.' };
    }
    const newUser = normalizeUser({ ...DEMO_USER, ...data, id: Date.now().toString() });
    const storedUser = { ...newUser, password: data.password };
    setUsers((prev) => [storedUser, ...prev]);
    setUser(newUser);
    setLoading(false);
    return { success: true, user: newUser };
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const userExists = users.find((u) => u.email === email);
    if (!userExists) {
      setLoading(false);
      return { success: false, error: 'No account found with this email.' };
    }
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setResetCodes((prev) => ({ ...prev, [email]: code }));
    setLoading(false);
    return { success: true, code, message: `Reset code sent to ${email}` };
  };

  const resetPassword = async (email, code, newPassword) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const storedCode = resetCodes[email];
    if (!storedCode || storedCode !== code) {
      setLoading(false);
      return { success: false, error: 'Invalid or expired reset code.' };
    }
    setUsers((prev) =>
      prev.map((u) => (u.email === email ? { ...u, password: newPassword } : u))
    );
    setResetCodes((prev) => {
      const updated = { ...prev };
      delete updated[email];
      return updated;
    });
    setLoading(false);
    return { success: true, message: 'Password reset successfully.' };
  };

  const deleteAccount = async (userId) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (user?.id === userId) {
      setUser(null);
      storage.remove('user');
      storage.remove('savedCredentials');
    }
    setLoading(false);
    return { success: true, message: 'Account deleted successfully.' };
  };

  const changePassword = async (email, oldPassword, newPassword) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const storedUser = users.find((u) => u.email === email && u.password === oldPassword);
    if (!storedUser) {
      setLoading(false);
      return { success: false, error: 'Current password is incorrect.' };
    }
    setUsers((prev) =>
      prev.map((u) => (u.email === email ? { ...u, password: newPassword } : u))
    );
    setUser((prev) => ({
      ...prev,
      security: { ...prev.security, passwordLastChanged: new Date().toISOString().split('T')[0] },
    }));
    setLoading(false);
    return { success: true, message: 'Password changed successfully.' };
  };

  const updateSecuritySettings = (updates) => {
    setUser((prev) => {
      const next = normalizeUser({
        ...prev,
        security: { ...prev.security, ...updates },
      });
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === next.id ? { ...u, ...next } : u)));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        deleteAccount,
        changePassword,
        updateSecuritySettings,
        updateProfile,
        updateProfilePicture,
        removeProfilePicture,
        updateSettings,
        adminSettings,
        updateAdminSettings,
        getAllUsers,
        getUserById,
        getDocumentCountForUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
