/**
 * @fileoverview Enhanced File Upload Middleware with Cloudinary Integration
 * @author jasilmeledath@gmail.com
 * @created 2025-08-05
 * @version 2.0.0
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { uploadAvatar, uploadProjectImage, uploadImage, cleanupLocalFiles } = require('../config/cloudinary');

// Ensure upload directories exist for temporary storage
const uploadDirs = [
  'uploads/temp',
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

// Storage configuration for temporary files (before Cloudinary upload)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/temp/';
    
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

/**
 * Process uploaded files with Cloudinary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const processUploads = async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  const filesToCleanup = [];
  
  try {
    const uploadResults = {};

    // Process avatar upload
    if (req.files.avatar && req.files.avatar[0]) {
      const avatarFile = req.files.avatar[0];
      filesToCleanup.push(avatarFile.path);
      
      console.log('📸 Uploading avatar to Cloudinary...');
      const result = await uploadAvatar(avatarFile.path, 'portfolio/avatars');
      
      uploadResults.avatar = {
        url: result.avatarUrl,
        publicId: result.publicId,
        thumbnailUrl: result.thumbnailUrl,
        originalName: avatarFile.originalname
      };
      
      console.log('✅ Avatar uploaded successfully:', result.avatarUrl);
    }

    // Process project images upload
    if (req.files.projectImages && req.files.projectImages.length > 0) {
      console.log('🖼️ Uploading project images to Cloudinary...');
      uploadResults.projectImages = [];
      
      for (const imageFile of req.files.projectImages) {
        filesToCleanup.push(imageFile.path);
        
        const result = await uploadProjectImage(imageFile.path, 'portfolio/projects', false);
        uploadResults.projectImages.push({
          url: result.optimizedUrl,
          publicId: result.publicId,
          thumbnailUrl: result.thumbnailUrl,
          responsiveUrls: result.responsiveUrls,
          originalName: imageFile.originalname
        });
        
        console.log('✅ Project image uploaded:', result.optimizedUrl);
      }
    }

    // Process thumbnail image upload
    if (req.files.thumbnailImage && req.files.thumbnailImage[0]) {
      const thumbnailFile = req.files.thumbnailImage[0];
      filesToCleanup.push(thumbnailFile.path);
      
      console.log('🎯 Uploading thumbnail to Cloudinary...');
      const result = await uploadProjectImage(thumbnailFile.path, 'portfolio/projects', true);
      
      uploadResults.thumbnailImage = {
        url: result.optimizedUrl,
        publicId: result.publicId,
        thumbnailUrl: result.thumbnailUrl,
        responsiveUrls: result.responsiveUrls,
        originalName: thumbnailFile.originalname
      };
      
      console.log('✅ Thumbnail uploaded successfully:', result.optimizedUrl);
    }

    // Process company logo upload
    if (req.files.companyLogo && req.files.companyLogo[0]) {
      const logoFile = req.files.companyLogo[0];
      filesToCleanup.push(logoFile.path);
      
      console.log('🏢 Uploading company logo to Cloudinary...');
      const result = await uploadImage(logoFile.path, {
        folder: 'portfolio/company-logos',
        width: 200,
        height: 200,
        crop: 'fit',
        quality: 'auto:good'
      });
      
      uploadResults.companyLogo = {
        url: result.url,
        publicId: result.publicId,
        originalName: logoFile.originalname
      };
      
      console.log('✅ Company logo uploaded successfully:', result.url);
    }

    // Handle resume files (keep local for PDFs)
    if (req.files.resume && req.files.resume[0]) {
      const resumeFile = req.files.resume[0];
      
      // For resumes, we'll keep them local but move to proper directory
      const resumeDir = path.join(__dirname, '../../uploads/resumes');
      const newPath = path.join(resumeDir, resumeFile.filename);
      
      fs.renameSync(resumeFile.path, newPath);
      
      uploadResults.resume = {
        url: getFileUrl(req, resumeFile.filename, 'resumes'),
        filename: resumeFile.filename,
        originalName: resumeFile.originalname
      };
      
      console.log('✅ Resume saved locally:', uploadResults.resume.url);
    }

    // Attach upload results to request
    req.uploadResults = uploadResults;
    
    // Clean up temporary files
    cleanupLocalFiles(filesToCleanup);
    
    next();

  } catch (error) {
    console.error('❌ Upload processing error:', error);
    
    // Clean up temporary files on error
    cleanupLocalFiles(filesToCleanup);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to process file uploads',
      details: error.message
    });
  }
};

// Helper function to get file URL for local files (resumes)
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
    if (url && !url.includes('cloudinary.com')) {
      // Only delete local files, not Cloudinary URLs
      const filename = url.split('/').pop();
      const filePath = path.join(__dirname, '../../uploads', baseUploadPath, filename);
      deleteFile(filePath);
    }
  });
};

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  console.error('Upload error:', error);
  
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
  processUploads,
  getFileUrl,
  deleteFile,
  deleteOldFiles,
  handleUploadError
};
