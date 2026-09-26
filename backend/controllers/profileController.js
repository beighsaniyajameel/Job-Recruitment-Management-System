const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

// @route  GET /api/profile/me
// @access Private (any authenticated user)
const getMyProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, profile: req.user.toSafeObject() });
});

// @route  PUT /api/profile/me
// @access Private (any authenticated user)
const updateMyProfile = asyncHandler(async (req, res) => {
  const allowedFields =
    req.user.role === 'recruiter'
      ? ['name', 'company']
      : ['name', 'skills', 'resumeUrl'];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, `No updatable fields provided. Allowed fields: ${allowedFields.join(', ')}`);
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, message: 'Profile updated', profile: updatedUser.toSafeObject() });
});

// @route  GET /api/profile/:id
// @access Private (admin only) - view any user's profile
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  res.json({ success: true, profile: user.toSafeObject() });
});

module.exports = { getMyProfile, updateMyProfile, getUserById };
