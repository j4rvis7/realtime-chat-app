import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../api';
import './EditProfile.css';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) { setError('Full name is required.'); return; }
    if (form.fullName.length < 2) { setError('Full name must be at least 2 characters.'); return; }

    setLoading(true);
    try {
      const res = await userAPI.updateProfile({
        fullName: form.fullName,
        email: form.email,
        bio: form.bio,
      });
      updateUser(res.data.user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="edit-profile-page">
      <div className="edit-profile-container animate-fade-in">
        <div className="edit-profile-header">
          <h1 className="edit-profile-title">Edit Profile</h1>
          <p className="edit-profile-subtitle">Update your personal information</p>
        </div>

        <div className="card edit-profile-card">
          {error && <div className="alert alert-error" role="alert">⚠️ {error}</div>}
          {success && <div className="alert alert-success" role="alert">✅ {success}</div>}

          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="form-group">
              <label htmlFor="edit-fullName" className="form-label">Full Name *</label>
              <input
                id="edit-fullName"
                name="fullName"
                type="text"
                className="form-input"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-email" className="form-label">Email</label>
              <input
                id="edit-email"
                name="email"
                type="email"
                className="form-input"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-bio" className="form-label">Bio</label>
              <textarea
                id="edit-bio"
                name="bio"
                className="form-input"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell people about yourself..."
                rows={4}
                maxLength={200}
                style={{ resize: 'vertical' }}
              />
              <span className="text-xs text-muted" style={{ alignSelf: 'flex-end' }}>
                {form.bio.length}/200
              </span>
            </div>

            <div className="edit-profile-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/profile')}
                id="btn-cancel-edit"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                id="btn-save-profile"
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditProfile;
