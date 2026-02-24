const { Op } = require('sequelize');
const Blog = require('../models/Blog');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { validationResult } = require('express-validator');
const { processImage } = require('../utils/imageProcessor');

// Get all blogs with pagination, filtering, and sorting
exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  const { category, tag, status, search, sortBy = 'createdAt', order = 'DESC' } = req.query;

  // Build where clause
  const where = {};
  
  if (status) {
    where.status = status;
  } else {
    // Only show published blogs to public
    where.status = 'published';
  }
  
  if (category) {
    where.category = category;
  }
  
  if (tag) {
    where.tags = { [Op.contains]: [tag] };
  }
  
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { content: { [Op.iLike]: `%${search}%` } },
      { excerpt: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Get blogs
  const { count, rows } = await Blog.findAndCountAll({
    where,
    order: [[sortBy, order]],
    limit,
    offset,
    attributes: { exclude: ['content'] } // Exclude content from listing
  });

  // Calculate pagination info
  const totalPages = Math.ceil(count / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.status(200).json({
    status: 'success',
    data: {
      blogs: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    }
  });
});

// Get single blog by slug or id
exports.getBlog = catchAsync(async (req, res, next) => {
  const { identifier } = req.params;
  
  const where = {};
  
  // Check if identifier is UUID or slug
  if (identifier.includes('-') || identifier.length === 36) {
    where.id = identifier;
  } else {
    where.slug = identifier;
  }

  // Only show published blogs to public unless admin
  if (!req.user || req.user.role !== 'admin') {
    where.status = 'published';
  }

  const blog = await Blog.findOne({ where });

  if (!blog) {
    return next(new AppError('No blog found with that ID or slug', 404));
  }

  // Increment view count
  await blog.increment('views');

  res.status(200).json({
    status: 'success',
    data: {
      blog
    }
  });
});

// Create blog (Admin only)
exports.createBlog = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const blogData = {
    ...req.body,
    author: req.user.name
  };

  // Process featured image if uploaded
  if (req.file) {
    const processedImage = await processImage(req.file.path, {
      width: 1200,
      height: 630,
      quality: 80
    });
    blogData.featuredImage = processedImage;
  }

  const blog = await Blog.create(blogData);

  res.status(201).json({
    status: 'success',
    data: {
      blog
    }
  });
});

// Update blog (Admin only)
exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) {
    return next(new AppError('No blog found with that ID', 404));
  }

  // Process new featured image if uploaded
  if (req.file) {
    const processedImage = await processImage(req.file.path, {
      width: 1200,
      height: 630,
      quality: 80
    });
    req.body.featuredImage = processedImage;
  }

  await blog.update(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      blog
    }
  });
});

// Delete blog (Admin only)
exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) {
    return next(new AppError('No blog found with that ID', 404));
  }

  await blog.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get blog categories
exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Blog.findAll({
    attributes: ['category'],
    group: ['category'],
    where: { status: 'published' }
  });

  res.status(200).json({
    status: 'success',
    data: {
      categories: categories.map(c => c.category)
    }
  });
});

// Get featured blogs
exports.getFeaturedBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.findAll({
    where: {
      isFeatured: true,
      status: 'published'
    },
    limit: 5,
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['content'] }
  });

  res.status(200).json({
    status: 'success',
    data: {
      blogs
    }
  });
});