const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Runs after a chain of express-validator checks; collects any failures
// into a single, clean 400 response instead of letting bad data reach
// the controller.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const formatted = errors.array().map((e) => ({
    field: e.path,
    message: e.msg
  }));

  const error = new ApiError(400, 'Validation failed');
  error.details = formatted;
  next(error);
};

module.exports = validate;
