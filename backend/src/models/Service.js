const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const slugify = require('slugify');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 100]
    }
  },
  slug: {
    type: DataTypes.STRING,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortDescription: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING
  },
  image: {
    type: DataTypes.STRING
  },
  gallery: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  priceUnit: {
    type: DataTypes.STRING,
    defaultValue: 'hour'
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  features: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  faqs: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  order: {
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
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (service) => {
      service.slug = slugify(service.name, { lower: true, strict: true });
    },
    beforeUpdate: (service) => {
      if (service.changed('name')) {
        service.slug = slugify(service.name, { lower: true, strict: true });
      }
    }
  }
});

module.exports = Service;