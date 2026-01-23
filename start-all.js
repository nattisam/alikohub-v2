const { fork } = require('child_process');
const path = require('path');

const services = [
  { name: 'api-gateway', path: './domains/core-platform-services/api-gateway-service/dist/main.js', port: 3000 },
  { 
    name: 'auth-service', 
    path: './domains/core-platform-services/auth-service/dist/main.js', 
    port: 3001,
    dbEnv: 'AUTH_DATABASE_URL'
  },
  { 
    name: 'file-upload-service', 
    path: './domains/core-platform-services/file-upload-service/dist/main.js', 
    port: 3009 
  },
  { 
    name: 'academy-backend', 
    path: './domains/academy/backend/dist/src/main.js', 
    port: 3002,
    dbEnv: 'ACADEMY_DATABASE_URL'
  },
  { 
    name: 'con-tech-backend', 
    path: './domains/con-tech/backend/dist/src/main.js', 
    port: 3003,
    dbEnv: 'CONTECH_DATABASE_URL'
  },
  { 
    name: 'careers-service', 
    path: './domains/core-platform-services/careers-service/dist/main.js', 
    port: 3004,
    dbEnv: 'CAREERS_DATABASE_URL'
  },
  { 
    name: 'events-backend', 
    path: './domains/events/backend/dist/src/main.js', 
    port: 3005,
    dbEnv: 'EVENTS_DATABASE_URL'
  },
];

console.log('--- starting alikohub microservices ---');

services.forEach(service => {
  console.log(`starting ${service.name} (port ${service.port}) ...`);
  
  const env = {
    ...process.env,
    PORT: service.port,
    NODE_ENV: 'production'
  };

  if (service.dbEnv && process.env[service.dbEnv]) {
    env.DATABASE_URL = process.env[service.dbEnv];
    console.log(`[${service.name}] Using DATABASE_URL from ${service.dbEnv}`);
  }

  const child = fork(path.resolve(__dirname, service.path), [], {
    env
  });

  child.on('message', (msg) => {
    console.log(`[${service.name}] ${msg}`);
  });

  child.on('error', (err) => {
    console.error(`[${service.name}] ERROR:`, err);
  });

  child.on('exit', (code) => {
    console.log(`[${service.name}] exited with code ${code}`);
  });
});
