const express = require('express');
const router = express.Router();
const {
  searchUsers,
  getUserById,
  getOnlineUsers,
  updateProfile,
  uploadAvatar,
} = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');
const { updateProfileSchema, validate } = require('../validators/schemas');
const { upload } = require('../config/cloudinary');

// All user routes require authentication
router.use(isAuthenticated);

router.get('/search', searchUsers);
router.get('/online', getOnlineUsers);
router.get('/:id', getUserById);
router.put('/profile', validate(updateProfileSchema), updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);

module.exports = router;
