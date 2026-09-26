const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Company = require('../models/Company');

// @route  GET /api/companies
// @access Public
const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort({ companyName: 1 });
  res.json({ success: true, count: companies.length, companies });
});

// @route  GET /api/companies/:id
// @access Public
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    throw new ApiError(404, 'Company not found');
  }
  res.json({ success: true, company });
});

// @route  POST /api/companies
// @access Private (admin)
const createCompany = asyncHandler(async (req, res) => {
  const company = await Company.create(req.body);
  res.status(201).json({ success: true, message: 'Company created', company });
});

module.exports = { getCompanies, getCompanyById, createCompany };
