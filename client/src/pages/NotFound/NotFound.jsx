import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <main className="not-found-page">
      <div className="not-found-content animate-fade-in">
        <div className="not-found-code" aria-hidden="true">404</div>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-message">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary btn-lg" id="btn-go-home">
            Go Home
          </Link>
          <Link to="/chat" className="btn btn-secondary btn-lg" id="btn-go-chat-404">
            Open Chat
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
