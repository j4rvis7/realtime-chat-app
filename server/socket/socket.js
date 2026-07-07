const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Map of userId -> socketId for online tracking
const onlineUsers = new Map();

const initSocket = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      socket.disconnect();
      return;
    }

    console.log(`Socket connected: ${socket.id} | User: ${userId}`);

    // Register user as online
    onlineUsers.set(userId, socket.id);
    User.findByIdAndUpdate(userId, { isOnline: true }).exec();

    // Broadcast online users list to everyone
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));

    // Join a conversation room
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined room: ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leaveConversation', (conversationId) => {
      socket.leave(conversationId);
    });

    // Handle sending a new message
    socket.on('sendMessage', async (data) => {
      try {
        const { conversationId, content } = data;

        // Validate conversation access
        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: userId,
        });
        if (!conversation) return;

        // Persist message to DB
        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          content,
        });

        // Update conversation's last message
        conversation.lastMessage = message._id;
        conversation.lastMessageAt = message.createdAt;
        await conversation.save();

        // Populate sender info
        const populated = await message.populate('sender', 'username fullName profilePicture');

        // Emit to all users in the conversation room
        io.to(conversationId).emit('newMessage', populated);

        // Also notify offline participants (emit to their socket if online but in different room)
        const otherParticipants = conversation.participants.filter(
          (p) => String(p) !== String(userId)
        );
        otherParticipants.forEach((participantId) => {
          const recipientSocketId = onlineUsers.get(String(participantId));
          if (recipientSocketId) {
            io.to(recipientSocketId).emit('conversationUpdated', {
              conversationId,
              lastMessage: populated,
            });
          }
        });
      } catch (err) {
        console.error('Socket sendMessage error:', err.message);
        socket.emit('error', { message: 'Failed to send message.' });
      }
    });

    // Typing indicator — start
    socket.on('typing', ({ conversationId }) => {
      socket.to(conversationId).emit('userTyping', { userId, conversationId });
    });

    // Typing indicator — stop
    socket.on('stopTyping', ({ conversationId }) => {
      socket.to(conversationId).emit('userStoppedTyping', { userId, conversationId });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id} | User: ${userId}`);
      onlineUsers.delete(userId);
      User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() }).exec();
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = { initSocket, onlineUsers };
