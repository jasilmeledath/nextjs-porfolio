/**
 * @fileoverview Fix Production Image URLs - Replace localhost with placeholders
 * @author jasilmeledath@gmail.com
 * @created 2025-08-05
 * @version 1.0.0
 */

const mongoose = require('mongoose');
require('dotenv').config();

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
 * Fix personal info image URLs using direct collection access
 */
const fixPersonalInfoImages = async () => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('personal_info');
    
    const personalInfos = await collection.find({}).toArray();
    console.log('🔍 Found', personalInfos.length, 'personal info records in personal_info collection');
    
    for (const info of personalInfos) {
      console.log('📋 Processing personal info for:', info.name);
      console.log('   Current avatar:', info.avatar);
      console.log('   Current resume:', info.resumeUrl);
      
      let updateDoc = {};
      let hasUpdates = false;
      
      // Fix avatar URL
      if (info.avatar && info.avatar.includes('localhost')) {
        updateDoc.avatar = 'https://via.placeholder.com/400x400/2563eb/ffffff?text=JM';
        hasUpdates = true;
        console.log('🖼️ Will fix avatar for:', info.name);
      }
      
      // Fix resume URL  
      if (info.resumeUrl && info.resumeUrl.includes('localhost')) {
        updateDoc.resumeUrl = 'https://docs.google.com/document/d/1example/export?format=pdf';
        hasUpdates = true;
        console.log('📄 Will fix resume for:', info.name);
      }
      
      if (hasUpdates) {
        console.log('⚡ Updating with:', updateDoc);
        const result = await collection.updateOne({ _id: info._id }, { $set: updateDoc });
        console.log('✅ Update result:', result.modifiedCount, 'documents modified');
      } else {
        console.log('⏭️ No updates needed for:', info.name);
      }
    }
  } catch (error) {
    console.error('❌ Error fixing personal info images:', error);
    throw error;
  }
};

/**
 * Fix project image URLs using direct collection access
 */
const fixProjectImages = async () => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('projects');
    
    const projects = await collection.find({}).toArray();
    console.log('🔍 Found', projects.length, 'project records in projects collection');
    
    for (const project of projects) {
      console.log('📋 Processing project:', project.title);
      console.log('   Current thumbnail:', project.thumbnailImage);
      console.log('   Current images count:', project.images?.length || 0);
      
      let updateDoc = {};
      let hasUpdates = false;
      
      // Fix thumbnail image
      if (project.thumbnailImage && project.thumbnailImage.includes('localhost')) {
        updateDoc.thumbnailImage = `https://via.placeholder.com/600x400/059669/ffffff?text=${encodeURIComponent(project.title)}`;
        hasUpdates = true;
        console.log('🖼️ Will fix thumbnail for:', project.title);
      }
      
      // Fix project images array
      if (project.images && Array.isArray(project.images)) {
        const fixedImages = project.images.map((img, index) => {
          if (img.includes('localhost')) {
            return `https://via.placeholder.com/800x600/2563eb/ffffff?text=${encodeURIComponent(project.title)}+${index + 1}`;
          }
          return img;
        });
        
        const needsImageFix = project.images.some(img => img.includes('localhost'));
        if (needsImageFix) {
          updateDoc.images = fixedImages;
          hasUpdates = true;
          console.log('🖼️ Will fix', fixedImages.length, 'images for:', project.title);
        }
      }
      
      if (hasUpdates) {
        console.log('⚡ Updating project with:', JSON.stringify(updateDoc, null, 2));
        const result = await collection.updateOne({ _id: project._id }, { $set: updateDoc });
        console.log('✅ Update result:', result.modifiedCount, 'documents modified');
      } else {
        console.log('⏭️ No updates needed for project:', project.title);
      }
    }
  } catch (error) {
    console.error('❌ Error fixing project images:', error);
    throw error;
  }
};

/**
 * Main fix function
 */
const fixImageUrls = async () => {
  try {
    console.log('🔧 Starting image URL fixes...');
    
    await connectDB();
    
    // Fix all image URLs
    await fixPersonalInfoImages();
    await fixProjectImages();
    
    console.log('');
    console.log('🎉 Image URL fixes completed successfully!');
    console.log('📸 All localhost URLs have been replaced with placeholder images');
    console.log('🌐 Your production website should now display images correctly');
    
  } catch (error) {
    console.error('❌ Image URL fix failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run fixer
if (require.main === module) {
  fixImageUrls();
}

module.exports = { fixImageUrls };
