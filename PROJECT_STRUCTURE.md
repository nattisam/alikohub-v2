# AlikoHub Monorepo Structure

This document describes the backend/server-side structure of the AlikoHub monorepo so it can be reimplemented or migrated into another repository.

---

## 1. Monorepo Overview

**Root path:** `c:/Users/X1/pro/alikohub/alikohub`

The repository is a Node-based monorepo that uses:

- **npm workspaces** (`domains/*`, `libraries/*`)
- **Nx** for project orchestration (`nx.json`)
- A collection of **backend services** (NestJS, Express, Laravel) and shared libraries

---

## 2. Tooling & Workspaces

### 2.1 Root `package.json`

Path: `./package.json`

Key fields:

```json
{
  "name": "alikohub",
  "workspaces": [
    "domains/*",
    "libraries/*"
  ],
  "type": "module",
  "main": "domains/general/frontend/index.js",
  "dependencies": {
    "nx": "^21.2.2",
    "@nestjs/common": "^11.1.6",
    "@nestjs/core": "^11.1.6",
    "@nestjs/microservices": "^11.1.6",
    "react-router-dom": "^7.6.3",
    "react-icons": "^5.5.0",
    "tailwind-scrollbar": "^4.0.2",
    "ts-jest": "^29.4.0"
  }
}
```

This file defines the workspace roots and some shared dependencies. Each app/service has its own `package.json` under `domains/*` or `libraries/*`.

### 2.2 Nx Workspace (`nx.json`)

Path: `./nx.json`

Important bits:

```json
{
  "workspaceLayout": {
    "appsDir": "domains",
    "libsDir": "libraries"
  },
  "projects": {
    "consultancy-frontend": {
      "root": "domains/consultancy/frontend",
      "projectType": "application"
    },
    "consultancy-backend": {
      "root": "domains/consultancy/backend",
      "projectType": "application"
    },
    "academy-frontend": {
      "root": "domains/academy/frontend",
      "projectType": "application"
    },
    "academy-backend": {
      "root": "domains/academy/backend",
      "projectType": "application"
    },
    "tech-frontend": {
      "root": "domains/tech/frontend",
      "projectType": "application"
    },
    "tech-backend": {
      "root": "domains/tech/backend",
      "projectType": "application"
    },
    "marketing-site-frontend": {
      "root": "domains/marketing-site/frontend",
      "projectType": "application"
    },
    "api-gateway-service": {
      "root": "domains/core-platform-services/api-gateway-service",
      "projectType": "application"
    },
    "auth-service": {
      "root": "domains/core-platform-services/auth-service",
      "projectType": "application"
    },
    "notification-service": {
      "root": "domains/core-platform-services/notification-service",
      "projectType": "application"
    },
    "payment-service": {
      "root": "domains/core-platform-services/payment-service",
      "projectType": "application"
    },
    "chat-service": {
      "root": "domains/core-platform-services/chat-service",
      "projectType": "application"
    },
    "file-upload-service": {
      "root": "domains/core-platform-services/file-upload-service",
      "projectType": "application"
    },
    "ui-library": {
      "root": "libraries/ui-library",
      "projectType": "library"
    },
    "common-data-types": {
      "root": "libraries/common-data-types",
      "projectType": "library"
    },
    "common-utils": {
      "root": "libraries/common-utils",
      "projectType": "library"
    }
  }
}
```

**Note:** Some Nx project roots (e.g. `domains/tech/*`, `domains/marketing-site/*`, `libraries/ui-library`) do not have matching folders in the current tree and may be legacy or planned projects.

---

## 3. Top-Level Directory Layout

```text
./
├─ .env
├─ .env.example
├─ .git/
├─ .gitattributes
├─ .gitignore
├─ .nx/
├─ Docker-setup.md
├─ H_Beautiful_Problem.py
├─ README.md
├─ docker-compose.yml
├─ init-db.sh
├─ nx.json
├─ package-lock.json
├─ package.json
├─ swagger-spec.json
├─ test-careers-api.js
├─ test-careers-endpoint.mjs
├─ test-careers-service.cjs
├─ test-careers-service.mjs
├─ test-careers-workflow.js
├─ docs/
├─ domains/          ← application / service workspaces
└─ libraries/        ← shared libraries
```

