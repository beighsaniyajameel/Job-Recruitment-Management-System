const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { getMyProfile, updateMyProfile, getUserById } = require('../controllers/profileController');

const router = express.Router();

router.get('/me', protect, getMyProfile);

router.put(
  '/me',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('skills').optional().isArray().withMessage('Skills must be an array of strings'),
    body('company').optional().trim().notEmpty().withMessage('Company cannot be empty')
  ],
  validate,
  updateMyProfile
);

router.get('/:id', protect, authorize('admin'), getUserById);

module.exports = router;
