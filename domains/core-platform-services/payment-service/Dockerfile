# Build stage
FROM node:22 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl curl

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/src/generated ./dist/generated

EXPOSE 3012
EXPOSE 4012

CMD ["npm", "run", "start:prod"]
