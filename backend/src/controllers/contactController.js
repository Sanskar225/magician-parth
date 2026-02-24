const Contact = require('../models/Contact');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { validationResult } = require('express-validator');
const { sendContactEmail } = require('../services/emailService');

// Submit contact form
exports.submitContact = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const contactData = {
    ...req.body,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  };

  const contact = await Contact.create(contactData);

  // Send email notification (don't await to avoid blocking response)
  sendContactEmail(contactData).catch(err => {
    logger.error('Failed to send contact email:', err);
  });

  res.status(201).json({
    status: 'success',
    message: 'Thank you for contacting us. We will get back to you soon.',
    data: {
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    }
  });
});

// Get all contacts (Admin only)
exports.getAllContacts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  
  const { status, priority, search, startDate, endDate } = req.query;

  const where = {};
  
  if (status) where.status = status;
  if (priority) where.priority = priority;
  
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { subject: { [Op.iLike]: `%${search}%` } },
      { message: { [Op.iLike]: `%${search}%` } }
    ];
  }
  
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = new Date(startDate);
    if (endDate) where.createdAt[Op.lte] = new Date(endDate);
  }

  const { count, rows } = await Contact.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });

  res.status(200).json({
    status: 'success',
    data: {
      contacts: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    }
  });
});

// Get single contact (Admin only)
exports.getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByPk(req.params.id);

  if (!contact) {
    return next(new AppError('No contact found with that ID', 404));
  }

  // Mark as read if not already
  if (contact.status === 'new') {
    await contact.update({ status: 'read' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      contact
    }
  });
});

// Update contact status (Admin only)
exports.updateContactStatus = catchAsync(async (req, res, next) => {
  const { status, priority, notes } = req.body;
  
  const contact = await Contact.findByPk(req.params.id);

  if (!contact) {
    return next(new AppError('No contact found with that ID', 404));
  }

  await contact.update({
    status: status || contact.status,
    priority: priority || contact.priority,
    notes: notes || contact.notes,
    repliedAt: status === 'replied' ? new Date() : contact.repliedAt,
    repliedBy: status === 'replied' ? req.user.id : contact.repliedBy
  });

  res.status(200).json({
    status: 'success',
    data: {
      contact
    }
  });
});

// Delete contact (Admin only)
exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByPk(req.params.id);

  if (!contact) {
    return next(new AppError('No contact found with that ID', 404));
  }

  await contact.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});