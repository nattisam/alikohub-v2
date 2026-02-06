/**
 * PM2 Ecosystem Configuration for AlikoHub VPS Deployment
 * 
 * Usage:
 *   pm2 start ecosystem.config.cjs
 *   pm2 start ecosystem.config.cjs --env production
 *   pm2 reload ecosystem.config.cjs --env production
 */
module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: './domains/core-platform-services/api-gateway-service/dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3006,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3006,
      },
    },
    {
      name: 'auth-service',
      script: './domains/core-platform-services/auth-service/dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        AUTH_SERVICE_PORT: 3001,
        AUTH_TCP_PORT: 3011,
      },
      env_production: {
        NODE_ENV: 'production',
        AUTH_SERVICE_PORT: 3001,
        AUTH_TCP_PORT: 3011,
      },
    },
    {
      name: 'file-upload-service',
      script: './domains/core-platform-services/file-upload-service/dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development',
        PORT: 3009,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3009,
      },
    },
    {
      name: 'academy-backend',
      script: './domains/academy/backend/dist/src/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3005,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
    },
    {
      name: 'con-tech-backend',
      script: './domains/con-tech/backend/dist/src/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3002,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
    },
    {
      name: 'careers-service',
      script: './domains/core-platform-services/careers-service/dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development',
        CAREERS_SERVICE_PORT: 3008,
      },
      env_production: {
        NODE_ENV: 'production',
        CAREERS_SERVICE_PORT: 3008,
      },
    },
    {
      name: 'events-backend',
      script: './domains/events/backend/dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development',
        EVENTS_SERVICE_PORT: 3004,
      },
      env_production: {
        NODE_ENV: 'production',
        EVENTS_SERVICE_PORT: 3004,
      },
    },
  ],
};
