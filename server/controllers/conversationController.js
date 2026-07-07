const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/AppError');

// GET /api/conversations — Get all conversations for current user
const getConversations = asyncWrapper(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate('participants', '-hash -salt')
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'username fullName profilePicture' },
    })
    .sort({ lastMessageAt: -1 });

  res.json({ success: true, conversations });
});

// POST /api/conversations — Create or get existing conversation
const createOrGetConversation = asyncWrapper(async (req, res, next) => {
  const { recipientId } = req.body;
  if (!recipientId) return next(new AppError('Recipient ID is required.', 400));
  if (recipientId === String(req.user._id))
    return next(new AppError('Cannot start a conversation with yourself.', 400));

  // Check if conversation already exists between the two users
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, recipientId], $size: 2 },
  })
    .populate('participants', '-hash -salt')
    .populate('lastMessage');

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, recipientId],
    });
    conversation = await conversation.populate('participants', '-hash -salt');
  }

  res.json({ success: true, conversation });
});

// GET /api/conversations/:id — Get single conversation
const getConversationById = asyncWrapper(async (req, res, next) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    participants: req.user._id,
  }).populate('participants', '-hash -salt');

  if (!conversation) return next(new AppError('Conversation not found.', 404));
  res.json({ success: true, conversation });
});

module.exports = { getConversations, createOrGetConversation, getConversationById };
