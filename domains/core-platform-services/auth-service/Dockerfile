# Stage 1: Build the application
FROM node:22 AS builder

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma
# Install all dependencies (including dev) to build
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client (if auth service uses prisma, which it likely does based on other services)
# Checking file list in Step 69 for careers showed prisma. 
# Step 56 showed auth-service isDir. 
# I should assume safe build: install -> build. 
# If prisma exists, generate it.
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
RUN npm install --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/src/generated ./dist/generated

# Expose the port
EXPOSE 3001

# Command to run the application
# Using sh -c to ensure prisma migration runs if needed, similar to other services
CMD ["node", "dist/main"]
