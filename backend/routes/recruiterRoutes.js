const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getMyJobs, getDashboard } = require('../controllers/recruiterController');

const router = express.Router();

router.use(protect, authorize('recruiter', 'admin'));

router.get('/jobs', getMyJobs);
router.get('/dashboard', getDashboard);

module.exports = router;
