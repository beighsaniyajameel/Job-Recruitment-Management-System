const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      unique: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    industry: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
