const { PrismaClient: AuthPrismaClient } = require('../../core-platform-services/auth-service/node_modules/@prisma/client');
const { PrismaClient: ConTechPrismaClient } = require('../node_modules/@prisma/client');

// Note: Using relative paths to node_modules to ensure we use the correct generated client for each project
// However, since I am running this from the terminal, I will just instanciate standard PrismaClients 
// if they are available in the path, or I'll create two separate scripts.

// Let's create two separate scripts to be safe.
console.log("Use the promote-admin scripts instead.");
