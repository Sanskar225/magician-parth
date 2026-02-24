const { Op } = require('sequelize');
const Service = require('../models/Service');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { validationResult } = require('express-validator');
const { processImage } = require('../utils/imageProcessor');

// Get all services
exports.getAllServices = catchAsync(async (req, res, next) => {
  const { isPopular, status, search, limit = 100 } = req.query;

  const where = { status: 'active' };
  
  if (isPopular === 'true') {
    where.isPopular = true;
  }
  
  if (status) {
    where.status = status;
  }
  
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { shortDescription: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const services = await Service.findAll({
    where,
    order: [
      ['order', 'ASC'],
      ['isPopular', 'DESC'],
      ['createdAt', 'DESC']
    ],
    limit: parseInt(limit)
  });

  res.status(200).json({
    status: 'success',
    results: services.length,
    data: {
      services
    }
  });
});

// Get single service by slug or id
exports.getService = catchAsync(async (req, res, next) => {
  const { identifier } = req.params;
  
  const where = {};
  
  if (identifier.includes('-') || identifier.length === 36) {
    where.id = identifier;
  } else {
    where.slug = identifier;
  }

  const service = await Service.findOne({ where });

  if (!service) {
    return next(new AppError('No service found with that ID or slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      service
    }
  });
});

// Create service (Admin only)
exports.createService = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const serviceData = { ...req.body };

  // Process images
  if (req.files) {
    if (req.files.image) {
      const processedImage = await processImage(req.files.image[0].path, {
        width: 800,
        height: 600,
        quality: 85
      });
      serviceData.image = processedImage;
    }
    
    if (req.files.icon) {
      const processedIcon = await processImage(req.files.icon[0].path, {
        width: 64,
        height: 64,
        quality: 90
      });
      serviceData.icon = processedIcon;
    }
    
    if (req.files.gallery) {
      const galleryPromises = req.files.gallery.map(file => 
        processImage(file.path, {
          width: 1200,
          height: 800,
          quality: 85
        })
      );
      serviceData.gallery = await Promise.all(galleryPromises);
    }
  }

  const service = await Service.create(serviceData);

  res.status(201).json({
    status: 'success',
    data: {
      service
    }
  });
});

// Update service (Admin only)
exports.updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByPk(req.params.id);

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  // Process new images if uploaded
  if (req.files) {
    if (req.files.image) {
      const processedImage = await processImage(req.files.image[0].path, {
        width: 800,
        height: 600,
        quality: 85
      });
      req.body.image = processedImage;
    }
    
    if (req.files.icon) {
      const processedIcon = await processImage(req.files.icon[0].path, {
        width: 64,
        height: 64,
        quality: 90
      });
      req.body.icon = processedIcon;
    }
  }

  await service.update(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      service
    }
  });
});

// Delete service (Admin only)
exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByPk(req.params.id);

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  await service.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});