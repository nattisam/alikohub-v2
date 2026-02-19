# Stage 1: Build the application
FROM node:22 AS builder

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the production image
FROM node:22-slim
RUN apt-get update -y && apt-get install -y openssl curl

WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose the port
EXPOSE 3009

# Command to run the application
CMD ["node", "dist/main"]
