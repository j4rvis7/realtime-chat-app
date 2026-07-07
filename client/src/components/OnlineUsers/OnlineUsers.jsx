import { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { userAPI } from '../../api';
import Avatar from '../Avatar/Avatar';
import './OnlineUsers.css';

const OnlineUsers = ({ onStartChat }) => {
  const { onlineUserIds } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (onlineUserIds.length === 0) {
      setOnlineUsers([]);
      return;
    }
    userAPI.getOnline()
      .then((res) => setOnlineUsers(res.data.users))
      .catch(() => setOnlineUsers([]));
  }, [onlineUserIds]);

  if (onlineUsers.length === 0) return null;

  return (
    <div className="online-users">
      <h4 className="online-users-title">
        <span className="status-dot online" style={{ display: 'inline-block', marginRight: 6 }} />
        Online ({onlineUsers.length})
      </h4>
      <ul className="online-users-list">
        {onlineUsers.map((u) => (
          <li key={u._id}>
            <button
              className="online-user-item"
              onClick={() => onStartChat && onStartChat(u._id)}
              id={`online-user-${u._id}`}
              aria-label={`Chat with ${u.fullName || u.username}`}
            >
              <Avatar user={u} size="sm" showOnline isOnline />
              <span className="online-user-name">{u.fullName || u.username}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
