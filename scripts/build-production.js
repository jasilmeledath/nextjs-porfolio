#!/usr/bin/env node

/**
 * Production Build Script
 * Comprehensive build process with optimizations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Production Build Process...\n');

// Step 1: Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  if (fs.existsSync('./client/.next')) {
    execSync('rm -rf ./client/.next', { stdio: 'inherit' });
  }
  if (fs.existsSync('./client/out')) {
    execSync('rm -rf ./client/out', { stdio: 'inherit' });
  }
  console.log('✅ Build directories cleaned\n');
} catch (error) {
  console.error('❌ Error cleaning builds:', error.message);
}

// Step 2: Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm run install:all', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Step 3: Run linting
console.log('🔍 Running linting...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed\n');
} catch (error) {
  console.warn('⚠️  Linting warnings detected, continuing...\n');
}

// Step 4: Build client for production
console.log('🏗️  Building client for production...');
try {
  execSync('cd client && NODE_ENV=production npm run build', { stdio: 'inherit' });
  console.log('✅ Client built successfully\n');
} catch (error) {
  console.error('❌ Error building client:', error.message);
  process.exit(1);
}

// Step 5: Generate build report
console.log('📊 Generating build report...');
try {
  const buildInfo = {
    buildTime: new Date().toISOString(),
    nodeVersion: process.version,
    environment: 'production',
    clientSize: getBuildSize('./client/.next'),
  };
  
  fs.writeFileSync('./build-info.json', JSON.stringify(buildInfo, null, 2));
  console.log('✅ Build report generated\n');
} catch (error) {
  console.warn('⚠️  Could not generate build report:', error.message);
}

console.log('🎉 Production build completed successfully!');
console.log('📋 Next steps:');
console.log('   1. Deploy client build to your hosting provider');
console.log('   2. Deploy server to your Node.js hosting provider');
console.log('   3. Update environment variables for production');
console.log('   4. Configure your domain DNS settings');

function getBuildSize(buildDir) {
  try {
    const { execSync } = require('child_process');
    const result = execSync(`du -sh ${buildDir}`, { encoding: 'utf8' });
    return result.trim().split('\t')[0];
  } catch {
    return 'Unknown';
  }
}