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

// Auto-generate a unique jobId
jobSchema.pre('validate', async function generateJobId(next) {
  if (this.jobId) return next();

  try {
    const Job = this.constructor;

    let nextNumber = await Job.countDocuments() + 1;
    let newJobId = `JOB${String(nextNumber).padStart(3, '0')}`;

    while (await Job.exists({ jobId: newJobId })) {
      nextNumber += 1;
      newJobId = `JOB${String(nextNumber).padStart(3, '0')}`;
    }

    this.jobId = newJobId;

    next();
  } catch (err) {
    next(err);
  }
});

jobSchema.index({ location: 1 });

module.exports = mongoose.model('Job', jobSchema);
