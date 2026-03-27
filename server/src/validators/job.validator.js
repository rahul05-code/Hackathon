const { body } = require('express-validator');
const { SERVICE_TYPES } = require('../utils/constants');

const createJobValidator = [
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('serviceType').isIn(Object.values(SERVICE_TYPES)).withMessage('Invalid service type'),
  body('issueDescription').notEmpty().withMessage('Issue description is required'),
];

module.exports = {
  createJobValidator,
};
