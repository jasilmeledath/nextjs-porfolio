/**
 * @fileoverview Cloudinary Configuration for Cloud Image Storage
 * @author jasilmeledath@gmail.com
 * @created 2025-08-05
 * @version 1.0.0
 */

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

/**
 * Configure Cloudinary with environment variables
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
  secure: true // Use HTTPS URLs
});

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local file path or buffer
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
const uploadImage = async (filePath, options = {}) => {
  try {
    const defaultOptions = {
      resource_type: 'auto',
      quality: 'auto:good',
      fetch_format: 'auto',
      crop: 'fill',
      gravity: 'auto',
      secure: true,
      ...options
    };

    const result = await cloudinary.uploader.upload(filePath, defaultOptions);
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image
 * @returns {Promise<Object>} Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result: result.result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Generate optimized image URL
 * @param {string} publicId - Public ID of the image
 * @param {Object} transformations - Image transformations
 * @returns {string} Optimized image URL
 */
const getOptimizedUrl = (publicId, transformations = {}) => {
  const defaultTransformations = {
    quality: 'auto:good',
    fetch_format: 'auto',
    ...transformations
  };

  return cloudinary.url(publicId, defaultTransformations);
};

/**
 * Get avatar optimized URL
 * @param {string} publicId - Public ID of the image
 * @param {number} size - Avatar size (default: 400)
 * @returns {string} Optimized avatar URL
 */
const getAvatarUrl = (publicId, size = 400) => {
  return getOptimizedUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'face:center',
    radius: 'max',
    quality: 'auto:good',
    fetch_format: 'auto'
  });
};

/**
 * Get project image optimized URL
 * @param {string} publicId - Public ID of the image
 * @param {Object} options - Size and crop options
 * @returns {string} Optimized project image URL
 */
const getProjectImageUrl = (publicId, options = {}) => {
  const { width = 800, height = 600, crop = 'fill' } = options;
  
  return getOptimizedUrl(publicId, {
    width,
    height,
    crop,
    gravity: 'auto',
    quality: 'auto:good',
    fetch_format: 'auto'
  });
};

/**
 * Generate responsive image URLs
 * @param {string} publicId - Public ID of the image
 * @param {Array} sizes - Array of sizes
 * @returns {Object} Object with different sized URLs
 */
const getResponsiveUrls = (publicId, sizes = [400, 800, 1200]) => {
  const urls = {};
  
  sizes.forEach(size => {
    urls[`w${size}`] = getOptimizedUrl(publicId, {
      width: size,
      quality: 'auto:good',
      fetch_format: 'auto'
    });
  });
  
  return urls;
};

/**
 * Upload and process avatar
 * @param {string} filePath - Local file path
 * @param {string} folderName - Cloudinary folder name
 * @returns {Promise<Object>} Upload result with optimized URLs
 */
const uploadAvatar = async (filePath, folderName = 'avatars') => {
  try {
    const result = await uploadImage(filePath, {
      folder: folderName,
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face:center',
      quality: 'auto:good'
    });

    return {
      ...result,
      avatarUrl: getAvatarUrl(result.publicId),
      thumbnailUrl: getAvatarUrl(result.publicId, 150)
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Upload and process project image
 * @param {string} filePath - Local file path
 * @param {string} folderName - Cloudinary folder name
 * @param {boolean} isThumbnail - Is this a thumbnail image
 * @returns {Promise<Object>} Upload result with optimized URLs
 */
const uploadProjectImage = async (filePath, folderName = 'projects', isThumbnail = false) => {
  try {
    const uploadOptions = {
      folder: folderName,
      quality: 'auto:good'
    };

    if (isThumbnail) {
      uploadOptions.width = 600;
      uploadOptions.height = 400;
      uploadOptions.crop = 'fill';
      uploadOptions.gravity = 'auto';
    }

    const result = await uploadImage(filePath, uploadOptions);

    return {
      ...result,
      optimizedUrl: getProjectImageUrl(result.publicId),
      thumbnailUrl: getProjectImageUrl(result.publicId, { width: 300, height: 200 }),
      responsiveUrls: getResponsiveUrls(result.publicId)
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Clean up local uploaded files
 * @param {Array} filePaths - Array of file paths to delete
 */
const cleanupLocalFiles = (filePaths) => {
  const fs = require('fs');
  
  filePaths.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ Cleaned up local file: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Failed to cleanup file ${filePath}:`, error);
    }
  });
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  getOptimizedUrl,
  getAvatarUrl,
  getProjectImageUrl,
  getResponsiveUrls,
  uploadAvatar,
  uploadProjectImage,
  cleanupLocalFiles
};
