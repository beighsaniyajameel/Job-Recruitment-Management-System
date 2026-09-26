const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

// Verifies the JWT from the Authorization header and attaches the
// authenticated user (minus password) to req.user.
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'Not authorized. User no longer exists.');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(401, 'Not authorized. Invalid or expired token.');
  }
});

// Restricts a route to one or more roles, e.g. authorize('recruiter', 'admin')
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authorized.');
  }
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, `Role '${req.user.role}' is not permitted to perform this action.`);
  }
  next();
};

module.exports = { protect, authorize };