---

## 4. Domains (Applications & Services)

Top-level `domains` structure:

```text
domains/
├─ academy/
├─ con-tech/
├─ consultancy/
├─ core-platform-services/
├─ events/
└─ general/
```

### 4.1 `domains/academy`

```text
domains/academy/
├─ backend/
├─ frontend/        (frontend app - not documented here)
└─ *.md             (internal docs)
```

#### 4.1.1 Academy Backend

- **Path:** `domains/academy/backend/package.json`
- **Name:** `"backend"` (referred to as `academy-backend` in `nx.json`)
- **Type:** NestJS backend
- **Key stack:**
  - NestJS 11 (HTTP + microservices)
  - Prisma 6
  - RabbitMQ (`amqp-connection-manager`, `amqplib`)
  - Class-validator / class-transformer
  - Firebase Admin SDK

---

### 4.2 `domains/con-tech`

```text
domains/con-tech/
├─ backend/
├─ frontend/                      (frontend app - not documented here)
└─ CONTECH_DASHBOARD_INTEGRATION.md
```

#### 4.2.1 Con-Tech Backend

- **Path:** `domains/con-tech/backend/package.json`
- **Name:** `"backend"`
- **Type:** NestJS backend
- **Key stack:**
  - NestJS 9
  - Prisma 6 + PostgreSQL (`pg`)
  - RabbitMQ
  - Jest, ESLint, Prettier

---

### 4.3 `domains/consultancy`

```text
domains/consultancy/
├─ Aliko-consultancy -Frontend/   (frontend app - not documented here)
├─ AlikoHub-API_Backend/
└─ AlikoHub-web_Frontend/        (frontend app - not documented here)
```

#### 4.3.1 AlikoHub API Backend (Laravel + Vite assets)

- **Path:** `domains/consultancy/AlikoHub-API_Backend/package.json`
- **Name:** *(no explicit `name`)*, `"private": true`
- **Type:** JS tooling for a Laravel backend (Vite bundler)
- **Key stack:**
  - Vite 4
  - axios
  - `laravel-vite-plugin`
  - PostCSS

> The actual backend logic is Laravel/PHP in this folder; `package.json` only handles JS build assets.

---

### 4.4 `domains/core-platform-services`

```text
domains/core-platform-services/
├─ api-gateway-service/
├─ auth-service/
├─ careers-service/
├─ chat-service/
├─ file-upload-service/
├─ notification-service/
└─ payment-service/
```

#### 4.4.1 API Gateway Service

- **Path:** `domains/core-platform-services/api-gateway-service/package.json`
- **Name:** `"api-gateway-service"`
- **Type:** NestJS gateway
- **Key stack:**
  - NestJS 11
  - Prisma 6
  - Swagger (`@nestjs/swagger`, `swagger-ui-express`)
  - Cloudinary

#### 4.4.2 Auth Service

- **Path:** `domains/core-platform-services/auth-service/package.json`
- **Name:** `"auth-service"`
- **Type:** NestJS auth microservice
- **Key stack:**
  - NestJS 11
  - Prisma 6
  - RabbitMQ (`amqp-connection-manager`, `amqplib`)
  - Argon2 password hashing
  - Firebase Admin

#### 4.4.3 Careers Service

- **Path:** `domains/core-platform-services/careers-service/package.json`
- **Name:** `"@alikohub/careers-service"`
- **Type:** NestJS service
- **Key stack:**
  - NestJS 10
  - Prisma 5
  - Jest test setup
  - Scripts for `prisma:generate` and `prisma:migrate`

#### 4.4.4 Chat Service

- **Path:** `domains/core-platform-services/chat-service/package.json`
- **Name:** `"chat-service"`
- **Type:** Simple Node module scaffold
- **Key stack:**
  - `type: "module"`
  - `main: "src/index.js"`
  - `"test": "jest"`

#### 4.4.5 File Upload Service

- **Path:** `domains/core-platform-services/file-upload-service/package.json`
- **Name:** `"file-upload-service"`
- **Type:** Express file upload microservice
- **Key stack:**
  - Express 4
  - Multer
  - Nodemon for dev

