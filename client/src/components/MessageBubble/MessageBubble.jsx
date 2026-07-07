import Avatar from '../Avatar/Avatar';
import './MessageBubble.css';

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageBubble = ({ message, isOwn, showAvatar }) => {
  return (
    <div className={`message-wrapper ${isOwn ? 'own' : 'other'} animate-fade-in`}>
      {!isOwn && (
        <div className="message-avatar-col">
          {showAvatar ? <Avatar user={message.sender} size="sm" /> : <div className="avatar-spacer" />}
        </div>
      )}
      <div className="message-content-col">
        {!isOwn && showAvatar && (
          <span className="message-sender-name">
            {message.sender?.fullName || message.sender?.username}
          </span>
        )}
        <div className={`message-bubble ${isOwn ? 'bubble-own' : 'bubble-other'}`}>
          <p className="message-text">{message.content}</p>
        </div>
        <span className="message-time">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
