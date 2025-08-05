/**
 * @fileoverview Complete Portfolio Data Seeder for Production
 * @author jasilmeledath@gmail.com
 * @created 2025-08-05
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const User = require('./src/models/User');
const PersonalInfo = require('./src/models/PersonalInfo');
const SocialLink = require('./src/models/SocialLink');
const Skill = require('./src/models/Skill');
const Project = require('./src/models/Project');
const Experience = require('./src/models/Experience');
require('dotenv').config();

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://jasilportfolio:NJLFhtm92M6JtO9K@jasilmeledathdev.qgs4xpj.mongodb.net/portfolioDB?retryWrites=true&w=majority&appName=jasilmeledathdev';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Atlas connected to portfolioDB database');
    console.log('🔗 Database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error);
    process.exit(1);
  }
};

/**
 * Create admin user
 */
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      return existingAdmin;
    }

    const adminData = {
      email: process.env.ADMIN_EMAIL || 'jasil@jasilmeledath.dev',
      password: process.env.ADMIN_PASSWORD || 'Admin123!@#',
      firstName: process.env.ADMIN_FIRST_NAME || 'Jasil',
      lastName: process.env.ADMIN_LAST_NAME || 'Meledath',
      role: 'admin',
      isActive: true,
      permissions: [
        'portfolio:read', 'portfolio:write', 'blog:read', 'blog:write', 
        'blog:delete', 'comments:moderate', 'media:upload', 'media:delete',
        'analytics:view', 'settings:manage', 'users:manage'
      ]
    };

    const adminUser = new User(adminData);
    await adminUser.save();
    console.log('✅ Admin user created:', adminUser.email);
    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
};

/**
 * Create personal info
 */
const createPersonalInfo = async (userId) => {
  try {
    const existing = await PersonalInfo.findOne({ userId: userId.toString() });
    if (existing) {
      console.log('✅ Personal info already exists for user:', existing.firstName, existing.lastName);
      console.log('   📧 Email:', existing.email);
      console.log('   🔗 Website:', existing.website);
      return existing;
    }

    console.log('🆕 Creating new personal info...');
    const personalData = {
      userId: userId.toString(),
      firstName: 'Jasil',
      lastName: 'Meledath',
      email: 'jasil@jasilmeledath.dev',
      phone: '+1234567890',
      title: 'Full Stack Developer',
      bio: 'Passionate full-stack developer with expertise in modern web technologies. I create scalable, user-friendly applications that solve real-world problems.',
      location: 'Your Location',
      website: 'https://jasilmeledath.dev',
      avatar: 'https://via.placeholder.com/400x400/2563eb/ffffff?text=JM',
      resume: 'https://docs.google.com/document/d/1example/export?format=pdf',
      isActive: true
    };

    const newPersonalInfo = await PersonalInfo.create(personalData);
    console.log('✅ Personal info created successfully');
    return newPersonalInfo;
  } catch (error) {
    console.error('❌ Error creating personal info:', error);
    throw error;
  }
};

/**
 * Create social links
 */
const createSocialLinks = async (userId) => {
  try {
    const existingCount = await SocialLink.countDocuments({ userId: userId.toString() });
    if (existingCount > 0) {
      console.log('✅ Social links already exist (', existingCount, 'links found)');
      const existing = await SocialLink.find({ userId: userId.toString() }).select('platform url');
      existing.forEach(link => {
        console.log('   🔗', link.platform + ':', link.url);
      });
      return existing;
    }

    console.log('🆕 Creating new social links...');
    const socialLinks = [
      { platform: 'GitHub', url: 'https://github.com/jasilmeledath', order: 1 },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/jasilmeledath', order: 2 },
      { platform: 'Twitter', url: 'https://twitter.com/jasilmeledath', order: 3 },
      { platform: 'Email', url: 'mailto:jasil@jasilmeledath.dev', order: 4 }
    ];

    const socialData = socialLinks.map(link => ({
      ...link,
      userId: userId.toString(),
      isActive: true
    }));

    const newSocialLinks = await SocialLink.insertMany(socialData);
    console.log('✅ Social links created successfully (', newSocialLinks.length, 'links)');
    return newSocialLinks;
  } catch (error) {
    console.error('❌ Error creating social links:', error);
    throw error;
  }
};

