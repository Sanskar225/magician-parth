const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobileImage: {
    type: DataTypes.STRING
  },
  buttonText: {
    type: DataTypes.STRING
  },
  buttonLink: {
    type: DataTypes.STRING
  },
  button2Text: {
    type: DataTypes.STRING
  },
  button2Link: {
    type: DataTypes.STRING
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  page: {
    type: DataTypes.STRING,
    defaultValue: 'home'
  },
  position: {
    type: DataTypes.STRING,
    defaultValue: 'top'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  startDate: {
    type: DataTypes.DATE
  },
  endDate: {
    type: DataTypes.DATE
  },
  backgroundColor: {
    type: DataTypes.STRING
  },
  textColor: {
    type: DataTypes.STRING
  },
  animation: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = Banner;