#### 4.4.6 Notification Service

- **Path:** `domains/core-platform-services/notification-service/package.json`
- **Name:** `"notification-service"`
- **Type:** Simple Node module scaffold
- **Key stack:**
  - `type: "module"`
  - `main: "index.js"`
  - `"test": "jest"`

#### 4.4.7 Payment Service

- **Path:** `domains/core-platform-services/payment-service/package.json`
- **Name:** `"payment-service"`
- **Type:** Simple Node module scaffold
- **Key stack:**
  - `type: "module"`
  - `main: "src/index.js"`
  - `"test": "jest"`

---

### 4.5 `domains/events`

```text
domains/events/
├─ backend/
└─ frontend/        (frontend app - not documented here)
```

#### 4.5.1 Events Backend

- **Path:** `domains/events/backend/package.json`
- **Name:** `"events-backend"`
- **Type:** NestJS backend
- **Key stack:**
  - NestJS 11
  - Prisma 6.17
  - Jest, ts-jest

---

## 5. Shared Libraries (`libraries/`)

```text
libraries/
├─ common-data-types/
├─ common-utils/
└─ ui-libraries/
```

### 5.1 `libraries/common-data-types`

- **Path:** `libraries/common-data-types/package.json`
- **Name:** `"common-data-types"`
- **Type:** Shared JS/TS data types module
- **Key fields:**
  - `type: "module"`
  - `main: "src/index.js"`
  - `"test": "jest"`

### 5.2 `libraries/common-utils`

- **Path:** `libraries/common-utils/package.json`
- **Name:** `"common-utils"`
- **Type:** Shared utility module
- **Key fields:**
  - `type: "module"`
  - `main: "src/index.js"`
  - `"test": "jest"`

### 5.3 `libraries/ui-libraries`

- **Path:** `libraries/ui-libraries/package.json`
- **Name:** `"ui-libraries"`
- **Type:** React UI library based on MUI + Emotion
- **Key stack:**
  - Dependencies: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
  - Peer deps: `react`, `react-dom`

> Note: `nx.json` currently expects a project `ui-library` at `libraries/ui-library`; the actual folder is `ui-libraries/`.

---

## 6. Documentation (`docs/`)

```text
docs/
├─ ACADEMY_CLIENT_SIDE_AUTH_DOCUMENTATION.md
├─ AUTH-SERVICE-API-ENDPOINTS-DOCUMENTATION.md
├─ AlikoEvent_API_Documentation.md
├─ Con-Tech Frontend Documentation.md
├─ Con-Tech-API-Endpoints-documentation.md
├─ ConTech-Dashboard-Architecture-Documentation.md
├─ README.md
├─ api-gateway-academy-service.requests.md
├─ api_endpoints.md
├─ backend_docs.md
├─ globals.md
└─ system-architecture.png
```

These files document:

- **Academy** client-side auth and API integrations
- **Auth service** API endpoints
- **Events** backend API
- **Con-Tech** frontend and API endpoints
- **Dashboard architecture** and global/system architecture

---

## 7. Notes for Reimplementation in a New Repo

- **Workspaces:**
  - Recreate the root `package.json` with `"workspaces": ["domains/*", "libraries/*"]`.
  - Add each `domains/*` and `libraries/*` folder as a workspace.

- **Nx configuration:**
  - Port `nx.json`, but update `projects` roots to match whatever folder names you decide in the new repo (e.g. align `con-tech` vs `tech`, `ui-libraries` vs `ui-library`).

- **Apps and services:**
  - Each folder listed above with a `package.json` is an independent Node/Nx project.
  - For Laravel (`AlikoHub-API_Backend`), remember that the core backend is PHP; copy its PHP/Laravel structure along with `package.json`.

- **Docs:**
  - Copy `docs/` (and domain-level `*.md` files like those under `domains/academy`) to preserve API and architecture references.

This file (`PROJECT_STRUCTURE.md`) is intended as the single source of truth for how the current monorepo is organized so it can be reconstructed or refactored cleanly in another repository.
