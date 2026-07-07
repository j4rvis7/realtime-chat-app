import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <main className="home-page">
      {/* Hero */}
      <section className="hero" aria-label="Hero section">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-content animate-fade-in">
          <div className="hero-badge">Real-Time Messaging</div>
          <h1 className="hero-title">
            Connect &amp; Chat
            <span className="hero-title-accent"> Instantly</span>
          </h1>
          <p className="hero-subtitle">
            A modern messaging platform with real-time communication, beautiful design,
            and seamless user experience — built for the way you work.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/chat" className="btn btn-primary btn-lg" id="btn-hero-chat">
                Open Chat 💬
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg" id="btn-hero-register">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg" id="btn-hero-login">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Floating chat preview cards */}
        <div className="hero-preview animate-fade-in" aria-hidden="true">
          <div className="preview-card preview-card-1">
            <div className="preview-avatar preview-avatar-1" />
            <div className="preview-bubble own">Hey! How's the project going? 🚀</div>
          </div>
          <div className="preview-card preview-card-2">
            <div className="preview-avatar preview-avatar-2" />
            <div className="preview-bubble other">Almost done! Should be ready by EOD 🎉</div>
          </div>
          <div className="preview-card preview-card-3">
            <div className="preview-avatar preview-avatar-1" />
            <div className="preview-bubble own">Awesome! Let's review it together.</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" aria-label="Features section">
        <h2 className="features-title">Everything you need to stay connected</h2>
        <div className="features-grid">
          {[
            { icon: '⚡', title: 'Real-Time Messaging', desc: 'Messages delivered instantly using Socket.IO — no delays, no refreshes.' },
            { icon: '🔒', title: 'Secure Authentication', desc: 'Session-based auth with Passport.js and password hashing keeps your account safe.' },
            { icon: '👤', title: 'User Profiles', desc: 'Customize your profile with a picture, bio, and display name.' },
            { icon: '🟢', title: 'Online Status', desc: 'See who\'s online in real time with live presence tracking.' },
            { icon: '📱', title: 'Fully Responsive', desc: 'Works beautifully on desktop, tablet, and mobile devices.' },
            { icon: '💾', title: 'Persistent History', desc: 'All messages are stored in MongoDB so your history is always available.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feature-card card animate-scale-in">
              <div className="feature-icon">{icon}</div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" aria-label="Call to action">
        <div className="cta-content">
          <h2>Ready to start chatting?</h2>
          <p>Join thousands of users and experience real-time communication.</p>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-lg" id="btn-cta-register">
              Create Your Account
            </Link>
          )}
          {user && (
            <Link to="/chat" className="btn btn-primary btn-lg" id="btn-cta-chat">
              Go to Chat
            </Link>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
