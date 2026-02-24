const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const logger = require('./logger');

exports.processImage = async (filePath, options = {}) => {
  try {
    const {
      width = null,
      height = null,
      quality = 80,
      format = 'jpeg'
    } = options;

    const fileInfo = path.parse(filePath);
    const outputPath = path.join(
      fileInfo.dir,
      `${fileInfo.name}_processed${fileInfo.ext}`
    );

    let sharpInstance = sharp(filePath);

    // Resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'cover',
        position: 'center'
      });
    }

    // Set format and quality
    if (format === 'jpeg' || format === 'jpg') {
      sharpInstance = sharpInstance.jpeg({ quality });
    } else if (format === 'png') {
      sharpInstance = sharpInstance.png({ quality });
    } else if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality });
    }

    // Process and save
    await sharpInstance.toFile(outputPath);

    // Remove original file
    await fs.unlink(filePath);

    // Return relative path for database
    return outputPath.replace(/^.*?uploads[\\/]/, 'uploads/');
  } catch (error) {
    logger.error('Image processing error:', error);
    throw error;
  }
};

exports.processMultipleImages = async (files, options = {}) => {
  const processedImages = [];
  
  for (const file of files) {
    const processedPath = await exports.processImage(file.path, options);
    processedImages.push(processedPath);
  }
  
  return processedImages;
};