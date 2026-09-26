const asyncHandler = require('../utils/asyncHandler');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @route  GET /api/recruiter/jobs
// @desc   All jobs posted under the logged-in recruiter's company
// @access Private (recruiter)
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ company: req.user.company }).sort({ createdAt: -1 });
  res.json({ success: true, count: jobs.length, jobs });
});

// @route  GET /api/recruiter/dashboard
// @desc   Summary stats for the recruiter's company: job count,
//         total applicants, and applicants broken down by status
// @access Private (recruiter)
const getDashboard = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ company: req.user.company }).select('jobId jobTitle');
  const jobIds = jobs.map((j) => j.jobId);

  const [totalApplications, statusBreakdown] = await Promise.all([
    Application.countDocuments({ jobId: { $in: jobIds } }),
    Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  res.json({
    success: true,
    company: req.user.company,
    totalJobs: jobs.length,
    totalApplications,
    statusBreakdown
  });
});

module.exports = { getMyJobs, getDashboard };
