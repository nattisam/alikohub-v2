module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: './domains/core-platform-services/api-gateway-service/dist/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'auth-service',
      script: './domains/core-platform-services/auth-service/dist/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'file-upload-service',
      script: './domains/core-platform-services/file-upload-service/dist/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3009,
      },
    },
    {
      name: 'academy-backend',
      script: './domains/academy/backend/dist/src/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
    },
    {
      name: 'con-tech-backend',
      script: './domains/con-tech/backend/dist/src/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
    },
    {
      name: 'careers-service',
      script: './domains/core-platform-services/careers-service/dist/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3004,
      },
    },
    {
      name: 'events-backend',
      script: './domains/events/backend/dist/src/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
    },
  ],
};
