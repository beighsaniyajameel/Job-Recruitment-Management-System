const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Application = require('../models/Application');
const Job = require('../models/Job');

// @route  POST /api/applications
// @desc   Job seeker applies to a job
// @access Private (job_seeker)
const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  const query = /^[0-9a-fA-F]{24}$/.test(jobId) ? { _id: jobId } : { jobId };
  const job = await Job.findOne(query);
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  const existing = await Application.findOne({ jobId: job.jobId, applicantEmail: req.user.email });
  if (existing) {
    throw new ApiError(409, 'You have already applied to this job.');
  }

  const application = await Application.create({
    jobId: job.jobId,
    job: job._id,
    applicantEmail: req.user.email,
    applicant: req.user._id
  });

  res.status(201).json({ success: true, message: 'Application submitted', application });
});

// @route  GET /api/applications/me
// @desc   Job seeker views their own applications
// @access Private (job_seeker)
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicantEmail: req.user.email }).sort({ createdAt: -1 });

  // Attach job details for convenience
  const jobIds = applications.map((a) => a.jobId);
  const jobs = await Job.find({ jobId: { $in: jobIds } });
  const jobMap = new Map(jobs.map((j) => [j.jobId, j]));

  const enriched = applications.map((a) => ({
    ...a.toObject(),
    jobDetails: jobMap.get(a.jobId) || null
  }));

  res.json({ success: true, count: enriched.length, applications: enriched });
});

// @route  GET /api/applications/job/:jobId
// @desc   Recruiter views all applicants for one of their jobs
// @access Private (recruiter who owns the job, or admin)
const getApplicationsForJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ jobId: req.params.jobId });
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  if (req.user.role === 'recruiter' && job.company !== req.user.company) {
    throw new ApiError(403, 'You can only view applicants for your own company\'s jobs.');
  }

  const applications = await Application.find({ jobId: job.jobId }).sort({ createdAt: -1 });
  res.json({ success: true, count: applications.length, applications });
});

// @route  PUT /api/applications/:id/status
// @desc   Recruiter updates an applicant's status
// @access Private (recruiter who owns the job, or admin)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const application = await Application.findById(req.params.id);
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  const job = await Job.findOne({ jobId: application.jobId });
  if (req.user.role === 'recruiter' && job && job.company !== req.user.company) {
    throw new ApiError(403, 'You can only manage applications for your own company\'s jobs.');
  }

  application.status = status;
  await application.save();

  res.json({ success: true, message: 'Application status updated', application });
});

// @route  GET /api/applications/stats
// @desc   Count of applications grouped by status (uses the same
//         aggregation documented in database_setup.md)
// @access Private (recruiter, admin)
const getApplicationStats = asyncHandler(async (req, res) => {
  let matchStage = {};

  if (req.user.role === 'recruiter') {
    const companyJobs = await Job.find({ company: req.user.company }).select('jobId');
    matchStage = { jobId: { $in: companyJobs.map((j) => j.jobId) } };
  }

  const stats = await Application.aggregate([
    { $match: matchStage },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  res.json({ success: true, stats });
});

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
  getApplicationStats
};
