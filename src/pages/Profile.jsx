import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle2, Mail, Phone, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserAvatar from '../components/profile/UserAvatar';
import { PROFILE_PIC_ACCEPT, validateProfile } from '../utils/profileUtils';
import './Profile.css';

const EMPTY_ERRORS = { name: '', email: '', phone: '' };

export default function Profile() {
  const { user, updateProfile, updateProfilePicture, removeProfilePicture } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [fieldErrors, setFieldErrors] = useState(EMPTY_ERRORS);
  const [touched, setTouched] = useState({ name: false, email: false, phone: false });
  const [saving, setSaving] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  }, [user?.name, user?.email, user?.phone]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError('');
    if (touched[field]) {
      const result = validateProfile({ ...form, [field]: value });
      setFieldErrors((prev) => ({ ...prev, [field]: result.errors[field] || '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = validateProfile(form);
    setFieldErrors((prev) => ({ ...prev, [field]: result.errors[field] || '' }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPicLoading(true);
    setFormError('');
    const result = await updateProfilePicture(file);
    setPicLoading(false);
    if (result.success) {
      setMessage('Profile picture updated!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setFormError(result.error);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true });

    const result = validateProfile(form);
    setFieldErrors({
      name: result.errors.name || '',
      email: result.errors.email || '',
      phone: result.errors.phone || '',
    });

    if (!result.isValid) {
      setFormError('Please fix the errors below before saving.');
      return;
    }

    setSaving(true);
    setFormError('');
    const saveResult = updateProfile(form);
    setSaving(false);

    if (!saveResult.success) {
      setFieldErrors((prev) => ({ ...prev, ...saveResult.errors }));
      setFormError('Please fix the errors below before saving.');
      return;
    }

    setMessage('Profile saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const hasFieldErrors = Object.values(fieldErrors).some(Boolean);

  return (
    <div className="page-container profile-page">
      <h1 className="page-title">My Profile</h1>
      <p className="page-subtitle">Manage your account information and profile picture</p>

      <div className="profile-layout">
        <motion.div
          className="profile-card premium-card profile-pic-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="profile-pic-wrap">
            <UserAvatar user={user} size="xl" />
            <button
              type="button"
              className="profile-pic-edit"
              onClick={() => fileInputRef.current?.click()}
              disabled={picLoading}
              aria-label="Change profile picture"
            >
              <Camera size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={PROFILE_PIC_ACCEPT}
              className="file-input-hidden"
              onChange={handlePhotoChange}
            />
          </div>
          <h2>{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          {user?.verified && (
            <span className="profile-verified">
              <CheckCircle2 size={16} /> Verified Account
            </span>
          )}
          <div className="profile-pic-actions">
            <button type="button" className="btn-primary" onClick={() => fileInputRef.current?.click()} disabled={picLoading}>
              {picLoading ? 'Uploading...' : 'Change Photo'}
            </button>
            {user?.profilePicture && (
              <button type="button" className="btn-secondary" onClick={removeProfilePicture}>
                Remove Photo
              </button>
            )}
          </div>
          <p className="profile-pic-hint">JPG, PNG, or WEBP · Max 2 MB</p>
        </motion.div>

        <motion.form
          className="profile-card premium-card profile-form-card"
          onSubmit={handleSave}
          noValidate
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <h3 className="profile-form-title">Personal Information</h3>

          {message && <p className="profile-message success">{message}</p>}
          {formError && <p className="profile-message error">{formError}</p>}

          <div className={`profile-field ${fieldErrors.name ? 'has-error' : ''}`}>
            <label htmlFor="profile-name"><User size={16} /> Full Name</label>
            <input
              id="profile-name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="e.g. Rahul Sharma"
              maxLength={50}
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
            />
            {fieldErrors.name && <span id="name-error" className="field-error">{fieldErrors.name}</span>}
          </div>

          <div className={`profile-field ${fieldErrors.email ? 'has-error' : ''}`}>
            <label htmlFor="profile-email"><Mail size={16} /> Email</label>
            <input
              id="profile-email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="you@email.com"
              maxLength={100}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email && <span id="email-error" className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className={`profile-field ${fieldErrors.phone ? 'has-error' : ''}`}>
            <label htmlFor="profile-phone"><Phone size={16} /> Phone</label>
            <input
              id="profile-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="+91 98765 43210"
              maxLength={15}
              aria-invalid={!!fieldErrors.phone}
              aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
            />
            {fieldErrors.phone && <span id="phone-error" className="field-error">{fieldErrors.phone}</span>}
            {!fieldErrors.phone && (
              <span className="field-hint">10-digit Indian mobile number</span>
            )}
          </div>

          <div className="profile-meta-row">
            <div className="profile-meta-item">
              <Shield size={18} color="var(--violet)" />
              <div>
                <span>Aadhaar Linked</span>
                <strong>{user?.aadhaarLinked ? 'Yes' : 'No'}</strong>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={saving || hasFieldErrors}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
