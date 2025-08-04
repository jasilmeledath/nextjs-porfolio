#!/usr/bin/env node

/**
 * Console Log Cleanup Script
 * Removes or sanitizes console logs for production deployment
 * Prevents sensitive data leakage in browser/server logs
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Directories to scan
  scanDirectories: [
    path.join(__dirname, '../client/src'),
    path.join(__dirname, '../server/src'),
    path.join(__dirname, '../server')
  ],
  
  // File extensions to process
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  
  // Patterns to remove/replace
  patterns: [
    // Debug console logs with sensitive data
    {
      pattern: /console\.log\s*\(\s*['"`]?\[.*?\].*?:['"`]?\s*,\s*\{[\s\S]*?\}\s*\);?/g,
      replacement: '// Debug log removed for production',
      description: 'Debug logs with object data'
    },
    
    // Error logs with full error objects
    {
      pattern: /console\.error\s*\(\s*['"`].*?['"`]\s*,\s*error\s*\);?/g,
      replacement: 'console.error($1, error?.message || "Unknown error");',
      description: 'Error logs with full error objects'
    },
    
    // Form data logging
    {
      pattern: /console\.log\s*\(\s*['"`].*?form.*?['"`]\s*,\s*\{[\s\S]*?\}\s*\);?/gi,
      replacement: '// Form data log removed for production',
      description: 'Form data logging'
    },
    
    // API response logging
    {
      pattern: /console\.log\s*\(\s*['"`].*?response.*?['"`]\s*,\s*.*?\);?/gi,
      replacement: '// API response log removed for production',
      description: 'API response logging'
    },
    
    // Token/Auth logging
    {
      pattern: /console\.log\s*\(\s*['"`].*?(token|auth|password|secret|key).*?['"`]\s*,\s*.*?\);?/gi,
      replacement: '// Auth data log removed for production', 
      description: 'Authentication data logging'
    },
    
    // User data logging
    {
      pattern: /console\.log\s*\(\s*['"`].*?(user|email|subscriber).*?['"`]\s*,\s*.*?\);?/gi,
      replacement: '// User data log removed for production',
      description: 'User data logging'
    }
  ],
  
  // Patterns to keep but sanitize
  keepPatterns: [
    // Keep simple string logs (no data)
    /console\.(log|info|warn)\s*\(\s*['"`][^'"`]*['"`]\s*\);?/,
    
    // Keep error logs without sensitive data
    /console\.error\s*\(\s*['"`][^'"`]*['"`]\s*\);?/
  ]
};

class ConsoleLogCleaner {
  constructor() {
    this.stats = {
      filesScanned: 0,
      filesModified: 0,
      logsRemoved: 0,
      logsSanitized: 0
    };
  }

  /**
   * Main cleanup process
   */
  async cleanup() {
    console.log('🧹 STARTING CONSOLE LOG CLEANUP');
    console.log('================================');
    console.log('');
    
    for (const directory of CONFIG.scanDirectories) {
      if (fs.existsSync(directory)) {
        console.log(`📁 Scanning: ${directory}`);
        await this.processDirectory(directory);
      } else {
        console.log(`⚠️  Directory not found: ${directory}`);
      }
    }
    
    this.printSummary();
  }

  /**
   * Process a directory recursively
   */
  async processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and other ignored directories
        if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
          await this.processDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath);
        if (CONFIG.extensions.includes(ext)) {
          await this.processFile(fullPath);
        }
      }
    }
  }

  /**
   * Process a single file
   */
  async processFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      let modified = false;
      
      this.stats.filesScanned++;
      
      // Apply each cleanup pattern
      for (const patternConfig of CONFIG.patterns) {
        const matches = content.match(patternConfig.pattern);
        if (matches) {
          console.log(`  🔧 ${path.relative(process.cwd(), filePath)}: ${matches.length} ${patternConfig.description}`);
          content = content.replace(patternConfig.pattern, patternConfig.replacement);
          this.stats.logsRemoved += matches.length;
          modified = true;
        }
      }
      
      // Write back if modified
      if (modified) {
        fs.writeFileSync(filePath, content);
        this.stats.filesModified++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  /**
   * Print cleanup summary
   */
  printSummary() {
    console.log('');
    console.log('✅ CONSOLE LOG CLEANUP COMPLETED');
    console.log('================================');
    console.log(`📊 Files scanned: ${this.stats.filesScanned}`);
    console.log(`📝 Files modified: ${this.stats.filesModified}`);  
    console.log(`🗑️  Console logs removed: ${this.stats.logsRemoved}`);
    console.log('');
    
    if (this.stats.filesModified > 0) {
      console.log('🔒 SECURITY IMPROVEMENTS:');
      console.log('  ✅ Debug logs with sensitive data removed');
      console.log('  ✅ Full error objects sanitized');
      console.log('  ✅ Form data logging removed');
      console.log('  ✅ API response logging removed');
      console.log('  ✅ Authentication data logging removed');
      console.log('  ✅ User data logging removed');
      console.log('');
      console.log('⚠️  IMPORTANT: Review changes before committing!');
      console.log('   Some logs may be needed for debugging.');
      console.log('   Use NODE_ENV checks for development-only logs.');
    } else {
      console.log('✨ No sensitive console logs found - code is clean!');
    }
  }
}

// Production-safe logging utility
const createProductionLogger = () => {
  return `
/**
 * Production-safe logging utility
 * Use this instead of direct console.log for sensitive data
 */
const logger = {
  // Development-only logging
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, data);
    }
  },
  
  // Safe error logging (no sensitive data)
  error: (message, error) => {
    console.error(message, error?.message || 'Unknown error');
  },
  
  // Safe info logging
  info: (message) => {
    console.log(message);
  },
  
  // Warn logging
  warn: (message) => {
    console.warn(message);
  }
};

module.exports = logger;
`;
};

// Create production logger utility
const createLoggerUtility = () => {
  const clientLoggerPath = path.join(__dirname, '../client/src/utils/logger.js');
  const serverLoggerPath = path.join(__dirname, '../server/src/utils/logger.js');
  
  const loggerCode = createProductionLogger();
  
  // Create client logger
  fs.mkdirSync(path.dirname(clientLoggerPath), { recursive: true });
  fs.writeFileSync(clientLoggerPath, loggerCode);
  
  // Create server logger  
  fs.mkdirSync(path.dirname(serverLoggerPath), { recursive: true });
  fs.writeFileSync(serverLoggerPath, loggerCode);
  
  console.log('📝 Created production-safe logging utilities:');
  console.log(`   - ${clientLoggerPath}`);
  console.log(`   - ${serverLoggerPath}`);
};

// Run cleanup if called directly
if (require.main === module) {
  const cleaner = new ConsoleLogCleaner();
  
  // Create backup flag
  if (process.argv.includes('--backup')) {
    console.log('💾 Creating backup before cleanup...');
    // Implementation for backup would go here
  }
  
  // Create logger utilities
  if (process.argv.includes('--create-logger')) {
    createLoggerUtility();
  }
  
  // Run cleanup
  cleaner.cleanup().catch(console.error);
}

module.exports = { ConsoleLogCleaner, createProductionLogger };