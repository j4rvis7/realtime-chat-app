import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useChat } from '../../context/ChatContext';
import Avatar from '../Avatar/Avatar';
import './ChatList.css';

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const ChatList = () => {
  const { user } = useAuth();
  const { onlineUserIds } = useSocket();
  const { conversations, activeConversation, openConversation, loadingConvs } = useChat();

  if (loadingConvs) {
    return (
      <div className="chat-list-loading">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="chat-list-skeleton">
            <div className="skeleton-avatar" />
            <div className="skeleton-text">
              <div className="skeleton-line wide" />
              <div className="skeleton-line narrow" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="chat-list-empty">
        <span className="chat-list-empty-icon">💬</span>
        <p>No conversations yet</p>
        <small>Search for users to start chatting</small>
      </div>
    );
  }

  return (
    <ul className="chat-list" role="list" aria-label="Conversations">
      {conversations.map((conv) => {
        const other = conv.participants?.find((p) => p._id !== user._id);
        const isActive = activeConversation?._id === conv._id;
        const isOnline = onlineUserIds.includes(other?._id);
        const lastMsg = conv.lastMessage;

        return (
          <li key={conv._id}>
            <button
              className={`chat-list-item ${isActive ? 'active' : ''}`}
              onClick={() => openConversation(conv)}
              id={`conv-${conv._id}`}
              aria-selected={isActive}
            >
              <div className="chat-list-avatar">
                <Avatar user={other} size="md" showOnline isOnline={isOnline} />
              </div>
              <div className="chat-list-info">
                <div className="chat-list-header">
                  <span className="chat-list-name">{other?.fullName || other?.username}</span>
                  <span className="chat-list-time">
                    {formatTime(conv.lastMessageAt || conv.createdAt)}
                  </span>
                </div>
                <p className="chat-list-preview">
                  {lastMsg
                    ? lastMsg.sender?._id === user._id
                      ? `You: ${lastMsg.content}`
                      : lastMsg.content
                    : 'Start a conversation'}
                </p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ChatList;
