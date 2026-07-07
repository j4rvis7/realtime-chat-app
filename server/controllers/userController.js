const User = require('../models/User');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/AppError');
const { cloudinary } = require('../config/cloudinary');

// GET /api/users/search?q=query
const searchUsers = asyncWrapper(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 1) {
    return res.json({ success: true, users: [] });
  }
  const regex = new RegExp(q.trim(), 'i');
  const users = await User.find({
    $and: [
      { _id: { $ne: req.user._id } },
      { $or: [{ username: regex }, { fullName: regex }, { email: regex }] },
    ],
  })
    .select('-hash -salt')
    .limit(20);

  res.json({ success: true, users });
});

// GET /api/users/:id
const getUserById = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-hash -salt');
  if (!user) return next(new AppError('User not found.', 404));
  res.json({ success: true, user });
});

// GET /api/users/online
const getOnlineUsers = asyncWrapper(async (req, res) => {
  const users = await User.find({ isOnline: true, _id: { $ne: req.user._id } }).select(
    '-hash -salt'
  );
  res.json({ success: true, users });
});

// PUT /api/users/profile
const updateProfile = asyncWrapper(async (req, res, next) => {
  const { fullName, bio, email } = req.body;
  const updateData = {};
  if (fullName) updateData.fullName = fullName;
  if (bio !== undefined) updateData.bio = bio;
  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existing) return next(new AppError('Email already in use.', 400));
    updateData.email = email;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  }).select('-hash -salt');

  res.json({ success: true, message: 'Profile updated.', user: updatedUser });
});

// POST /api/users/avatar
const uploadAvatar = asyncWrapper(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded.', 400));

  // Delete old avatar from Cloudinary if it exists
  const currentUser = await User.findById(req.user._id);
  if (currentUser.profilePicture?.publicId) {
    await cloudinary.uploader.destroy(currentUser.profilePicture.publicId);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      profilePicture: {
        url: req.file.path,
        publicId: req.file.filename,
      },
    },
    { new: true }
  ).select('-hash -salt');

  res.json({ success: true, message: 'Avatar uploaded.', user: updatedUser });
});

module.exports = { searchUsers, getUserById, getOnlineUsers, updateProfile, uploadAvatar };
