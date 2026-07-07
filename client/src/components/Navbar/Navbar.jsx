import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../Avatar/Avatar';
import { useSocket } from '../../context/SocketContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { onlineUserIds } = useSocket();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar" role="banner">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">💬</span>
          <span className="navbar-logo-text">ChatterBox</span>
        </Link>
      </div>

      <nav className="navbar-nav" role="navigation" aria-label="Main navigation">
        <Link to="/chat" className="nav-link" id="nav-chat">Chat</Link>
        <Link to="/search" className="nav-link" id="nav-search">Find Users</Link>
      </nav>

      <div className="navbar-actions">
        {user ? (
          <div className="navbar-user">
            <Link to="/profile" className="navbar-profile-link" id="nav-profile">
              <Avatar user={user} size="sm" showOnline isOnline={true} />
              <span className="navbar-username">{user.username}</span>
            </Link>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleLogout}
              id="btn-logout"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-sm">
            <Link to="/login" className="btn btn-ghost btn-sm" id="nav-login">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
