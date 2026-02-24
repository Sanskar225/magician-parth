const { body, param, query } = require('express-validator');

exports.paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

exports.idValidation = [
  param('id').isUUID().withMessage('Invalid ID format')
];

exports.slugValidation = [
  param('slug').isString().withMessage('Invalid slug format')
];

exports.blogValidation = {
  create: [
    body('title').notEmpty().withMessage('Title is required').isLength({ min: 5, max: 200 }),
    body('content').notEmpty().withMessage('Content is required'),
    body('excerpt').optional().isLength({ max: 500 }),
    body('category').optional().isString(),
    body('tags').optional().isArray(),
    body('status').optional().isIn(['draft', 'published', 'archived'])
  ],
  update: [
    body('title').optional().isLength({ min: 5, max: 200 }),
    body('content').optional(),
    body('excerpt').optional().isLength({ max: 500 }),
    body('category').optional().isString(),
    body('tags').optional().isArray(),
    body('status').optional().isIn(['draft', 'published', 'archived'])
  ]
};

exports.serviceValidation = {
  create: [
    body('name').notEmpty().withMessage('Service name is required').isLength({ min: 3, max: 100 }),
    body('description').notEmpty().withMessage('Description is required'),
    body('shortDescription').optional().isLength({ max: 300 }),
    body('price').optional().isNumeric(),
    body('isPopular').optional().isBoolean(),
    body('features').optional().isArray(),
    body('status').optional().isIn(['active', 'inactive'])
  ]
};

exports.contactValidation = {
  create: [
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').optional().matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),
    body('subject').notEmpty().withMessage('Subject is required').isLength({ min: 3, max: 200 }),
    body('message').notEmpty().withMessage('Message is required').isLength({ min: 10 })
  ]
};

exports.authValidation = {
  register: [
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  login: [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ]
};