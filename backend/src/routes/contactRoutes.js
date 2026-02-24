const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, restrictTo } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');
const contactController = require('../controllers/contactController');

// Validation rules
const contactValidation = [
  body('name').notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('phone').optional().matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).withMessage('Please provide a valid phone number'),
  body('subject').notEmpty().withMessage('Subject is required').isLength({ min: 3, max: 200 }).withMessage('Subject must be between 3 and 200 characters'),
  body('message').notEmpty().withMessage('Message is required').isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
];

// Public routes
router.post('/', contactLimiter, contactValidation, contactController.submitContact);

// Protected routes (Admin only)
router.use(protect, restrictTo('admin'));

router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContact);
router.patch('/:id/status', contactController.updateContactStatus);
router.delete('/:id', contactController.deleteContact);

module.exports = router;