import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.username || form.username.length < 3) errs.username = 'Username must be at least 3 characters.';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.fullName || form.fullName.length < 2) errs.fullName = 'Full name must be at least 2 characters.';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register(form);
      navigate('/chat');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow" aria-hidden="true" />
      <div className="auth-card card-glass animate-scale-in">
        <div className="auth-header">
          <span className="auth-logo">💬</span>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join ChatterBox and start messaging</p>
        </div>

        {serverError && (
          <div className="alert alert-error" role="alert">
            ⚠️ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="reg-fullName" className="form-label">Full Name</label>
            <input
              id="reg-fullName"
              name="fullName"
              type="text"
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              autoFocus
            />
            {errors.fullName && <span className="form-error">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-username" className="form-label">Username</label>
            <input
              id="reg-username"
              name="username"
              type="text"
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="johndoe"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            id="btn-register-submit"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" id="link-to-login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
