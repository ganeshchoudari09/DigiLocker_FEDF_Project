import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { DOCUMENT_CATEGORIES } from '../../data/mockData';
import {
  formatFileSize,
  isAcceptedFile,
  MAX_FILE_SIZE,
  ACCEPTED_EXTENSIONS,
} from '../../utils/fileStorage';
import './Modal.css';

const CATEGORIES = DOCUMENT_CATEGORIES.map((cat) => cat.id);

const EMPTY_FORM = { name: '', category: 'aadhaar', issuedBy: '' };

const CATEGORY_KEYWORDS = [
  { id: 'aadhaar', keywords: ['aadhaar', 'aadhar', 'uidai', 'identity', 'identity card'] },
  { id: 'pan', keywords: ['pan', 'permanent account', 'account number'] },
  { id: 'dl', keywords: ['driving license', 'driving licence', 'driver license', 'dl', 'license'] },
  { id: 'voter', keywords: ['voter', 'electoral', 'epic', 'voter id'] },
  { id: 'passport', keywords: ['passport'] },
  { id: 'education', keywords: ['education', 'degree', 'certificate', 'transcript', 'marksheet', 'diploma', 'school', 'college', 'university'] },
  { id: 'rc', keywords: ['rc', 'registration', 'registration certificate', 'vehicle registration'] },
  { id: 'insurance', keywords: ['insurance', 'policy'] },
];

const guessDocumentCategory = (fileName) => {
  const lowerName = fileName.toLowerCase();
  for (const category of CATEGORY_KEYWORDS) {
    if (category.keywords.some((keyword) => lowerName.includes(keyword))) {
      return category.id;
    }
  }
  return EMPTY_FORM.category;
};

export default function UploadModal({ open, onClose }) {
  const { uploadDocument } = useDocuments();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(EMPTY_FORM);
      setSelectedFile(null);
      setError('');
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [open]);

  const handleFile = (file) => {
    if (!file) return;

    if (!isAcceptedFile(file)) {
      setError('Please upload a PDF, JPG, PNG, or WEBP file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be under 10 MB.');
      return;
    }

    setError('');
    setSelectedFile(file);
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const guessedCategory = guessDocumentCategory(baseName);
    setForm((prev) => ({
      ...prev,
      name: prev.name.trim() || baseName,
      category: prev.category === EMPTY_FORM.category ? guessedCategory : prev.category,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    if (!form.name.trim()) {
      setError('Please enter a document name.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      await uploadDocument(
        {
          ...form,
          name: form.name.trim(),
          size: formatFileSize(selectedFile.size),
          fileName: selectedFile.name,
          mimeType: selectedFile.type,
          hasFile: true,
        },
        selectedFile
      );
      onClose();
    } catch {
      setError('Upload failed. Please try again with a smaller file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content premium-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Upload Document</h2>
              <button type="button" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS}
                className="file-input-hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              <div
                role="button"
                tabIndex={0}
                className={`drop-zone ${dragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  handleFile(e.dataTransfer.files?.[0]);
                }}
              >
                {selectedFile ? (
                  <>
                    <CheckCircle2 size={40} className="file-selected-icon" />
                    <p>{selectedFile.name}</p>
                    <span>{formatFileSize(selectedFile.size)} · Click to change file</span>
                  </>
                ) : (
                  <>
                    <Upload size={40} />
                    <p>Drag & drop your document here</p>
                    <span>or click to browse (PDF, JPG, PNG, WEBP · max 10 MB)</span>
                  </>
                )}
              </div>

              {error && <p className="upload-error">{error}</p>}

              <div className="form-group">
                <label>Document Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Aadhaar Card"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Issued By</label>
                <input
                  value={form.issuedBy}
                  onChange={(e) => setForm({ ...form, issuedBy: e.target.value })}
                  placeholder="Issuing authority (optional)"
                />
              </div>

              {selectedFile && (
                <div className="selected-file-preview">
                  <FileText size={18} />
                  <span>{selectedFile.name}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={uploading || !selectedFile}
              >
                {uploading ? 'Uploading...' : 'Upload to Vault'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
