#!/usr/bin/env node

/**
 * Production Setup Script
 * Prepares environment for production deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('⚙️  Setting up production environment...\n');

// Step 1: Create production environment files if they don't exist
console.log('📄 Checking environment files...');

const envFiles = [
  { src: '.env.production', desc: 'Root production environment' },
  { src: 'client/.env.production', desc: 'Client production environment' },
  { src: 'server/.env.production', desc: 'Server production environment' }
];

envFiles.forEach(({ src, desc }) => {
  if (!fs.existsSync(src)) {
    console.log(`⚠️  ${desc} file missing: ${src}`);
    console.log(`   Please create this file before deploying to production`);
  } else {
    console.log(`✅ ${desc} file exists`);
  }
});

// Step 2: Check required tools
console.log('\n🔧 Checking deployment tools...');

const tools = [
  { cmd: 'git --version', name: 'Git' },
  { cmd: 'node --version', name: 'Node.js' },
  { cmd: 'npm --version', name: 'npm' }
];

tools.forEach(({ cmd, name }) => {
  try {
    execSync(cmd, { stdio: 'ignore' });
    console.log(`✅ ${name} is installed`);
  } catch (error) {
    console.log(`❌ ${name} is not installed or not in PATH`);
  }
});

// Step 3: Install dependencies
console.log('\n📦 Installing all dependencies...');
try {
  execSync('npm run install:all', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Step 4: Run tests
console.log('\n🧪 Running tests...');
try {
  execSync('npm test', { stdio: 'inherit' });
  console.log('✅ Tests passed');
} catch (error) {
  console.warn('⚠️  Some tests failed. Review before deploying.');
}

// Step 5: Build for production
console.log('\n🏗️  Testing production build...');
try {
  execSync('npm run build:production', { stdio: 'inherit' });
  console.log('✅ Production build successful');
} catch (error) {
  console.error('❌ Production build failed');
  process.exit(1);
}

// Step 6: Security check
console.log('\n🔒 Running security audit...');
try {
  execSync('npm audit --audit-level moderate', { stdio: 'inherit' });
  console.log('✅ Security audit passed');
} catch (error) {
  console.warn('⚠️  Security vulnerabilities found. Consider fixing before deployment.');
}

// Step 7: Generate deployment checklist
console.log('\n📋 Generating deployment checklist...');
const checklist = `
# 🚀 Production Deployment Checklist

## Environment Configuration
- [ ] Set production environment variables
- [ ] Configure MongoDB production database
- [ ] Set up email service credentials
- [ ] Configure JWT secrets (strong, unique values)
- [ ] Set up domain DNS records

## Security
- [ ] Update admin password
- [ ] Review CORS settings
- [ ] Check rate limiting configuration
- [ ] Verify SSL/HTTPS setup

## Hosting
- [ ] Choose hosting providers:
  - Client: Vercel/Netlify/Cloudflare Pages
  - Server: Railway/Render/Heroku
- [ ] Set up custom domain
- [ ] Configure environment variables on hosting platforms

## Database
- [ ] Set up MongoDB Atlas cluster (recommended)
- [ ] Configure database backups
- [ ] Set up monitoring

## Monitoring
- [ ] Set up error tracking (optional)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring

## Testing
- [ ] Test all features in production
- [ ] Verify API endpoints work
- [ ] Test form submissions
- [ ] Check mobile responsiveness

## Documentation
- [ ] Update README with production URLs
- [ ] Document environment variables
- [ ] Create admin user guide

## Deployment Commands

### Deploy to Vercel (Client)
\`\`\`bash
./scripts/deploy-vercel.sh production
\`\`\`

### Deploy to Railway (Server)
\`\`\`bash
./scripts/deploy-railway.sh
\`\`\`

### Deploy to Render
\`\`\`bash
./scripts/deploy-render.sh
\`\`\`

### Manual VPS Deployment
\`\`\`bash
pm2 start ecosystem.config.js --env production
\`\`\`
`;

fs.writeFileSync('DEPLOYMENT_CHECKLIST.md', checklist);
console.log('✅ Deployment checklist created: DEPLOYMENT_CHECKLIST.md');

console.log('\n🎉 Production setup completed!');
console.log('📋 Review DEPLOYMENT_CHECKLIST.md before deploying');
console.log('🚀 Ready for deployment!');