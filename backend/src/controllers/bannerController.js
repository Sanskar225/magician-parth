const { Op } = require('sequelize');
const Banner = require('../models/Banner');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { processImage } = require('../utils/imageProcessor');

// Get active banners for a page
exports.getActiveBanners = catchAsync(async (req, res, next) => {
  const { page = 'home', position } = req.query;
  
  const where = {
    isActive: true,
    page,
    [Op.or]: [
      { startDate: null },
      { startDate: { [Op.lte]: new Date() } }
    ],
    [Op.or]: [
      { endDate: null },
      { endDate: { [Op.gte]: new Date() } }
    ]
  };

  if (position) {
    where.position = position;
  }

  const banners = await Banner.findAll({
    where,
    order: [['order', 'ASC']]
  });

  res.status(200).json({
    status: 'success',
    data: {
      banners
    }
  });
});

// Create banner (Admin only)
exports.createBanner = catchAsync(async (req, res, next) => {
  const bannerData = { ...req.body };

  // Process images
  if (req.files) {
    if (req.files.image) {
      const processedImage = await processImage(req.files.image[0].path, {
        width: 1920,
        height: 800,
        quality: 85
      });
      bannerData.image = processedImage;
    }
    
    if (req.files.mobileImage) {
      const processedMobileImage = await processImage(req.files.mobileImage[0].path, {
        width: 768,
        height: 600,
        quality: 85
      });
      bannerData.mobileImage = processedMobileImage;
    }
  }

  const banner = await Banner.create(bannerData);

  res.status(201).json({
    status: 'success',
    data: {
      banner
    }
  });
});

// Update banner (Admin only)
exports.updateBanner = catchAsync(async (req, res, next) => {
  const banner = await Banner.findByPk(req.params.id);

  if (!banner) {
    return next(new AppError('No banner found with that ID', 404));
  }

  // Process new images if uploaded
  if (req.files) {
    if (req.files.image) {
      const processedImage = await processImage(req.files.image[0].path, {
        width: 1920,
        height: 800,
        quality: 85
      });
      req.body.image = processedImage;
    }
    
    if (req.files.mobileImage) {
      const processedMobileImage = await processImage(req.files.mobileImage[0].path, {
        width: 768,
        height: 600,
        quality: 85
      });
      req.body.mobileImage = processedMobileImage;
    }
  }

  await banner.update(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      banner
    }
  });
});

// Delete banner (Admin only)
exports.deleteBanner = catchAsync(async (req, res, next) => {
  const banner = await Banner.findByPk(req.params.id);

  if (!banner) {
    return next(new AppError('No banner found with that ID', 404));
  }

  await banner.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});