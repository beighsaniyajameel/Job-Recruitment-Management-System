const mongoose = require('mongoose');

const STATUS_VALUES = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      unique: true,
      trim: true
    },
    jobId: {
      type: String,
      required: [true, 'jobId is required']
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    applicantEmail: {
      type: String,
      required: [true, 'Applicant email is required'],
      lowercase: true,
      trim: true
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    applicationDate: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10)
    },
    status: {
      type: String,
      enum: STATUS_VALUES,
      default: 'Applied'
    }
  },
  { timestamps: true }
);

// Prevent the same person applying to the same job twice
applicationSchema.index({ jobId: 1, applicantEmail: 1 }, { unique: true });

applicationSchema.pre('validate', async function generateApplicationId(next) {
  if (this.applicationId) return next();
  try {
    const Application = this.constructor;
    const count = await Application.countDocuments();
    this.applicationId = `APP${String(count + 1).padStart(3, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Application', applicationSchema);
module.exports.STATUS_VALUES = STATUS_VALUES;
