/**
 * @fileoverview Skills Data Seeder - Add sample skills with logos
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-08-02
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const Skill = require('../models/Skill');
const User = require('../models/User');

// Sample skills data with logo identifiers
const sampleSkills = [
  // Frontend Skills
  {
    name: 'React',
    level: 95,
    icon: '⚛️',
    logoIdentifier: 'SiReact',
    logoLibrary: 'react-icons/si',
    category: 'frontend',
    yearsOfExperience: 5,
    isActive: true,
    order: 1
  },
  {
    name: 'Next.js',
    level: 90,
    icon: '▲',
    logoIdentifier: 'SiNextdotjs',
    logoLibrary: 'react-icons/si',
    category: 'frontend',
    yearsOfExperience: 3,
    isActive: true,
    order: 2
  },
  {
    name: 'TypeScript',
    level: 88,
    icon: '🔷',
    logoIdentifier: 'SiTypescript',
    logoLibrary: 'react-icons/si',
    category: 'frontend',
    yearsOfExperience: 4,
    isActive: true,
    order: 3
  },
  {
    name: 'JavaScript',
    level: 92,
    icon: '🟨',
    logoIdentifier: 'SiJavascript',
    logoLibrary: 'react-icons/si',
    category: 'frontend',
    yearsOfExperience: 6,
    isActive: true,
    order: 4
  },
  {
    name: 'Tailwind CSS',
    level: 85,
    icon: '🎨',
    logoIdentifier: 'SiTailwindcss',
    logoLibrary: 'react-icons/si',
    category: 'frontend',
    yearsOfExperience: 2,
    isActive: true,
    order: 5
  },

  // Backend Skills
  {
    name: 'Node.js',
    level: 90,
    icon: '💚',
    logoIdentifier: 'SiNodedotjs',
    logoLibrary: 'react-icons/si',
    category: 'backend',
    yearsOfExperience: 5,
    isActive: true,
    order: 6
  },
  {
    name: 'Express.js',
    level: 87,
    icon: '🚀',
    logoIdentifier: 'SiExpress',
    logoLibrary: 'react-icons/si',
    category: 'backend',
    yearsOfExperience: 4,
    isActive: true,
    order: 7
  },
  {
    name: 'Python',
    level: 82,
    icon: '🐍',
    logoIdentifier: 'SiPython',
    logoLibrary: 'react-icons/si',
    category: 'backend',
    yearsOfExperience: 3,
    isActive: true,
    order: 8
  },

  // Tools & DevOps
  {
    name: 'MongoDB',
    level: 85,
    icon: '🍃',
    logoIdentifier: 'SiMongodb',
    logoLibrary: 'react-icons/si',
    category: 'tools',
    yearsOfExperience: 4,
    isActive: true,
    order: 9
  },
  {
    name: 'Docker',
    level: 78,
    icon: '🐳',
    logoIdentifier: 'SiDocker',
    logoLibrary: 'react-icons/si',
    category: 'tools',
    yearsOfExperience: 2,
    isActive: true,
    order: 10
  },
  {
    name: 'Git',
    level: 90,
    icon: '📝',
    logoIdentifier: 'SiGit',
    logoLibrary: 'react-icons/si',
    category: 'tools',
    yearsOfExperience: 6,
    isActive: true,
    order: 11
  },
  {
    name: 'AWS',
    level: 75,
    icon: '☁️',
    logoIdentifier: 'SiAmazonaws',
    logoLibrary: 'react-icons/si',
    category: 'tools',
    yearsOfExperience: 2,
    isActive: true,
    order: 12
  },

  // Design
  {
    name: 'Figma',
    level: 80,
    icon: '🎨',
    logoIdentifier: 'SiFigma',
    logoLibrary: 'react-icons/si',
    category: 'design',
    yearsOfExperience: 3,
    isActive: true,
    order: 13
  }
];

async function seedSkills() {
  try {
    console.log('🌱 Starting skills data seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-dev');
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('❌ Admin user not found. Please create an admin user first.');
      return;
    }

    console.log(`👤 Found admin user: ${adminUser.email}`);

    // Clear existing skills for this user
    await Skill.deleteMany({ userId: adminUser._id });
    console.log('🧹 Cleared existing skills');

    // Add userId to each skill
    const skillsWithUser = sampleSkills.map(skill => ({
      ...skill,
      userId: adminUser._id
    }));

    // Insert new skills
    const insertedSkills = await Skill.insertMany(skillsWithUser);
    console.log(`✅ Successfully inserted ${insertedSkills.length} skills`);

    // Display summary
    const summary = {};
    insertedSkills.forEach(skill => {
      if (!summary[skill.category]) {
        summary[skill.category] = 0;
      }
      summary[skill.category]++;
    });

    console.log('\n📊 Skills Summary by Category:');
    Object.entries(summary).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} skills`);
    });

    console.log('\n🎉 Skills seeding completed successfully!');
    console.log('💡 You can now test the marquee on the portfolio page');
    console.log('🔧 Use the admin panel to manage skills with the new icon picker');

  } catch (error) {
    console.error('❌ Error seeding skills:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeder
if (require.main === module) {
  seedSkills();
}

module.exports = { seedSkills, sampleSkills };
