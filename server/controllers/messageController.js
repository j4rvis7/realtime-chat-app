const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/AppError');

// GET /api/messages/:conversationId — Get all messages in a conversation
const getMessages = asyncWrapper(async (req, res, next) => {
  const { conversationId } = req.params;

  // Verify user is a participant
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.user._id,
  });
  if (!conversation) return next(new AppError('Conversation not found or access denied.', 403));

  const messages = await Message.find({ conversation: conversationId })
    .populate('sender', 'username fullName profilePicture')
    .sort({ createdAt: 1 });

  res.json({ success: true, messages });
});

// POST /api/messages/:conversationId — Send a message (REST fallback)
const sendMessage = asyncWrapper(async (req, res, next) => {
  const { conversationId } = req.params;
  const { content } = req.body;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.user._id,
  });
  if (!conversation) return next(new AppError('Conversation not found or access denied.', 403));

  const message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    content,
  });

  // Update conversation's lastMessage
  conversation.lastMessage = message._id;
  conversation.lastMessageAt = message.createdAt;
  await conversation.save();

  const populated = await message.populate('sender', 'username fullName profilePicture');
  res.status(201).json({ success: true, message: populated });
});

module.exports = { getMessages, sendMessage };
