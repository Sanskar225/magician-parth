const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');   // ✅ FIXED
const blogController = require('../controllers/blogController');

// ===============================
// Validation Rules
// ===============================
const blogValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),

  body('content')
    .notEmpty()
    .withMessage('Content is required'),

  body('category').optional(),

  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status')
];

// ===============================
// Public Routes
// ===============================
router.get('/', blogController.getAllBlogs);
router.get('/featured', blogController.getFeaturedBlogs);
router.get('/categories', blogController.getCategories);
router.get('/:identifier', blogController.getBlog);

// ===============================
// Protected Routes (Admin Only)
// ===============================
router.use(protect, restrictTo('admin'));

router.post(
  '/',
  upload.single('featuredImage'),   // ✅ now works
  blogValidation,
  blogController.createBlog
);

router.patch(
  '/:id',
  upload.single('featuredImage'),   // ✅ now works
  blogValidation,
  blogController.updateBlog
);

router.delete('/:id', blogController.deleteBlog);

module.exports = router;