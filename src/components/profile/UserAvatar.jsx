import { getInitials } from '../../utils/profileUtils';
import './UserAvatar.css';

const SIZE_MAP = {
  sm: 36,
  md: 48,
  lg: 80,
  xl: 120,
};

export default function UserAvatar({ user, size = 'sm', className = '' }) {
  const px = SIZE_MAP[size] || SIZE_MAP.sm;
  const initials = user?.avatar || getInitials(user?.name);
  const hasImage = !!user?.profilePicture;

  return (
    <div
      className={`user-avatar user-avatar-${size} ${hasImage ? 'has-image' : ''} ${className}`}
      style={{ width: px, height: px }}
      aria-hidden={hasImage ? undefined : true}
    >
      {hasImage ? (
        <img src={user.profilePicture} alt={user?.name || 'Profile'} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
