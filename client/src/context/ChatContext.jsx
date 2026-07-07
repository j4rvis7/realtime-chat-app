import { createContext, useContext, useState, useCallback } from 'react';
import { conversationAPI, messageAPI } from '../api';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const fetchConversations = useCallback(async () => {
    setLoadingConvs(true);
    try {
      const res = await conversationAPI.getAll();
      setConversations(res.data.conversations);
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  const openConversation = useCallback(async (conversation) => {
    setActiveConversation(conversation);
    setLoadingMsgs(true);
    try {
      const res = await messageAPI.getMessages(conversation._id);
      setMessages(res.data.messages);
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  const startConversation = useCallback(async (recipientId) => {
    const res = await conversationAPI.createOrGet(recipientId);
    const conv = res.data.conversation;
    setConversations((prev) => {
      const exists = prev.find((c) => c._id === conv._id);
      return exists ? prev : [conv, ...prev];
    });
    return conv;
  }, []);

  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
    // Update conversation's last message in the list
    setConversations((prev) =>
      prev.map((c) =>
        c._id === message.conversation
          ? { ...c, lastMessage: message, lastMessageAt: message.createdAt }
          : c
      )
    );
  }, []);

  const updateConversationList = useCallback(({ conversationId, lastMessage }) => {
    setConversations((prev) =>
      prev.map((c) =>
        c._id === conversationId
          ? { ...c, lastMessage, lastMessageAt: lastMessage.createdAt }
          : c
      ).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
    );
  }, []);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        loadingConvs,
        loadingMsgs,
        fetchConversations,
        openConversation,
        startConversation,
        addMessage,
        updateConversationList,
        setActiveConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
};