/**
 * Create skills
 */
const createSkills = async (userId) => {
  try {
    const existingCount = await Skill.countDocuments({ userId: userId.toString() });
    if (existingCount > 0) {
      console.log('✅ Skills already exist (', existingCount, 'skills found)');
      const existing = await Skill.find({ userId: userId.toString() }).select('name level category').sort({ level: -1 }).limit(5);
      console.log('   🏆 Top skills:');
      existing.forEach(skill => {
        console.log('      -', skill.name + ':', skill.level + '%', '(' + skill.category + ')');
      });
      return existing;
    }

    console.log('🆕 Creating new skills...');
    const skills = [
      { name: 'React', level: 95, category: 'frontend', icon: '⚛️', logoIdentifier: 'SiReact', logoLibrary: 'react-icons/si' },
      { name: 'Next.js', level: 90, category: 'frontend', icon: '▲', logoIdentifier: 'SiNextdotjs', logoLibrary: 'react-icons/si' },
      { name: 'TypeScript', level: 88, category: 'frontend', icon: '🔷', logoIdentifier: 'SiTypescript', logoLibrary: 'react-icons/si' },
      { name: 'JavaScript', level: 92, category: 'frontend', icon: '🟨', logoIdentifier: 'SiJavascript', logoLibrary: 'react-icons/si' },
      { name: 'Node.js', level: 85, category: 'backend', icon: '🟢', logoIdentifier: 'SiNodedotjs', logoLibrary: 'react-icons/si' },
      { name: 'MongoDB', level: 80, category: 'database', icon: '🍃', logoIdentifier: 'SiMongodb', logoLibrary: 'react-icons/si' },
      { name: 'Python', level: 75, category: 'backend', icon: '🐍', logoIdentifier: 'SiPython', logoLibrary: 'react-icons/si' },
      { name: 'AWS', level: 70, category: 'cloud', icon: '☁️', logoIdentifier: 'SiAmazonaws', logoLibrary: 'react-icons/si' }
    ];

    const skillData = skills.map((skill, index) => ({
      ...skill,
      userId: userId.toString(),
      yearsOfExperience: Math.floor(skill.level / 20),
      isActive: true,
      order: index + 1
    }));

    const newSkills = await Skill.insertMany(skillData);
    console.log('✅ Skills created successfully (', newSkills.length, 'skills)');
    return newSkills;
  } catch (error) {
    console.error('❌ Error creating skills:', error);
    throw error;
  }
};

/**
 * Create sample projects
 */
