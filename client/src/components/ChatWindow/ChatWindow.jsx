import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useChat } from '../../context/ChatContext';
import MessageBubble from '../MessageBubble/MessageBubble';
import Avatar from '../Avatar/Avatar';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './ChatWindow.css';

const ChatWindow = () => {
  const { user } = useAuth();
  const { getSocket, onlineUserIds } = useSocket();
  const { activeConversation, messages, loadingMsgs, addMessage } = useChat();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentConvRef = useRef(null);

  const otherUser = activeConversation?.participants?.find((p) => p._id !== user._id);
  const isOtherOnline = onlineUserIds.includes(otherUser?._id);

  // Join/leave socket rooms when active conversation changes
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !activeConversation) return;

    if (currentConvRef.current && currentConvRef.current !== activeConversation._id) {
      socket.emit('leaveConversation', currentConvRef.current);
    }

    socket.emit('joinConversation', activeConversation._id);
    currentConvRef.current = activeConversation._id;
    setTypingUsers([]);

    const handleNewMessage = (message) => {
      if (message.conversation === activeConversation._id || message.conversation?._id === activeConversation._id) {
        if (message.sender?._id !== user._id) {
          addMessage(message);
        }
      }
    };

    const handleUserTyping = ({ userId: uid }) => {
      if (uid !== user._id) {
        setTypingUsers((prev) => (prev.includes(uid) ? prev : [...prev, uid]));
      }
    };

    const handleUserStoppedTyping = ({ userId: uid }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== uid));
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
    };
  }, [activeConversation?._id, getSocket, user._id, addMessage]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !activeConversation) return;
    socket.emit('typing', { conversationId: activeConversation._id });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { conversationId: activeConversation._id });
    }, 1500);
  }, [getSocket, activeConversation]);

  const handleSend = useCallback(async () => {
    const content = input.trim();
    if (!content || !activeConversation || sending) return;

    const socket = getSocket();
    setInput('');
    setSending(true);

    // Optimistically add message to UI
    const optimisticMsg = {
      _id: `temp-${Date.now()}`,
      conversation: activeConversation._id,
      sender: { _id: user._id, username: user.username, fullName: user.fullName, profilePicture: user.profilePicture },
      content,
      createdAt: new Date().toISOString(),
    };
    addMessage(optimisticMsg);

    if (socket) {
      socket.emit('sendMessage', { conversationId: activeConversation._id, content });
      socket.emit('stopTyping', { conversationId: activeConversation._id });
    }

    setSending(false);
  }, [input, activeConversation, sending, getSocket, user, addMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeConversation) {
    return (
      <div className="chat-window-empty">
        <div className="chat-window-empty-content animate-fade-in">
          <span className="chat-window-empty-icon">💬</span>
          <h2>Select a conversation</h2>
          <p>Choose from your existing conversations or start a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-window-header">
        <div className="chat-header-user">
          <Avatar user={otherUser} size="md" showOnline isOnline={isOtherOnline} />
          <div className="chat-header-info">
            <h3 className="chat-header-name">{otherUser?.fullName || otherUser?.username}</h3>
            <span className="chat-header-status">
              {isOtherOnline ? (
                <><span className="status-dot online" />Online</>
              ) : (
                <><span className="status-dot offline" />Offline</>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" role="log" aria-live="polite" aria-label="Messages">
        {loadingMsgs ? (
          <LoadingSpinner text="Loading messages..." />
        ) : (
          <>
            {messages.length === 0 && (
              <div className="chat-messages-empty">
                <p>Say hello! 👋</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <MessageBubble
                key={msg._id || idx}
                message={msg}
                isOwn={msg.sender?._id === user._id || msg.sender === user._id}
                showAvatar={
                  idx === 0 ||
                  messages[idx - 1]?.sender?._id !== msg.sender?._id
                }
              />
            ))}
            {typingUsers.length > 0 && (
              <div className="typing-indicator animate-fade-in">
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
                <span className="typing-text">typing…</span>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <textarea
            id="chat-message-input"
            className="chat-input"
            value={input}
            onChange={(e) => { setInput(e.target.value); handleTyping(); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            maxLength={2000}
            aria-label="Message input"
          />
          <button
            className="btn btn-primary chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || sending}
            id="btn-send-message"
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
