module.exports = {
  // User roles
  USER_ROLES: {
    ADMIN: 'admin',
    EDITOR: 'editor',
    USER: 'user'
  },

  // Blog status
  BLOG_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
  },

  // Service status
  SERVICE_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
  },

  // Contact status
  CONTACT_STATUS: {
    NEW: 'new',
    READ: 'read',
    REPLIED: 'replied',
    ARCHIVED: 'archived'
  },

  // Contact priority
  CONTACT_PRIORITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  },

  // Banner positions
  BANNER_POSITIONS: {
    TOP: 'top',
    MIDDLE: 'middle',
    BOTTOM: 'bottom'
  },

  // Cache TTL (in seconds)
  CACHE_TTL: {
    SHORT: 300, // 5 minutes
    MEDIUM: 3600, // 1 hour
    LONG: 86400, // 24 hours
    VERY_LONG: 604800 // 1 week
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // File upload
  UPLOAD: {
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_FILES: 10
  },

  // Image dimensions
  IMAGE_SIZES: {
    BANNER: { width: 1920, height: 800 },
    BANNER_MOBILE: { width: 768, height: 600 },
    BLOG_FEATURED: { width: 1200, height: 630 },
    SERVICE_MAIN: { width: 800, height: 600 },
    SERVICE_ICON: { width: 64, height: 64 },
    THUMBNAIL: { width: 300, height: 200 }
  },

  // API endpoints
  API: {
    V1: '/api/v1',
    AUTH: '/auth',
    BLOGS: '/blogs',
    SERVICES: '/services',
    CONTACT: '/contact',
    BANNERS: '/banners'
  },

  // Error messages
  ERRORS: {
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    FORBIDDEN: 'You do not have permission to access this resource',
    VALIDATION_FAILED: 'Validation failed',
    DUPLICATE_ENTRY: 'Duplicate entry found',
    SERVER_ERROR: 'Internal server error'
  },

  // Success messages
  SUCCESS: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    CONTACT_SENT: 'Thank you for contacting us. We will get back to you soon.'
  }
};