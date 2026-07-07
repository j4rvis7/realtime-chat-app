import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../api';
import Avatar from '../../components/Avatar/Avatar';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await userAPI.uploadAvatar(formData);
      updateUser(res.data.user);
      setSuccess('Profile picture updated!');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="profile-page">
      <div className="profile-container animate-fade-in">
        {/* Cover */}
        <div className="profile-cover" aria-hidden="true" />

        {/* Profile Card */}
        <div className="profile-card card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
              <Avatar user={user} size="2xl" showOnline isOnline />
              <label
                htmlFor="avatar-upload"
                className="avatar-upload-btn"
                title="Change profile picture"
                aria-label="Upload profile picture"
              >
                {uploading ? (
                  <span className="spinner" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{user?.fullName}</h1>
            <p className="profile-username">@{user?.username}</p>
            {user?.bio && <p className="profile-bio">{user.bio}</p>}
            <div className="profile-meta">
              <div className="profile-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>{user?.email}</span>
              </div>
              <div className="profile-meta-item">
                <span className={`status-dot ${user?.isOnline ? 'online' : 'offline'}`} />
                <span>{user?.isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <Link to="/profile/edit" className="btn btn-primary" id="btn-edit-profile">
              Edit Profile
            </Link>
            <Link to="/chat" className="btn btn-secondary" id="btn-go-chat">
              Go to Chat
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats card">
          <h2 className="profile-stats-title">Account Details</h2>
          <div className="profile-stats-grid">
            <div className="profile-stat-item">
              <span className="profile-stat-label">Member since</span>
              <span className="profile-stat-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
              </span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-label">Username</span>
              <span className="profile-stat-value">@{user?.username}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
