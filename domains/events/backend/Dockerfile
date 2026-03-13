# Stage 1: Build the application
FROM node:22 AS builder

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma
RUN npm install --legacy-peer-deps

# Copy source code and other necessary files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Create the production image
FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl curl

WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY package*.json ./
COPY prisma ./prisma
RUN npm install --omit=dev --legacy-peer-deps

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/src/generated ./dist/generated


# Expose the port the app runs on
EXPOSE 3004

# Command to run the application
CMD ["node", "dist/main"]

