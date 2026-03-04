import { fork, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
let dotenvLoaded = false;
try {
  const dotenv = await import('dotenv');
  dotenv.default.config();
  dotenvLoaded = true;
} catch {
  // dotenv is optional; proceed without it
}
import fs from 'fs';

// Load global environment variables from root .env (best-effort)
if (dotenvLoaded) {
  // already loaded above
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Command line arguments
const args = process.argv.slice(2);
const shouldSync = args.includes('--sync');
const shouldBuild = args.includes('--build');

const services = [
  { 
    name: 'api-gateway', 
    path: './domains/core-platform-services/api-gateway-service/dist/main.js', 
    portVar: 'API_GATEWAY_PORT' 
  },
  { 
    name: 'auth-service', 
    path: './domains/core-platform-services/auth-service/dist/main.js',
    dbVar: 'AUTH_DATABASE_URL',
    portVar: 'AUTH_SERVICE_PORT',
    hasPrisma: true
  },
  { 
    name: 'file-upload-service', 
    path: './domains/core-platform-services/file-upload-service/dist/main.js', 
    portVar: 'FILE_UPLOAD_SERVICE_PORT' 
  },
  { 
    name: 'academy-backend', 
    path: './domains/academy/backend/dist/src/main.js',
    dbVar: 'ACADEMY_DATABASE_URL',
    portVar: 'ACADEMY_SERVICE_PORT',
    hasPrisma: true
  },
  { 
    name: 'con-tech-backend', 
    path: './domains/con-tech/backend/dist/src/main.js',
    dbVar: 'CONTECH_DATABASE_URL',
    portVar: 'CONTECH_SERVICE_PORT',
    hasPrisma: true
  },
  { 
    name: 'careers-service', 
    path: './domains/core-platform-services/careers-service/dist/main.js',
    dbVar: 'CAREERS_DATABASE_URL',
    portVar: 'CAREERS_SERVICE_PORT',
    hasPrisma: true
  },
  { 
    name: 'events-backend', 
    path: './domains/events/backend/dist/main.js',
    dbVar: 'EVENTS_DATABASE_URL',
    portVar: 'EVENTS_SERVICE_PORT',
    hasPrisma: true
  },
];

console.log('--- AlikoHub Microservices Orchestrator ---');
if (shouldSync) console.log('>> Mode: Database Sync Enabled');
if (shouldBuild) console.log('>> Mode: Rebuild Enabled');

async function start() {
  for (const service of services) {
    const serviceRoot = path.resolve(__dirname, service.path.split('/dist/')[0]);
    const entryPoint = path.resolve(__dirname, service.path);

    // 1. Sync Database if flag is set and service has Prisma
    if (shouldSync && service.hasPrisma) {
      console.log(`[${service.name}] Syncing database schema...`);
      try {
        const dbEnv = { ...process.env };
        if (service.dbVar && process.env[service.dbVar]) {
          dbEnv.DATABASE_URL = process.env[service.dbVar];
        }
        
        execSync('npx prisma db push --accept-data-loss', { 
          cwd: serviceRoot, 
          env: dbEnv, 
          stdio: 'inherit' 
        });
        execSync('npx prisma generate', { 
          cwd: serviceRoot, 
          env: dbEnv, 
          stdio: 'inherit' 
        });
      } catch (err) {
        console.error(`[${service.name}] ERROR during database sync. Skipping startup.`);
        continue;
      }
    }

    // 2. Build if flag is set
    if (shouldBuild) {
      console.log(`[${service.name}] Building...`);
      try {
        execSync('npm run build', { cwd: serviceRoot, stdio: 'inherit' });
      } catch (err) {
        console.error(`[${service.name}] ERROR during build. Skipping startup.`);
        continue;
      }
    }

    // 3. Verify entry point exists
    if (!fs.existsSync(entryPoint)) {
      console.error(`[${service.name}] ERROR: Entry point not found: ${entryPoint}. Did you run build?`);
      continue;
    }

    // 4. Prepare environment variables and start
    const env = {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'production',
    };

    if (service.portVar && process.env[service.portVar]) {
      env.PORT = process.env[service.portVar];
      env[service.portVar] = process.env[service.portVar];
    }

    if (service.dbVar && process.env[service.dbVar]) {
      env.DATABASE_URL = process.env[service.dbVar];
    }

    const child = fork(entryPoint, [], {
      env,
      cwd: serviceRoot,
      stdio: ['inherit', 'pipe', 'pipe', 'ipc']
    });

    child.stdout.on('data', (data) => {
      process.stdout.write(`[${service.name}] ${data}`);
    });

    child.stderr.on('data', (data) => {
      process.stderr.write(`[${service.name}] ERROR: ${data}`);
    });

    child.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.log(`[${service.name}] exited with error code ${code}`);
      } else {
        console.log(`[${service.name}] service stopped.`);
      }
    });
  }
}

start().catch(err => {
  console.error('Orchestrator failed:', err);
});

