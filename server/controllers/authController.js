const passport = require('passport');
const User = require('../models/User');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/AppError');

// POST /api/auth/register
const register = asyncWrapper(async (req, res, next) => {
  const { username, email, fullName, password } = req.body;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) return next(new AppError('Email already in use.', 400));

  const newUser = new User({ username, email, fullName });
  const registeredUser = await User.register(newUser, password);

  req.login(registeredUser, (err) => {
    if (err) return next(err);
    const { password: _, salt: __, hash: ___, ...userData } = registeredUser.toObject();
    return res.status(201).json({ success: true, message: 'Registered successfully.', user: userData });
  });
});

// POST /api/auth/login
const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ success: false, message: info?.message || 'Invalid credentials.' });

    req.login(user, async (loginErr) => {
      if (loginErr) return next(loginErr);
      // Mark online
      await User.findByIdAndUpdate(user._id, { isOnline: true });
      const { salt: _, hash: __, ...userData } = user.toObject();
      return res.json({ success: true, message: 'Logged in successfully.', user: userData });
    });
  })(req, res, next);
};

// POST /api/auth/logout
const logout = asyncWrapper(async (req, res, next) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { isOnline: false, lastSeen: new Date() });
  }
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.json({ success: true, message: 'Logged out successfully.' });
    });
  });
});

// GET /api/auth/me
const getMe = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.user._id).select('-hash -salt');
  res.json({ success: true, user });
});

module.exports = { register, login, logout, getMe };
