const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Job = require('../models/Job');

// @route  GET /api/jobs
// @desc   List jobs with optional filtering, search & pagination
//         Query params: location, jobType, experience, skill, search, page, limit
// @access Public
const getJobs = asyncHandler(async (req, res) => {
  const { location, jobType, experience, skill, search, page = 1, limit = 10 } = req.query;

  const filter = { isActive: true };
  if (location) filter.location = new RegExp(`^${location}$`, 'i');
  if (jobType) filter.jobType = jobType;
  if (experience) filter.experience = new RegExp(experience, 'i');
  if (skill) filter.skills = { $regex: new RegExp(`^${skill}$`, 'i') };
  if (search) {
    filter.$or = [
      { jobTitle: new RegExp(search, 'i') },
      { company: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') }
    ];
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Job.countDocuments(filter)
  ]);

  res.json({
    success: true,
    count: jobs.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    jobs
  });
});

// @route  GET /api/jobs/:id
// @desc   Get a single job by its Mongo _id or its jobId (e.g. JOB003)
// @access Public
const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { jobId: id };

  const job = await Job.findOne(query);
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }
  res.json({ success: true, job });
});

// @route  POST /api/jobs
// @access Private (recruiter, admin)
const createJob = asyncHandler(async (req, res) => {
  const payload = { ...req.body, postedBy: req.user._id };

  // Recruiters can only post under their own company
  if (req.user.role === 'recruiter') {
    payload.company = req.user.company;
  }

  const job = await Job.create(payload);
  res.status(201).json({ success: true, message: 'Job created', job });
});

// @route  PUT /api/jobs/:id
// @access Private (recruiter who owns the job, or admin)
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  if (req.user.role === 'recruiter' && job.company !== req.user.company) {
    throw new ApiError(403, 'You can only edit jobs posted under your own company.');
  }

  const disallowed = ['jobId', 'postedBy', '_id'];
  disallowed.forEach((field) => delete req.body[field]);

  Object.assign(job, req.body);
  await job.save();

  res.json({ success: true, message: 'Job updated', job });
});

// @route  DELETE /api/jobs/:id
// @access Private (recruiter who owns the job, or admin)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  if (req.user.role === 'recruiter' && job.company !== req.user.company) {
    throw new ApiError(403, 'You can only delete jobs posted under your own company.');
  }

  await job.deleteOne();
  res.json({ success: true, message: 'Job deleted' });
});

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };
