/**
 * @fileoverview Enhanced Upload Middleware with Cloudinary Integration
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadAvatarImage, uploadProjectImage, uploadCompanyLogo, cleanupLocalFiles } = require('../config/cloudinary');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
const tempDir = path.join(uploadsDir, 'temp');

[uploadsDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '_' + uniqueSuffix + extension);
  }
});

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extension = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extension) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Base multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

// Upload configurations for different endpoints
const uploadConfigs = {
  personalInfo: upload.fields([
    { name: 'avatar', maxCount: 1 }
  ]),
  
  project: upload.fields([
    { name: 'projectImages', maxCount: 10 },
    { name: 'thumbnailImage', maxCount: 1 }
  ]),
  
  experience: upload.fields([
    { name: 'companyLogo', maxCount: 1 }
  ])
};

/**
 * Process uploaded files and upload to Cloudinary
 */
const processUploads = async (req, res, next) => {
  try {
    console.log('🚀 Processing uploads...');
    
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('ℹ️ No files to process');
      return next();
    }

    const uploadResults = {
      avatar: null,
      projectImages: [],
      thumbnailImage: null,
      companyLogo: null
    };

    const filesToCleanup = [];

    // Process avatar upload
    if (req.files.avatar && req.files.avatar[0]) {
      const avatarFile = req.files.avatar[0];
      filesToCleanup.push(avatarFile.path);
      
      console.log('👤 Uploading avatar to Cloudinary...');
      const result = await uploadAvatarImage(avatarFile.path, 'portfolio/avatars');
      
      uploadResults.avatar = {
        url: result.optimizedUrl,
        publicId: result.publicId,
        thumbnailUrl: result.thumbnailUrl,
        responsiveUrls: result.responsiveUrls,
        originalName: avatarFile.originalname
      };
      
      console.log('✅ Avatar uploaded successfully:', result.optimizedUrl);
    }

    // Process project images upload
    if (req.files.projectImages && req.files.projectImages.length > 0) {
      console.log(`🖼️ Uploading ${req.files.projectImages.length} project images to Cloudinary...`);
      
      for (const imageFile of req.files.projectImages) {
        filesToCleanup.push(imageFile.path);
        
        console.log('📸 Processing project image:', imageFile.originalname);
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
      const result = await uploadCompanyLogo(logoFile.path, 'portfolio/companies');
      
      uploadResults.companyLogo = {
        url: result.optimizedUrl,
        publicId: result.publicId,
        thumbnailUrl: result.thumbnailUrl,
        responsiveUrls: result.responsiveUrls,
        originalName: logoFile.originalname
      };
      
      console.log('✅ Company logo uploaded successfully:', result.optimizedUrl);
    }

    // Clean up temporary files
    cleanupLocalFiles(filesToCleanup);
    
    // Attach results to request for use in controllers
    req.uploadResults = uploadResults;
    
    console.log('✅ Upload processing completed successfully');
    next();

  } catch (error) {
    console.error('❌ Upload processing failed:', error);
    
    // Clean up any uploaded files on error
    if (req.files) {
      const allFiles = Object.values(req.files).flat();
      const filePaths = allFiles.map(file => file.path);
      cleanupLocalFiles(filePaths);
    }
    
    next(error);
  }
};

/**
 * Handle upload errors
 */
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.',
        error: 'FILE_TOO_LARGE'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded.',
        error: 'TOO_MANY_FILES'
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field in file upload.',
        error: 'UNEXPECTED_FIELD'
      });
    }
  }
  
  if (error.message && error.message.includes('Only image files are allowed')) {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed (jpeg, jpg, png, gif, webp).',
      error: 'INVALID_FILE_TYPE'
    });
  }
  
  console.error('Upload error:', error);
  res.status(500).json({
    success: false,
    message: 'File upload failed.',
    error: 'UPLOAD_FAILED'
  });
};

/**
 * Get file URL for serving uploaded files
 * @param {string} filename - File name
 * @param {string} type - File type (avatars, projects, companies)
 * @returns {string} File URL
 */
const getFileUrl = (filename, type = 'projects') => {
  return `/uploads/${type}/${filename}`;
};

/**
 * Delete old uploaded files
 * @param {Array<string>} filePaths - Array of file paths to delete
 */
const deleteOldFiles = (filePaths) => {
  if (!Array.isArray(filePaths)) {
    filePaths = [filePaths];
  }
  
  filePaths.forEach(filePath => {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log('🗑️ Deleted old file:', filePath);
      } catch (error) {
        console.error('❌ Failed to delete file:', filePath, error.message);
      }
    }
  });
};

module.exports = {
  uploadConfigs,
  processUploads,
  handleUploadError,
  getFileUrl,
  deleteOldFiles
};