import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { storage } from '../utils/storage';
import { checkDocumentValidity } from '../utils/validityEngine';
import { saveFile, deleteFile, getFile } from '../utils/fileStorage';
import { useAuth } from './AuthContext';

const DOCUMENTS_STORAGE_KEY = 'vault_documents';

const DocumentContext = createContext(null);

export function DocumentProvider({ children }) {
  const { user, adminSettings } = useAuth();
  const [documents, setDocuments] = useState(() => storage.get(DOCUMENTS_STORAGE_KEY, []));
  const [activities, setActivities] = useState(() => storage.get('activities', []));
  const [notifications, setNotifications] = useState(() => storage.get('notifications', []));
  const [sharedLinks, setSharedLinks] = useState(() => storage.get('sharedLinks', []));
  const [searchQuery, setSearchQuery] = useState('');

  // Clear legacy seeded documents from earlier versions
  useEffect(() => {
    storage.remove('documents');
  }, []);

  useEffect(() => {
    storage.set(DOCUMENTS_STORAGE_KEY, documents);
  }, [documents]);

  useEffect(() => {
    storage.set('activities', activities);
  }, [activities]);

  useEffect(() => {
    storage.set('sharedLinks', sharedLinks);
  }, [sharedLinks]);

  const isAdmin = user?.role === 'admin';

  const userDocuments = useMemo(() => {
    if (!user) return [];
    if (isAdmin) return documents;
    return documents.filter((d) => d.userId === user.id || !d.userId);
  }, [documents, user, isAdmin]);

  const stats = useMemo(() => ({
    total: userDocuments.length,
    verified: userDocuments.filter((d) => d.status === 'verified').length,
    shared: sharedLinks.filter((l) => userDocuments.some((d) => d.id === l.docId)).length,
    pending: userDocuments.filter((d) => d.status === 'pending').length,
  }), [userDocuments, sharedLinks]);

  const addActivity = (type, title) => {
    const colors = { upload: '#6A35FF', verify: '#22C55E', share: '#FF7BCB', download: '#3B82F6', remove: '#EF4444' };
    const entry = { id: Date.now().toString(), type, title, time: 'Just now', color: colors[type] || '#6A35FF' };
    setActivities((prev) => [entry, ...prev]);
  };

  const uploadDocument = async (doc, file = null) => {
    if (!user) throw new Error('You must be logged in to upload documents.');

    const userDocCount = documents.filter((d) => d.userId === user.id).length;
    const limit = adminSettings?.maxDocumentsPerUser || 50;
    if (userDocCount >= limit) {
      throw new Error(`Document limit reached (${limit} max).`);
    }

    const id = Date.now().toString();
    const newDoc = {
      ...doc,
      id,
      userId: user?.id,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      hasFile: !!file,
    };

    if (file) {
      await saveFile(id, file);
    }

    setDocuments((prev) => [newDoc, ...prev]);
    addActivity('upload', `Uploaded ${doc.name}`);
    return newDoc;
  };

  const updateDocumentStatus = (id, status) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    addActivity('verify', `Document ${status}`);
  };

  const removeDocument = async (id) => {
    const doc = documents.find((d) => d.id === id);
    await deleteFile(id).catch(() => {});
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setSharedLinks((prev) => prev.filter((l) => l.docId !== id));
    if (doc) addActivity('remove', `Removed ${doc.name}`);
    return true;
  };

  const deleteDocument = removeDocument;

  const downloadDocument = async (id) => {
    const doc = documents.find((d) => d.id === id);
    const file = await getFile(id);
    if (!file || !doc) return false;

    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.fileName || doc.name;
    a.click();
    URL.revokeObjectURL(url);
    addActivity('download', `Downloaded ${doc.name}`);
    return true;
  };

  const createShareLink = (docId) => {
    const scope = isAdmin ? documents : userDocuments;
    const documentExists = scope.some((d) => d.id === docId);
    if (!documentExists) return null;

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://digilocker.gov.in';
    const existingLink = sharedLinks.find((link) => link.docId === docId);
    if (existingLink) {
      return existingLink;
    }

    const link = {
      id: Date.now().toString(),
      docId,
      url: `${origin}/share/${docId}`,
      created: new Date().toISOString(),
    };
    setSharedLinks((prev) => [link, ...prev]);
    addActivity('share', 'Generated share link');
    return link;
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const filteredDocuments = useMemo(() => {
    const scope = userDocuments;
    if (!searchQuery.trim()) return scope;
    const q = searchQuery.toLowerCase();
    return scope.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.issuedBy || '').toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }, [userDocuments, searchQuery]);

  const documentsWithValidity = useMemo(
    () => userDocuments.map((d) => ({ ...d, validity: checkDocumentValidity(d) })),
    [userDocuments]
  );

  const exportDocuments = () => {
    const blob = new Blob([JSON.stringify(userDocuments, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'digilocker-export.json';
    a.click();
    URL.revokeObjectURL(url);
    addActivity('download', 'Exported all documents');
  };

  const syncDigiLocker = async () => {
    await new Promise((r) => setTimeout(r, 1500));
    addActivity('verify', 'DigiLocker sync completed');
    return { success: true, synced: userDocuments.length };
  };

  const getDocumentsForUser = (userId) =>
    documents.filter((d) => d.userId === userId);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        userDocuments,
        filteredDocuments,
        documentsWithValidity,
        activities,
        notifications,
        sharedLinks,
        stats,
        searchQuery,
        setSearchQuery,
        uploadDocument,
        updateDocumentStatus,
        removeDocument,
        deleteDocument,
        downloadDocument,
        createShareLink,
        markNotificationRead,
        exportDocuments,
        syncDigiLocker,
        addActivity,
        getDocumentsForUser,
        isAdmin,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export const useDocuments = () => useContext(DocumentContext);
