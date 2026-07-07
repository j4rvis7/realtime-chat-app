const Avatar = ({ user, size = 'md', showOnline = false, isOnline = false }) => {
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : user?.username?.[0]?.toUpperCase() || '?';

  const sizeMap = {
    sm: { dim: 32, font: 12 },
    md: { dim: 44, font: 16 },
    lg: { dim: 56, font: 20 },
    xl: { dim: 80, font: 28 },
    '2xl': { dim: 120, font: 40 },
  };

  const { dim, font } = sizeMap[size] || sizeMap.md;

  return (
    <div style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
      {user?.profilePicture?.url ? (
        <img
          src={user.profilePicture.url}
          alt={user.fullName || user.username}
          className={`avatar avatar-${size}`}
          style={{ width: dim, height: dim }}
        />
      ) : (
        <div
          className={`avatar-placeholder avatar-${size}`}
          style={{ width: dim, height: dim, fontSize: font }}
          aria-label={initials}
        >
          {initials}
        </div>
      )}
      {showOnline && isOnline && <span className="online-dot" />}
    </div>
  );
};

export default Avatar;
