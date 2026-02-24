const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');   // ✅ FIXED
const bannerController = require('../controllers/bannerController');

// ===============================
// Public Routes
// ===============================
router.get('/active', bannerController.getActiveBanners);

// ===============================
// Protected Routes (Admin Only)
// ===============================
router.use(protect, restrictTo('admin'));

// Create Banner
router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'mobileImage', maxCount: 1 }
  ]),
  bannerController.createBanner
);

// Update Banner
router.patch(
  '/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'mobileImage', maxCount: 1 }
  ]),
  bannerController.updateBanner
);

// Delete Banner
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;