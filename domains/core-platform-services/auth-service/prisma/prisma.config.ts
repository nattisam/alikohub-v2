import { defineConfig } from 'prisma/config';

export default defineConfig({
  db: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL || "",
  },
});
