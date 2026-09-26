const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { getCompanies, getCompanyById, createCompany } = require('../controllers/companyController');

const router = express.Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);

router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('companyName').trim().notEmpty().withMessage('Company name is required'),
    body('location').trim().notEmpty().withMessage('Location is required')
  ],
  validate,
  createCompany
);

module.exports = router;
