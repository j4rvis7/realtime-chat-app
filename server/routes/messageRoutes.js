const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const { isAuthenticated } = require('../middleware/auth');
const { messageSchema, validate } = require('../validators/schemas');

router.use(isAuthenticated);

router.get('/:conversationId', getMessages);
router.post('/:conversationId', validate(messageSchema), sendMessage);

module.exports = router;
