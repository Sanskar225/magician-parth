const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const slugify = require('slugify');

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 200]
    }
  },
  slug: {
    type: DataTypes.STRING,
    unique: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  excerpt: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  featuredImage: {
    type: DataTypes.STRING
  },
  author: {
    type: DataTypes.STRING,
    defaultValue: 'Admin'
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'General'
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  publishedAt: {
    type: DataTypes.DATE
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metaTitle: {
    type: DataTypes.STRING(60)
  },
  metaDescription: {
    type: DataTypes.STRING(160)
  },
  metaKeywords: {
    type: DataTypes.STRING
  },
  readingTime: {
    type: DataTypes.INTEGER
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (blog) => {
      blog.slug = slugify(blog.title, { lower: true, strict: true });
      blog.publishedAt = blog.status === 'published' ? new Date() : null;
      blog.readingTime = Math.ceil(blog.content.split(' ').length / 200);
    },
    beforeUpdate: (blog) => {
      if (blog.changed('title')) {
        blog.slug = slugify(blog.title, { lower: true, strict: true });
      }
      if (blog.changed('status') && blog.status === 'published' && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
      if (blog.changed('content')) {
        blog.readingTime = Math.ceil(blog.content.split(' ').length / 200);
      }
    }
  }
});

module.exports = Blog;