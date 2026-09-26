const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      unique: true,
      trim: true
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      default: 'Full-time'
    },
    experience: {
      type: String,
      trim: true,
      default: 'Fresher'
    },
    skills: {
      type: [String],
      default: []
    },
    salary: {
      type: Number,
      min: 0
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Auto-generate a jobId like JOB013 if one wasn't supplied
jobSchema.pre('validate', async function generateJobId(next) {
  if (this.jobId) return next();
  try {
    const Job = this.constructor;
    const lastJob = await Job.findOne().sort({ createdAt: -1 });
    let nextNumber = 1;
    if (lastJob && lastJob.jobId && /^JOB(\d+)$/.test(lastJob.jobId)) {
      nextNumber = parseInt(lastJob.jobId.replace('JOB', ''), 10) + 1;
    } else {
      const count = await Job.countDocuments();
      nextNumber = count + 1;
    }
    this.jobId = `JOB${String(nextNumber).padStart(3, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

jobSchema.index({ location: 1 });

module.exports = mongoose.model('Job', jobSchema);
