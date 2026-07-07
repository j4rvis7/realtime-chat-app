/**
 * Wraps async route handlers to avoid try/catch boilerplate.
 * Catches errors and passes them to Express error middleware.
 */
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncWrapper;
