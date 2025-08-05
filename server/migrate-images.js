/**
 * Migration script to update existing projects with broken image URLs
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./src/models/Project');

async function migrationOldProjectImages() {
  try {
    console.log('🔄 Starting project image migration...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('✅ Connected to database');
    
    // Find projects with old Railway URLs
    const projects = await Project.find({
      $or: [
        { 'images': { $regex: 'railway.app/uploads/' } },
        { 'thumbnailImage': { $regex: 'railway.app/uploads/' } }
      ]
    });
    
    console.log(`📊 Found ${projects.length} projects with old image URLs`);
    
    let updatedCount = 0;
    
    for (const project of projects) {
      console.log(`\n🔧 Processing project: ${project.title}`);
      
      let hasChanges = false;
      
      // Update images array
      if (project.images && Array.isArray(project.images)) {
        const oldImages = project.images.filter(img => 
          typeof img === 'string' && 
          (img.includes('railway.app/uploads/') || img.includes('herokuapp.com/uploads/'))
        );
        
        if (oldImages.length > 0) {
          console.log(`  🖼️ Removing ${oldImages.length} broken image URLs`);
          project.images = project.images.filter(img => 
            !(typeof img === 'string' && 
              (img.includes('railway.app/uploads/') || img.includes('herokuapp.com/uploads/')))
          );
          hasChanges = true;
        }
      }
      
      // Update thumbnail image
      if (project.thumbnailImage && 
          typeof project.thumbnailImage === 'string' &&
          (project.thumbnailImage.includes('railway.app/uploads/') || 
           project.thumbnailImage.includes('herokuapp.com/uploads/'))) {
        console.log('  🎯 Removing broken thumbnail URL');
        project.thumbnailImage = '/placeholder.svg';
        hasChanges = true;
      }
      
      if (hasChanges) {
        await project.save();
        updatedCount++;
        console.log(`  ✅ Updated project: ${project.title}`);
      } else {
        console.log(`  ℹ️ No changes needed for: ${project.title}`);
      }
    }
    
    console.log(`\n✅ Migration completed! Updated ${updatedCount} projects`);
    console.log('💡 You can now upload new images through the admin panel - they will be stored in Cloudinary');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrationOldProjectImages();
