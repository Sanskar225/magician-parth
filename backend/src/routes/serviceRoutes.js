const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');
const serviceController = require('../controllers/serviceController');

// ===============================
// Validation Rules
// ===============================
const serviceValidation = [
  body('name')
    .notEmpty()
    .withMessage('Service name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters'),

  body('description')
    .notEmpty()
    .withMessage('Description is required'),

  body('shortDescription')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Short description must be less than 300 characters'),

  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number'),

  body('isPopular')
    .optional()
    .isBoolean()
    .withMessage('isPopular must be a boolean'),

  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),

  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Invalid status')
];

// ===============================
// Public Routes
// ===============================
router.get('/', serviceController.getAllServices);
router.get('/:identifier', serviceController.getService);

// ===============================
// Protected Routes (Admin Only)
// ===============================
router.use(protect, restrictTo('admin'));

// Create Service
router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
  ]),
  serviceValidation,
  serviceController.createService
);

// Update Service
router.patch(
  '/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
  ]),
  serviceValidation,
  serviceController.updateService
);

// Delete Service
router.delete('/:id', serviceController.deleteService);

module.exports = router;