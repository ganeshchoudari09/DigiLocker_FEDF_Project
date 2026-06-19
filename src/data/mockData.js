export const DOCUMENT_CATEGORIES = [
  { id: 'aadhaar', name: 'Aadhaar', icon: '🪪', color: '#6A35FF', tint: 'rgba(106, 53, 255, 0.08)' },
  { id: 'pan', name: 'PAN', icon: '💳', color: '#FF7BCB', tint: 'rgba(255, 123, 203, 0.08)' },
  { id: 'dl', name: 'Driving License', icon: '🚗', color: '#3B82F6', tint: 'rgba(59, 130, 246, 0.08)' },
  { id: 'voter', name: 'Voter ID', icon: '🗳️', color: '#22C55E', tint: 'rgba(34, 197, 94, 0.08)' },
  { id: 'passport', name: 'Passport', icon: '✈️', color: '#F59E0B', tint: 'rgba(245, 158, 11, 0.08)' },
  { id: 'education', name: 'Education', icon: '🎓', color: '#B088FF', tint: 'rgba(176, 136, 255, 0.08)' },
  { id: 'rc', name: 'Vehicle RC', icon: '🏎️', color: '#EF4444', tint: 'rgba(239, 68, 68, 0.08)' },
  { id: 'insurance', name: 'Insurance', icon: '🛡️', color: '#06B6D4', tint: 'rgba(6, 182, 212, 0.08)' },
];

export const GOVERNMENT_SERVICES = [
  { id: '1', name: 'Income Tax e-Filing', dept: 'CBDT', linked: true },
  { id: '2', name: 'Passport Seva', dept: 'MEA', linked: true },
  { id: '3', name: 'EPFO Member Portal', dept: 'EPFO', linked: false },
  { id: '4', name: 'Ayushman Bharat', dept: 'NHA', linked: false },
  { id: '5', name: 'DigiYatra', dept: 'MoCA', linked: true },
];

export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/documents', label: 'My Documents', icon: 'FileText' },
  { path: '/shared', label: 'Shared Documents', icon: 'Share2' },
  { path: '/issued', label: 'Issued Documents', icon: 'Award' },
  { path: '/drive', label: 'Drive', icon: 'HardDrive' },
  { path: '/security', label: 'Security', icon: 'Shield' },
  { path: '/activity', label: 'Activity', icon: 'Activity' },
];
