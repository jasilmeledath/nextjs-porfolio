#!/usr/bin/env node

/**
 * Smart Console Log Cleanup Script
 * Removes debug console logs but preserves error logging
 * Usage: node scripts/cleanup-console-logs.js
 */

const fs = require('fs');
const path = require('path');

// Patterns to remove (debug/info logs)
const REMOVE_PATTERNS = [
  /console\.log\([^)]*\);?\n?/g,
  /console\.debug\([^)]*\);?\n?/g,
  /console\.info\([^)]*\);?\n?/g,
];

// Patterns to keep (error/warn logs and important operational logs)
const KEEP_PATTERNS = [
  /console\.error/,
  /console\.warn/,
  /console\.table/,
  // Keep logs that are clearly for production monitoring
  /console\.log.*\[EmailService\].*sent successfully/,
  /console\.log.*\[Server\].*listening/,
  /console\.log.*\[Database\].*connected/,
];

function shouldKeepLog(line) {
  return KEEP_PATTERNS.some(pattern => pattern.test(line));
}

function cleanupFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let removedCount = 0;

    // Split into lines to check each console log individually
    const lines = content.split('\n');
    const cleanedLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('console.')) {
        if (shouldKeepLog(line)) {
          // Keep this log
          cleanedLines.push(line);
        } else {
          // Remove this log
          removedCount++;
          // Don't add the line (effectively removes it)
        }
      } else {
        cleanedLines.push(line);
      }
    }

    content = cleanedLines.join('\n');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Cleaned ${filePath} - Removed ${removedCount} debug logs`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function scanDirectory(dirPath, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .next, .git directories
      if (!['node_modules', '.next', '.git', 'coverage'].includes(item)) {
        scanDirectory(fullPath, extensions);
      }
    } else if (extensions.some(ext => item.endsWith(ext))) {
      cleanupFile(fullPath);
    }
  }
}

// Main execution
console.log('🧹 Starting smart console log cleanup...');
console.log('📋 Will remove: console.log, console.debug, console.info');
console.log('🔒 Will preserve: console.error, console.warn, operational logs');
console.log('');

// Clean client files
if (fs.existsSync('./client/src')) {
  console.log('🔍 Scanning client files...');
  scanDirectory('./client/src');
}

// Clean server files
if (fs.existsSync('./server/src')) {
  console.log('🔍 Scanning server files...');
  scanDirectory('./server/src');
}

console.log('');
console.log('✨ Console log cleanup completed!');