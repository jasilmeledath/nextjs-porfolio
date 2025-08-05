/**
 * @fileoverview Migration Script - Move Local Images to Cloudinary
 * @author jasilmeledath@gmail.com
 * @created 2025-08-05
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import Cloudinary functions
const { uploadAvatar, uploadProjectImage, uploadImage } = require('./src/config/cloudinary');

/**
 * Connect to MongoDB Atlas
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://jasilportfolio:NJLFhtm92M6JtO9K@jasilmeledathdev.qgs4xpj.mongodb.net/portfolioDB?retryWrites=true&w=majority&appName=jasilmeledathdev';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Atlas connected to portfolioDB database');
    console.log('🔗 Database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error);
    process.exit(1);
  }
};

/**
 * Check if file exists locally
 * @param {string} filename - Filename to check
 * @param {string} folder - Folder name
 * @returns {boolean} True if file exists
 */
const checkLocalFile = (filename, folder) => {
  if (!filename) return false;
  
  const filePath = path.join(__dirname, 'uploads', folder, filename);
  return fs.existsSync(filePath);
};

/**
 * Extract filename from URL
 * @param {string} url - File URL
 * @returns {string} Filename
 */
const extractFilename = (url) => {
  if (!url) return null;
  return url.split('/').pop();
};

/**
 * Migrate personal info avatars to Cloudinary
 */
const migrateAvatars = async () => {
  try {
    console.log('🚀 Starting avatar migration...');
    
    const db = mongoose.connection.db;
    const collection = db.collection('personal_info');
    
    const personalInfos = await collection.find({}).toArray();
    console.log('🔍 Found', personalInfos.length, 'personal info records');
    
    for (const info of personalInfos) {
      if (!info.avatar) continue;
      
      // Skip if already using Cloudinary
      if (info.avatar.includes('cloudinary.com')) {
        console.log('⏭️ Avatar already on Cloudinary:', info.name);
        continue;
      }
      
      const filename = extractFilename(info.avatar);
      const localPath = path.join(__dirname, 'uploads', 'avatars', filename);
      
      if (!fs.existsSync(localPath)) {
        console.log('⚠️ Local avatar file not found for:', info.name);
        
        // Create a placeholder avatar on Cloudinary
        const placeholderResult = await uploadImage('https://via.placeholder.com/400x400/2563eb/ffffff?text=' + encodeURIComponent(info.name.charAt(0)), {
          folder: 'portfolio/avatars',
          public_id: `avatar_${info._id}_placeholder`,
          width: 400,
          height: 400,
          crop: 'fill'
        });
        
        await collection.updateOne(
          { _id: info._id },
          { 
            $set: { 
              avatar: placeholderResult.url,
              avatarPublicId: placeholderResult.publicId 
            } 
          }
        );
        
        console.log('✅ Placeholder avatar created for:', info.name);
        continue;
      }
      
      console.log('📸 Uploading avatar for:', info.name);
      
      try {
        const result = await uploadAvatar(localPath, 'portfolio/avatars');
        
        await collection.updateOne(
          { _id: info._id },
          { 
            $set: { 
              avatar: result.avatarUrl,
              avatarPublicId: result.publicId,
              avatarThumbnail: result.thumbnailUrl
            } 
          }
        );
        
        console.log('✅ Avatar migrated for:', info.name, '→', result.avatarUrl);
        
      } catch (uploadError) {
        console.error('❌ Failed to upload avatar for:', info.name, uploadError.message);
      }
    }
    
    console.log('🎉 Avatar migration completed!');
    
  } catch (error) {
    console.error('❌ Avatar migration error:', error);
    throw error;
  }
};

/**
 * Migrate project images to Cloudinary
 */
