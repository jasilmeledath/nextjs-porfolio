/**
 * @fileoverview Check Database Connection and Collections
 * @author jasilmeledath@gmail.com
 * @created 2025-08-05
 */

const mongoose = require('mongoose');
require('dotenv').config();

const checkDatabase = async () => {
  try {
    // Try with portfolioDB specified
    const mongoURI = 'mongodb+srv://jasilportfolio:NJLFhtm92M6JtO9K@jasilmeledathdev.qgs4xpj.mongodb.net/portfolioDB?retryWrites=true&w=majority&appName=jasilmeledathdev';
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas');
    console.log('🔗 Database name:', mongoose.connection.name);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Collections found:');
    collections.forEach(collection => {
      console.log('   -', collection.name);
    });
    
    // Check data counts using direct collection access
    const personalInfoCollection = mongoose.connection.db.collection('personal_info');
    const projectsCollection = mongoose.connection.db.collection('projects');
    const usersCollection = mongoose.connection.db.collection('users');
    
    const [personalInfoData, projectData, userCount] = await Promise.all([
      personalInfoCollection.find({}).toArray(),
      projectsCollection.find({}).toArray(),
      usersCollection.countDocuments()
    ]);
    
    console.log('📊 Data counts:');
    console.log('   👤 Users:', userCount);
    console.log('   📝 Personal Info:', personalInfoData.length);
    console.log('   📂 Projects:', projectData.length);
    
    // Get a sample personal info to check image URLs
    if (personalInfoData.length > 0) {
      const samplePersonal = personalInfoData[0];
      console.log('🖼️ Sample image URLs from personal_info:');
      console.log('   Avatar:', samplePersonal.avatar);
      console.log('   Resume:', samplePersonal.resumeUrl);
    }
    
    // Get a sample project to check image URLs
    if (projectData.length > 0) {
      const sampleProject = projectData[0];
      console.log('📸 Sample project images from projects:');
      console.log('   Thumbnail:', sampleProject.thumbnailImage);
      if (sampleProject.images && sampleProject.images.length > 0) {
        console.log('   First image:', sampleProject.images[0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
};

checkDatabase();