const createProjects = async (userId) => {
  try {
    const existingCount = await Project.countDocuments({ userId: userId.toString() });
    if (existingCount > 0) {
      console.log('✅ Projects already exist (', existingCount, 'projects found)');
      const existing = await Project.find({ userId: userId.toString() }).select('title featured priority').sort({ priority: 1 });
      console.log('   📂 Existing projects:');
      existing.forEach(project => {
        console.log('      -', project.title, project.featured ? '(⭐ Featured)' : '');
      });
      return existing;
    }

    console.log('🆕 Creating new projects...');
    const projects = [
      {
        title: 'Portfolio Website',
        description: 'A modern, responsive portfolio website built with Next.js and MongoDB. Features a clean design, blog functionality, and admin dashboard.',
        technologies: ['Next.js', 'React', 'MongoDB', 'Tailwind CSS', 'Node.js'],
        liveUrl: 'https://jasilmeledath.dev',
        githubUrl: 'https://github.com/jasilmeledath/nextjs-portfolio',
        imageUrl: 'https://via.placeholder.com/600x400/2563eb/ffffff?text=Portfolio+Website',
        featured: true,
        priority: 1
      },
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with user authentication, payment integration, and admin panel for product management.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
        liveUrl: 'https://example-ecommerce.com',
        githubUrl: 'https://github.com/jasilmeledath/ecommerce-platform',
        imageUrl: 'https://via.placeholder.com/600x400/059669/ffffff?text=E-Commerce+Platform',
        featured: true,
        priority: 2
      },
      {
        title: 'Task Management App',
        description: 'Collaborative task management application with real-time updates, team collaboration features, and project tracking.',
        technologies: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'PostgreSQL'],
        liveUrl: 'https://example-tasks.com',
        githubUrl: 'https://github.com/jasilmeledath/task-manager',
        imageUrl: 'https://via.placeholder.com/600x400/dc2626/ffffff?text=Task+Manager',
        featured: false,
        priority: 3
      }
    ];

    const projectData = projects.map(project => ({
      ...project,
      userId: userId.toString(),
      status: 'completed',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const newProjects = await Project.insertMany(projectData);
    console.log('✅ Projects created successfully (', newProjects.length, 'projects)');
    return newProjects;
  } catch (error) {
    console.error('❌ Error creating projects:', error);
    throw error;
  }
};

/**
 * Create experience
 */
const createExperience = async (userId) => {
  try {
    const existingCount = await Experience.countDocuments({ userId: userId.toString() });
    if (existingCount > 0) {
      console.log('✅ Experience already exists (', existingCount, 'entries found)');
      const existing = await Experience.find({ userId: userId.toString() }).select('company position startDate endDate').sort({ startDate: -1 });
      console.log('   💼 Existing experience:');
      existing.forEach(exp => {
        const endDateStr = exp.endDate ? exp.endDate.getFullYear() : 'Present';
        console.log('      -', exp.position, 'at', exp.company, '(' + exp.startDate.getFullYear() + '-' + endDateStr + ')');
      });
      return existing;
    }

    console.log('🆕 Creating new experience...');
    const experiences = [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Full Stack Developer',
        location: 'Remote',
        startDate: new Date('2022-01-01'),
        endDate: null, // Current job
        description: 'Led development of scalable web applications using React, Node.js, and cloud technologies. Mentored junior developers and collaborated with cross-functional teams.',
        technologies: ['React', 'Node.js', 'AWS', 'MongoDB', 'TypeScript'],
        isActive: true
      },
      {
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        location: 'San Francisco, CA',
        startDate: new Date('2020-06-01'),
        endDate: new Date('2021-12-31'),
        description: 'Developed and maintained multiple client projects using modern web technologies. Implemented CI/CD pipelines and optimized application performance.',
        technologies: ['React', 'Express', 'PostgreSQL', 'Docker'],
        isActive: true
      }
    ];

    const experienceData = experiences.map(exp => ({
      ...exp,
      userId: userId.toString()
    }));

    const newExperience = await Experience.insertMany(experienceData);
    console.log('✅ Experience created successfully (', newExperience.length, 'entries)');
    return newExperience;
  } catch (error) {
    console.error('❌ Error creating experience:', error);
    throw error;
  }
};

/**
 * Main seeding function
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('🔗 Connecting to MongoDB Atlas...');
    
    await connectDB();
    
    // Create admin user first
    const adminUser = await createAdminUser();
    const userId = adminUser._id;
    
    console.log('📋 Checking existing data...');
    
    // Create all portfolio data (with safety checks)
    const results = await Promise.all([
      createPersonalInfo(userId),
      createSocialLinks(userId),
      createSkills(userId),
      createProjects(userId),
      createExperience(userId)
    ]);
    
    // Final count verification
    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Final Summary:');
    console.log('   ✅ Admin user:', adminUser.email, '(Role:', adminUser.role + ')');
    
    const [personalCount, socialCount, skillCount, projectCount, expCount] = await Promise.all([
      PersonalInfo.countDocuments({ userId: userId.toString() }),
      SocialLink.countDocuments({ userId: userId.toString() }),
      Skill.countDocuments({ userId: userId.toString() }),
      Project.countDocuments({ userId: userId.toString() }),
      Experience.countDocuments({ userId: userId.toString() })
    ]);
    
    console.log('   📝 Personal info entries:', personalCount);
    console.log('   🔗 Social links:', socialCount);
    console.log('   🛠️  Skills:', skillCount);
    console.log('   📂 Projects:', projectCount);
    console.log('   💼 Experience entries:', expCount);
    console.log('');
    console.log('🚀 Your portfolio data is ready!');
    console.log('   🌐 Frontend: https://jasilmeledath.dev');
    console.log('   🔧 Backend: https://jasilmeledathdev-production.up.railway.app');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
