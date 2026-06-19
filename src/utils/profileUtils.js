export function getInitials(name) {
  if (!name?.trim()) return 'U';
  return name
    .trim()
    .split(/\s+/)[0][0]
    .toUpperCase();
}

export function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const PROFILE_PIC_MAX_SIZE = 2 * 1024 * 1024;
export const PROFILE_PIC_ACCEPT = 'image/jpeg,image/png,image/webp,image/jpg';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[a-zA-Z]+(?:[ '\-][a-zA-Z]+)*$/;

export function formatPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  const mobile = digits.length > 10 ? digits.slice(-10) : digits;
  if (mobile.length === 10) return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;
  return phone.trim();
}

export function validateProfile({ name, email, phone }) {
  const errors = {};
  const trimmedName = (name ?? '').trim();
  const trimmedEmail = (email ?? '').trim();
  const trimmedPhone = (phone ?? '').trim();

  if (!trimmedName) {
    errors.name = 'Full name is required.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (trimmedName.length > 50) {
    errors.name = 'Name must be 50 characters or less.';
  } else if (!NAME_REGEX.test(trimmedName)) {
    errors.name = 'Use letters only (spaces and hyphens allowed).';
  }

  if (!trimmedEmail) {
    errors.email = 'Email is required.';
  } else if (trimmedEmail.length > 100) {
    errors.email = 'Email must be 100 characters or less.';
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address (e.g. you@email.com).';
  }

  if (trimmedPhone) {
    const digits = trimmedPhone.replace(/\D/g, '');
    const mobile = digits.length > 10 ? digits.slice(-10) : digits;

    if (mobile.length !== 10) {
      errors.phone = 'Phone number must be 10 digits.';
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      errors.phone = 'Enter a valid Indian mobile number (starts with 6–9).';
    }
  } else {
    errors.phone = 'Phone number is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name: trimmedName,
      email: trimmedEmail.toLowerCase(),
      phone: trimmedPhone ? formatPhone(trimmedPhone) : '',
    },
  };
}

export function validateProfilePicture(file) {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please upload a JPG, PNG, or WEBP image.' };
  }
  if (file.size > PROFILE_PIC_MAX_SIZE) {
    return { isValid: false, error: 'Image must be under 2 MB.' };
  }
  return { isValid: true, error: null };
}
