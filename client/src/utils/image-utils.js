/**
 * Utility functions for handling image URLs in both old and new Cloudinary formats
 */

/**
 * Extract URL from image object or return string directly
 * @param {Object|string} image - Image object or URL string
 * @returns {string} Image URL
 */
export const getImageUrl = (image) => {
  if (!image) return "/placeholder.svg";
  
  // Handle new Cloudinary format (object with url property)
  if (typeof image === 'object' && image.url) {
    return image.url;
  }
  
  // Handle old format (direct string URL)
  if (typeof image === 'string') {
    // Check if it's a broken Railway URL and replace with placeholder
    if (image.includes('railway.app/uploads/') || image.includes('herokuapp.com/uploads/')) {
      return "/placeholder.svg";
    }
    return image;
  }
  
  return "/placeholder.svg";
};

/**
 * Extract thumbnail URL from image object or return string directly
 * @param {Object|string} image - Image object or URL string
 * @returns {string} Thumbnail URL
 */
export const getThumbnailUrl = (image) => {
  if (!image) return "/placeholder.svg";
  
  // Handle new Cloudinary format (object with thumbnailUrl property)
  if (typeof image === 'object' && image.thumbnailUrl) {
    return image.thumbnailUrl;
  }
  
  // Handle new Cloudinary format (fallback to main url)
  if (typeof image === 'object' && image.url) {
    return image.url;
  }
  
  // Handle old format (direct string URL)
  if (typeof image === 'string') {
    // Check if it's a broken Railway URL and replace with placeholder
    if (image.includes('railway.app/uploads/') || image.includes('herokuapp.com/uploads/')) {
      return "/placeholder.svg";
    }
    return image;
  }
  
  return "/placeholder.svg";
};

/**
 * Extract all image URLs from project data
 * @param {Object} project - Project object
 * @returns {Array<string>} Array of image URLs
 */
export const getProjectImages = (project) => {
  if (!project) return ["/placeholder.svg"];
  
  const images = [];
  
  // Handle project.images array
  if (project.images && Array.isArray(project.images) && project.images.length > 0) {
    project.images.forEach(image => {
      const url = getImageUrl(image);
      if (url && url !== "/placeholder.svg") {
        images.push(url);
      }
    });
  }
  
  // Fallback to single image fields
  if (images.length === 0) {
    const singleImage = getImageUrl(project.image || project.thumbnailImage);
    if (singleImage && singleImage !== "/placeholder.svg") {
      images.push(singleImage);
    }
  }
  
  // Return placeholder if no images found
  return images.length > 0 ? images : ["/placeholder.svg"];
};

/**
 * Get the main display image for a project
 * @param {Object} project - Project object
 * @returns {string} Main image URL
 */
export const getProjectMainImage = (project) => {
  if (!project) return "/placeholder.svg";
  
  // Priority: thumbnailImage > first image in images array > image field
  if (project.thumbnailImage) {
    return getThumbnailUrl(project.thumbnailImage);
  }
  
  if (project.images && Array.isArray(project.images) && project.images.length > 0) {
    return getImageUrl(project.images[0]);
  }
  
  if (project.image) {
    return getImageUrl(project.image);
  }
  
  return "/placeholder.svg";
};

/**
 * Check if project has multiple images
 * @param {Object} project - Project object
 * @returns {boolean} True if project has multiple images
 */
export const hasMultipleImages = (project) => {
  if (!project) return false;
  
  const images = getProjectImages(project);
  return images.length > 1 && !(images.length === 1 && images[0] === "/placeholder.svg");
};
