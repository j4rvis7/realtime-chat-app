import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../api';
import { useChat } from '../../context/ChatContext';
import Avatar from '../../components/Avatar/Avatar';
import { useSocket } from '../../context/SocketContext';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const { startConversation, openConversation } = useChat();
  const { onlineUserIds } = useSocket();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) { setResults([]); setNoResults(false); return; }

    setSearching(true);
    try {
      const res = await userAPI.search(val.trim());
      setResults(res.data.users);
      setNoResults(res.data.users.length === 0);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleStartChat = async (userId) => {
    const conv = await startConversation(userId);
    if (conv) {
      openConversation(conv);
      navigate('/chat');
    }
  };

  return (
    <main className="search-page">
      <div className="search-container animate-fade-in">
        <div className="search-header">
          <h1 className="search-title">Find Users</h1>
          <p className="search-subtitle">Search by name, username, or email</p>
        </div>

        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            id="search-input"
            type="search"
            className="search-input"
            placeholder="Search for users..."
            value={query}
            onChange={handleSearch}
            autoFocus
            aria-label="Search users"
          />
          {searching && <span className="spinner" style={{ marginRight: 12 }} />}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="search-results" role="list">
            {results.map((u) => (
              <li key={u._id}>
                <div className="search-result-item card animate-fade-in">
                  <div className="search-result-left">
                    <Avatar user={u} size="md" showOnline isOnline={onlineUserIds.includes(u._id)} />
                    <div className="search-result-info">
                      <span className="search-result-name">{u.fullName}</span>
                      <span className="search-result-username">@{u.username}</span>
                      {u.bio && <span className="search-result-bio">{u.bio}</span>}
                    </div>
                  </div>
                  <div className="search-result-actions">
                    {onlineUserIds.includes(u._id) && (
                      <span className="badge badge-success">Online</span>
                    )}
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleStartChat(u._id)}
                      id={`btn-chat-${u._id}`}
                      aria-label={`Start chat with ${u.fullName}`}
                    >
                      Message
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {noResults && query && (
          <div className="search-empty">
            <span className="search-empty-icon">🔍</span>
            <p>No users found for &quot;{query}&quot;</p>
          </div>
        )}

        {!query && (
          <div className="search-placeholder">
            <span className="search-placeholder-icon">👥</span>
            <p>Start typing to find people</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Search;
