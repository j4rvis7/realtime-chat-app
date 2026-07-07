import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import ChatList from '../../components/ChatList/ChatList';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import OnlineUsers from '../../components/OnlineUsers/OnlineUsers';
import './Chat.css';

const Chat = () => {
  const { fetchConversations, startConversation, openConversation } = useChat();
  const { onlineUserIds } = useSocket();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleStartChat = async (userId) => {
    const conv = await startConversation(userId);
    if (conv) openConversation(conv);
  };

  return (
    <div className="chat-page">
      {/* Sidebar */}
      <aside className="chat-sidebar" aria-label="Conversations sidebar">
        <div className="chat-sidebar-header">
          <h2 className="chat-sidebar-title">Messages</h2>
          <Link to="/search" className="btn btn-ghost btn-icon" title="Find new users" id="btn-new-chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </Link>
        </div>
        <div className="chat-sidebar-content">
          <ChatList />
          <OnlineUsers onStartChat={handleStartChat} />
        </div>
      </aside>

      {/* Main chat area */}
      <main className="chat-main" aria-label="Chat area">
        <ChatWindow />
      </main>
    </div>
  );
};

export default Chat;