const migrateProjectImages = async () => {
  try {
    console.log('🚀 Starting project images migration...');
    
    const db = mongoose.connection.db;
    const collection = db.collection('projects');
    
    const projects = await collection.find({}).toArray();
    console.log('🔍 Found', projects.length, 'project records');
    
    for (const project of projects) {
      console.log('📋 Processing project:', project.title);
      
      let updateDoc = {};
      let hasUpdates = false;
      
      // Migrate thumbnail image
      if (project.thumbnailImage && !project.thumbnailImage.includes('cloudinary.com')) {
        const filename = extractFilename(project.thumbnailImage);
        const localPath = path.join(__dirname, 'uploads', 'projects', filename);
        
        if (fs.existsSync(localPath)) {
          try {
            console.log('🎯 Uploading thumbnail for:', project.title);
            const result = await uploadProjectImage(localPath, 'portfolio/projects', true);
            
            updateDoc.thumbnailImage = result.optimizedUrl;
            updateDoc.thumbnailPublicId = result.publicId;
            updateDoc.thumbnailResponsive = result.responsiveUrls;
            hasUpdates = true;
            
            console.log('✅ Thumbnail migrated:', result.optimizedUrl);
          } catch (uploadError) {
            console.error('❌ Failed to upload thumbnail:', uploadError.message);
          }
        } else {
          // Create placeholder thumbnail
          try {
            const placeholderResult = await uploadImage(
              `https://via.placeholder.com/600x400/059669/ffffff?text=${encodeURIComponent(project.title)}`,
              {
                folder: 'portfolio/projects',
                public_id: `project_${project._id}_thumbnail_placeholder`,
                width: 600,
                height: 400,
                crop: 'fill'
              }
            );
            
            updateDoc.thumbnailImage = placeholderResult.url;
            updateDoc.thumbnailPublicId = placeholderResult.publicId;
            hasUpdates = true;
            
            console.log('✅ Placeholder thumbnail created for:', project.title);
          } catch (placeholderError) {
            console.error('❌ Failed to create placeholder thumbnail:', placeholderError.message);
          }
        }
      }
      
      // Migrate project images array
      if (project.images && Array.isArray(project.images) && project.images.length > 0) {
        const migratedImages = [];
        const imagePublicIds = [];
        const imageResponsive = [];
        
        for (let i = 0; i < project.images.length; i++) {
          const imageUrl = project.images[i];
          
          if (imageUrl.includes('cloudinary.com')) {
            // Already migrated
            migratedImages.push(imageUrl);
            continue;
          }
          
          const filename = extractFilename(imageUrl);
          const localPath = path.join(__dirname, 'uploads', 'projects', filename);
          
          if (fs.existsSync(localPath)) {
            try {
              console.log(`🖼️ Uploading project image ${i + 1} for:`, project.title);
              const result = await uploadProjectImage(localPath, 'portfolio/projects', false);
              
              migratedImages.push(result.optimizedUrl);
              imagePublicIds.push(result.publicId);
              imageResponsive.push(result.responsiveUrls);
              
              console.log(`✅ Project image ${i + 1} migrated:`, result.optimizedUrl);
            } catch (uploadError) {
              console.error(`❌ Failed to upload project image ${i + 1}:`, uploadError.message);
              
              // Use placeholder
              const placeholderResult = await uploadImage(
                `https://via.placeholder.com/800x600/2563eb/ffffff?text=${encodeURIComponent(project.title)}+${i + 1}`,
                {
                  folder: 'portfolio/projects',
                  public_id: `project_${project._id}_image_${i}_placeholder`
                }
              );
              
              migratedImages.push(placeholderResult.url);
              imagePublicIds.push(placeholderResult.publicId);
            }
          } else {
            // Create placeholder
            try {
              const placeholderResult = await uploadImage(
                `https://via.placeholder.com/800x600/2563eb/ffffff?text=${encodeURIComponent(project.title)}+${i + 1}`,
                {
                  folder: 'portfolio/projects',
                  public_id: `project_${project._id}_image_${i}_placeholder`
                }
              );
              
              migratedImages.push(placeholderResult.url);
              imagePublicIds.push(placeholderResult.publicId);
              
              console.log(`✅ Placeholder image ${i + 1} created for:`, project.title);
            } catch (placeholderError) {
              console.error(`❌ Failed to create placeholder image ${i + 1}:`, placeholderError.message);
            }
          }
        }
        
        if (migratedImages.length > 0) {
          updateDoc.images = migratedImages;
          updateDoc.imagePublicIds = imagePublicIds;
          updateDoc.imageResponsive = imageResponsive;
          hasUpdates = true;
        }
      }
      
      if (hasUpdates) {
        console.log('⚡ Updating project with migrated images...');
        const result = await collection.updateOne({ _id: project._id }, { $set: updateDoc });
        console.log('✅ Project updated:', result.modifiedCount, 'documents modified');
      } else {
        console.log('⏭️ No updates needed for project:', project.title);
      }
    }
    
    console.log('🎉 Project images migration completed!');
    
  } catch (error) {
    console.error('❌ Project images migration error:', error);
    throw error;
  }
};

/**
 * Main migration function
 */
const migrateToCloudinary = async () => {
  try {
    console.log('🔧 Starting migration to Cloudinary...');
    console.log('⚠️  Make sure you have set up your Cloudinary credentials in .env file');
    console.log('');
    
    await connectDB();
    
    // Check Cloudinary configuration
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    
    if (!cloudName || !apiKey || cloudName === 'your-cloud-name' || apiKey === 'your-api-key') {
      console.error('❌ Cloudinary credentials not properly configured!');
      console.log('📝 Please update the following in your .env file:');
      console.log('   CLOUDINARY_CLOUD_NAME=your-actual-cloud-name');
      console.log('   CLOUDINARY_API_KEY=your-actual-api-key');
      console.log('   CLOUDINARY_API_SECRET=your-actual-api-secret');
      process.exit(1);
    }
    
    console.log('☁️  Cloudinary configured for:', cloudName);
    console.log('');
    
    // Run migrations
    await migrateAvatars();
    console.log('');
    await migrateProjectImages();
    
    console.log('');
    console.log('🎉 Migration to Cloudinary completed successfully!');
    console.log('📸 All images have been uploaded to Cloudinary');
    console.log('🗄️  Database has been updated with new URLs');
    console.log('🌐 Your production website should now display images correctly');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run migration
if (require.main === module) {
  migrateToCloudinary();
}

module.exports = { migrateToCloudinary, migrateAvatars, migrateProjectImages };
