const express = require('express');
const router = express.Router();
const {
  getConversations,
  createOrGetConversation,
  getConversationById,
} = require('../controllers/conversationController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', getConversations);
router.post('/', createOrGetConversation);
router.get('/:id', getConversationById);

module.exports = router;
