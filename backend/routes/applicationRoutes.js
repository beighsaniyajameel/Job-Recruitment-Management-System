const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
  getApplicationStats
} = require('../controllers/applicationController');

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('job_seeker'),
  [body('jobId').trim().notEmpty().withMessage('jobId is required')],
  validate,
  applyToJob
);

router.get('/me', protect, authorize('job_seeker'), getMyApplications);

router.get('/stats', protect, authorize('recruiter', 'admin'), getApplicationStats);

router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getApplicationsForJob);

router.put(
  '/:id/status',
  protect,
  authorize('recruiter', 'admin'),
  [
    body('status')
      .isIn(['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'])
      .withMessage('Status must be one of Applied, Shortlisted, Interview, Selected, Rejected')
  ],
  validate,
  updateApplicationStatus
);

module.exports = router;
