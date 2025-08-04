/**
 * PM2 Ecosystem Configuration for VPS Deployment
 * Use with: pm2 start ecosystem.config.js --env production
 */

module.exports = {
  apps: [
    {
      name: 'jasilmeledath-api',
      script: './server/server.js',
      cwd: './server',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 8000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
      // Performance monitoring
      monitoring: false,
      pmx: false,
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto-restart configuration
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      watch_options: {
        followSymlinks: false,
      },
      
      // Memory and CPU limits
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      
      // Advanced features
      merge_logs: true,
      time: true,
      
      // Health monitoring
      health_check_grace_period: 3000,
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Environment specific settings
      env_file: '.env.production',
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'https://github.com/jasilmeledath/portfolio.git',
      path: '/var/www/jasilmeledath-portfolio',
      'post-deploy': 'npm install && npm run build:production && pm2 reload ecosystem.config.js --env production && pm2 save',
      'pre-setup': 'apt update && apt install git -y'
    }
  }
};