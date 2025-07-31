/**
 * @fileoverview File Upload Configuration using Multer
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ensure upload directories exist
const uploadDirs = [
  'uploads/avatars',
  'uploads/resumes',
  'uploads/projects',
  'uploads/company-logos'
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '../../', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    // Determine upload path based on fieldname
    switch (file.fieldname) {
      case 'avatar':
        uploadPath += 'avatars/';
        break;
      case 'resume':
        uploadPath += 'resumes/';
        break;
      case 'projectImages':
      case 'thumbnailImage':
        uploadPath += 'projects/';
        break;
      case 'companyLogo':
        uploadPath += 'company-logos/';
        break;
      default:
        uploadPath += 'misc/';
    }
    
    const fullPath = path.join(__dirname, '../../', uploadPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${file.fieldname}_${timestamp}_${uniqueId}${extension}`);
  }
});

// File filter for different file types
const fileFilter = (req, file, cb) => {
  // Define allowed file types for each field
  const allowedTypes = {
    avatar: /jpeg|jpg|png|gif|webp/,
    projectImages: /jpeg|jpg|png|gif|webp/,
    thumbnailImage: /jpeg|jpg|png|gif|webp/,
    companyLogo: /jpeg|jpg|png|gif|webp|svg/,
    resume: /pdf|doc|docx/
  };
  
  const fieldType = allowedTypes[file.fieldname];
  if (!fieldType) {
    return cb(new Error(`Unsupported field: ${file.fieldname}`), false);
  }
  
  const fileExtension = path.extname(file.originalname).toLowerCase().slice(1);
  
  if (fieldType.test(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: ${fieldType.source}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files per request
  }
});

// Different upload configurations for different endpoints
const uploadConfigs = {
  // Personal info uploads (avatar + resume)
  personalInfo: upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]),
  
  // Project uploads (multiple images + thumbnail)
  project: upload.fields([
    { name: 'projectImages', maxCount: 5 },
    { name: 'thumbnailImage', maxCount: 1 }
  ]),
  
  // Experience uploads (company logo)
  experience: upload.fields([
    { name: 'companyLogo', maxCount: 1 }
  ]),
  
  // Single file uploads
  single: (fieldName) => upload.single(fieldName),
  
  // Multiple files with same field name
  array: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount)
};

// Helper function to get file URL
const getFileUrl = (req, filename, folder = '') => {
  if (!filename) return null;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${folder ? folder + '/' : ''}${filename}`;
};

// Helper function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to delete old files when updating
const deleteOldFiles = (oldUrls, baseUploadPath) => {
  if (!oldUrls || !Array.isArray(oldUrls)) {
    oldUrls = [oldUrls];
  }
  
  oldUrls.forEach(url => {
    if (url) {
      // Extract filename from URL
      const filename = url.split('/').pop();
      const filePath = path.join(__dirname, '../../uploads', baseUploadPath, filename);
      deleteFile(filePath);
    }
  });
};

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 10MB.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: 'Too many files. Maximum is 10 files per request.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: 'Unexpected file field.'
        });
      default:
        return res.status(400).json({
          success: false,
          error: `Upload error: ${error.message}`
        });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  next(error);
};

module.exports = {
  upload,
  uploadConfigs,
  getFileUrl,
  deleteFile,
  deleteOldFiles,
  handleUploadError
};
