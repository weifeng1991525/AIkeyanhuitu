# MedAI Pro - Deployment Guide

## Overview

MedAI Pro is a Next.js 14 App Router application with PostgreSQL database, WeChat OAuth authentication, and OpenAI integration.

## Prerequisites

- **Node.js** >= 18.17.0
- **PostgreSQL** >= 14
- **npm** or **yarn** or **pnpm**
- **WeChat Open Platform** account (for OAuth)
- **OpenAI API** key

## Local Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd medai-pro
npm install
```

### 2. Environment Configuration

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/medai_pro"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-random-string"
WECHAT_APP_ID="your-wechat-app-id"
WECHAT_APP_SECRET="your-wechat-app-secret"
JWT_SECRET="your-jwt-secret"
OPENAI_API_KEY="sk-your-openai-key"
ADMIN_EMAIL="admin@medai.pro"
ADMIN_PASSWORD="your-admin-password"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Or run migrations (production)
npm run db:migrate

# Seed with default data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Configure environment variables in Vercel settings
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "server.js"]
```

### Self-hosted (VPS/Cloud)

```bash
# Build
npm run build

# Start production server
npm start

# Or use PM2
pm2 start npm --name "medai-pro" -- start
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | Base URL of the application |
| `NEXTAUTH_SECRET` | Yes | Secret for encrypting sessions |
| `JWT_SECRET` | Yes | Secret for JWT token signing |
| `WECHAT_APP_ID` | Yes | WeChat Open Platform App ID |
| `WECHAT_APP_SECRET` | Yes | WeChat Open Platform App Secret |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `OPENAI_MODEL` | No | OpenAI model (default: gpt-4-turbo-preview) |
| `DALL_E_MODEL` | No | DALL-E model (default: dall-e-3) |
| `ADMIN_EMAIL` | No | Admin user email (default: admin@medai.pro) |
| `ADMIN_PASSWORD` | No | Admin password (default: admin123) |
| `UPLOAD_MAX_SIZE` | No | Max upload size in bytes (default: 10485760) |
| `REDIS_URL` | No | Redis URL for caching (optional) |
| `SENTRY_DSN` | No | Sentry DSN for error monitoring (optional) |

## Architecture

```
medai-pro/
├── src/app/          # Next.js App Router pages and API routes
├── src/components/   # React components
├── src/lib/          # Core utilities (DB, Auth, AI, WeChat)
├── src/types/        # TypeScript type definitions
├── src/hooks/        # Custom React hooks (Zustand stores)
└── prisma/           # Database schema and migrations
```

## Key Features

- **Authentication**: WeChat OAuth + JWT-based session management
- **AI Generation**: OpenAI GPT-4 for hypothesis/roadmap, DALL-E 3 for images
- **Membership System**: Tiered subscriptions with credit-based usage
- **Admin Panel**: Full CRUD for prompts, skills, users, and analytics
- **Design**: Premium medical/scientific aesthetic with Tailwind CSS

## Security Considerations

1. All API routes authenticate via JWT cookies (httpOnly, secure)
2. Admin routes require `ADMIN` role verification
3. File uploads are validated for type and size
4. Database queries use Prisma parameterized queries (SQL injection safe)
5. CORS and security headers configured in `next.config.js`

## Monitoring

- **Error Tracking**: Integrate Sentry via `SENTRY_DSN` env var
- **Analytics**: Built-in admin analytics dashboard
- **Logs**: Admin action audit trail via `AdminLog` model

## Support

For issues and feature requests, please contact the development team.
