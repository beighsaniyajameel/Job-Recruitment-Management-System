const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @route  POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, skills, company } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  if (role === 'recruiter' && !company) {
    throw new ApiError(400, 'Recruiters must provide a company name.');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'job_seeker',
    ...(role === 'job_seeker' && skills ? { skills } : {}),
    ...(role === 'recruiter' && company ? { company } : {})
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user: user.toSafeObject()
  });
});

// @route  POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = generateToken(user);

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: user.toSafeObject()
  });
});

// @route  GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

module.exports = { register, login, getMe };
