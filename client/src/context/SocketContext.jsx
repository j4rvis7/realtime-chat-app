import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  useEffect(() => {
    if (!user?._id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: { userId: user._id },
    });

    socketRef.current = socket;

    socket.on('connect', () => console.log('Socket connected:', socket.id));
    socket.on('disconnect', () => console.log('Socket disconnected'));
    socket.on('onlineUsers', (ids) => setOnlineUserIds(ids));
    socket.on('connect_error', (err) => console.error('Socket connection error:', err.message));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  const getSocket = () => socketRef.current;

  return (
    <SocketContext.Provider value={{ getSocket, onlineUserIds }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used inside SocketProvider');
  return ctx;
};
