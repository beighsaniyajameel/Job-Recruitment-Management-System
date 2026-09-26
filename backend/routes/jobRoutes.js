const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { getJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);

router.post(
  '/',
  protect,
  authorize('recruiter', 'admin'),
  [
    body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('jobType').optional().isIn(['Full-time', 'Part-time', 'Internship', 'Contract']),
    body('salary').optional().isNumeric().withMessage('Salary must be a number'),
    body('skills').optional().isArray().withMessage('Skills must be an array of strings'),
    body('company')
      .if((value, { req }) => req.user && req.user.role === 'admin')
      .trim()
      .notEmpty()
      .withMessage('Company is required when posting as admin')
  ],
  validate,
  createJob
);

router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
