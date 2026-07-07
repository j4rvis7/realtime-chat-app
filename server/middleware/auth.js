const AppError = require('../utils/AppError');

/**
 * Middleware to check if the user is authenticated via Passport session.
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return next(new AppError('You must be logged in to access this resource.', 401));
};

module.exports = { isAuthenticated };
