/**
 * @fileoverview Cloudinary Configuration and Helper Functions
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary with optimizations
 * @param {string} filePath - Local file path
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
const uploadImage = async (filePath, options = {}) => {
  try {
    const defaultOptions = {
      resource_type: 'image',
      quality: 'auto:good',
      fetch_format: 'auto',
      secure: true
    };

    const uploadOptions = { ...defaultOptions, ...options };
    
    console.log('📤 Uploading to Cloudinary:', filePath);
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    
    console.log('✅ Upload successful:', result.secure_url);
    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resourceType: result.resource_type,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    if (!publicId) {
      console.warn('⚠️ No public ID provided for deletion');
      return { result: 'not found' };
    }

    console.log('🗑️ Deleting from Cloudinary:', publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      console.log('✅ Image deleted successfully:', publicId);
    } else {
      console.warn('⚠️ Image deletion result:', result.result, 'for', publicId);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Cloudinary deletion failed:', error);
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

/**
 * Get optimized avatar image URL
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} Optimized URL
 */
const getAvatarImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    width: 200,
    height: 200,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto:good',
    fetch_format: 'auto'
  };

  const transformOptions = { ...defaultOptions, ...options };
  
  return cloudinary.url(publicId, transformOptions);
};

/**
 * Get optimized project image URL
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} Optimized URL
 */
const getProjectImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: 'auto:good',
    fetch_format: 'auto'
  };

  const transformOptions = { ...defaultOptions, ...options };
  
  return cloudinary.url(publicId, transformOptions);
};

/**
 * Get responsive image URLs for different screen sizes
 * @param {string} publicId - Cloudinary public ID
 * @returns {Object} Responsive URLs
 */
const getResponsiveUrls = (publicId) => {
  return {
    small: getProjectImageUrl(publicId, { width: 400, height: 300, crop: 'fill' }),
    medium: getProjectImageUrl(publicId, { width: 800, height: 600, crop: 'fill' }),
    large: getProjectImageUrl(publicId, { width: 1200, height: 900, crop: 'fill' }),
    xlarge: getProjectImageUrl(publicId, { width: 1600, height: 1200, crop: 'fill' })
  };
};

/**
 * Upload avatar image with specific optimizations
 * @param {string} filePath - Local file path
 * @param {string} folderName - Cloudinary folder name
 * @returns {Promise<Object>} Upload result with optimized URLs
 */
const uploadAvatarImage = async (filePath, folderName = 'avatars') => {
  try {
    const uploadOptions = {
      folder: folderName,
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto:good'
    };

    const result = await uploadImage(filePath, uploadOptions);

    return {
      ...result,
      optimizedUrl: getAvatarImageUrl(result.publicId),
      thumbnailUrl: getAvatarImageUrl(result.publicId, { width: 100, height: 100 }),
      responsiveUrls: {
        small: getAvatarImageUrl(result.publicId, { width: 100, height: 100 }),
        medium: getAvatarImageUrl(result.publicId, { width: 200, height: 200 }),
        large: getAvatarImageUrl(result.publicId, { width: 400, height: 400 })
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Upload project image with specific optimizations
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
 * Upload company logo with specific optimizations
 * @param {string} filePath - Local file path
 * @param {string} folderName - Cloudinary folder name
 * @returns {Promise<Object>} Upload result with optimized URLs
 */
const uploadCompanyLogo = async (filePath, folderName = 'companies') => {
  try {
    const uploadOptions = {
      folder: folderName,
      width: 200,
      height: 200,
      crop: 'fit',
      background: 'transparent',
      quality: 'auto:good'
    };

    const result = await uploadImage(filePath, uploadOptions);

    return {
      ...result,
      optimizedUrl: getProjectImageUrl(result.publicId),
      thumbnailUrl: getProjectImageUrl(result.publicId, { width: 100, height: 100 }),
      responsiveUrls: {
        small: getProjectImageUrl(result.publicId, { width: 50, height: 50 }),
        medium: getProjectImageUrl(result.publicId, { width: 100, height: 100 }),
        large: getProjectImageUrl(result.publicId, { width: 200, height: 200 })
      }
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
  if (!Array.isArray(filePaths)) {
    filePaths = [filePaths];
  }

  filePaths.forEach(filePath => {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log('🧹 Cleaned up local file:', filePath);
      } catch (error) {
        console.error('❌ Failed to cleanup local file:', filePath, error.message);
      }
    }
  });
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  getAvatarImageUrl,
  getProjectImageUrl,
  getResponsiveUrls,
  uploadAvatarImage,
  uploadProjectImage,
  uploadCompanyLogo,
  cleanupLocalFiles
};