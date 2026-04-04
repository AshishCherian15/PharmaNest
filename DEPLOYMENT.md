# Pharma Nest Deployment Guide

## Prerequisites

- Node.js 18.17+ or 20+
- npm or yarn
- PostgreSQL (for production database)
- Docker (optional, for containerization)

## Local Development

### 1. Setup

```bash
# Clone repository
git clone <repository-url>
cd "Pharma Nest"

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 2. Configure Environment

Edit `.env.local`:

```env
# Must change for development
AUTH_SECRET=your-dev-secret-key
AUTH_DEFAULT_PASSWORD=admin

# Optional for AI features
# GENKIT_API_KEY=your-key
# GOOGLE_GENAI_API_KEY=your-key
```

### 3. Development Server

```bash
# Start development server on port 9002
npm run dev

# Visit http://localhost:9002
```

### 4. Verify Setup

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format
```

## Production Build

### 1. Build Optimization

```bash
# Create production build
npm run build

# The build creates:
# - .next/ directory (optimized bundles)
# - Standalone server ready for deployment
```

### 2. Environment for Production

Create `.env.production.local`:

```env
# MUST SET THESE
AUTH_SECRET=your-super-secure-random-secret-key
AUTH_DEFAULT_PASSWORD=change-this-or-remove

# Database (when migrated from in-memory)
DATABASE_URL=postgresql://user:password@host:5432/pharmanest

# API Keys
GENKIT_API_KEY=production-key
GOOGLE_GENAI_API_KEY=production-key

# Server settings
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com
```

### 3. Start Production Server

```bash
# Start server on port 3000 (default)
npm run start

# With custom port
PORT=8080 npm run start
```

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy application
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start server
CMD ["npm", "start"]
```

### 2. Build Docker Image

```bash
docker build -t pharma-nest:latest .
```

### 3. Run Docker Container

```bash
docker run \
  -p 3000:3000 \
  -e AUTH_SECRET=your-secret \
  -e AUTH_DEFAULT_PASSWORD=your-password \
  -e DATABASE_URL=postgresql://... \
  pharma-nest:latest
```

### 4. Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: production
      AUTH_SECRET: ${AUTH_SECRET}
      AUTH_DEFAULT_PASSWORD: ${AUTH_DEFAULT_PASSWORD}
      DATABASE_URL: postgresql://pharma:password@db:5432/pharmanest
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: pharma
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: pharmanest
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

Run with:

```bash
docker-compose up -d
```

## Cloud Deployment

### Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel Dashboard:
# - Go to Settings > Environment Variables
# - Add all variables from .env.production.local
```

### AWS EC2

```bash
# SSH into instance
ssh -i key.pem ubuntu@your-instance.ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Clone repository
git clone <repository-url>
cd "Pharma Nest"

# Install dependencies
npm install

# Build
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "pharma-nest" -- start
pm2 startup
pm2 save

# Setup Nginx reverse proxy (optional)
# Configure SSL with Let's Encrypt
```

### Render.com

```bash
1. Connect GitHub repository
2. Create New > Web Service
3. Select pharma-nest repository
4. Environment: Node
5. Build Command: npm run build
6. Start Command: npm run start
7. Add environment variables:
   - AUTH_SECRET
   - AUTH_DEFAULT_PASSWORD
   - DATABASE_URL (PostgreSQL)
8. Deploy
```

### Heroku (Legacy)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create pharma-nest

# Set environment variables
heroku config:set AUTH_SECRET=your-secret
heroku config:set AUTH_DEFAULT_PASSWORD=your-password
heroku config:set NODE_ENV=production

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Deploy
git push heroku main
```

## Database Migration

### 1. Install Prisma

```bash
npm install @prisma/client
npm install -D prisma
```

### 2. Initialize Prisma

```bash
npx prisma init
```

### 3. Update Database URL

In `.env.production.local`:

```env
DATABASE_URL=postgresql://user:password@host:5432/pharmanest
```

### 4. Create Schema

Edit `prisma/schema.prisma` with your data models.

### 5. Migrate Database

```bash
# Create first migration
npx prisma migrate dev --name init

# Production deployment
npx prisma migrate deploy
```

## Monitoring & Logging

### 1. Application Logging

Logs are managed by the built-in logger in `src/lib/logger.ts`. In production:

```typescript
import { appLogger } from '@/lib/logger';

// Logs are stored in memory and can be exported
const logs = appLogger.exportLogs('json');
// Send to external service (Sentry, LogRocket, etc.)
```

### 2. Error Tracking (Recommended)

#### Sentry Integration

```bash
npm install @sentry/nextjs
```

Configure in Next.js:

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 3. Performance Monitoring

Use built-in Web Vitals:

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Scaling Recommendations

### 1. Database Optimization
- Add indexes on frequently queried columns
- Implement connection pooling (PgBouncer)
- Set up read replicas for reporting

### 2. Caching
- Redis for session storage
- CDN for static assets
- HTTP caching headers

### 3. Load Balancing
- Use multiple app instances
- Load balancer (AWS ELB, Nginx)
- Health checks endpoint

### 4. Content Delivery
- CDN (Cloudflare, AWS CloudFront)
- Image optimization (Cloudinary, Imgix)
- Compression (gzip, Brotli)

## Maintenance

### Regular Tasks

```bash
# Weekly: Update dependencies
npm update
npm audit fix

# Monthly: Security check
npm audit

# Quarterly: Major updates
npm outdated
npm install [package@latest]
```

### Database Backups

```bash
# PostgreSQL backup
pg_dump -U pharma pharmanest > backup.sql

# Docker container backup
docker exec pharma-nest-db pg_dump -U pharma pharmanest > backup.sql

# Restore
psql -U pharma pharmanest < backup.sql
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=8080 npm run start
```

### Build Failures

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

```bash
# Test connection
npm run typecheck

# Check PostgreSQL
psql postgresql://user:password@host:5432/pharmanest
```

## Security Checklist

- [ ] Change default credentials in production
- [ ] Enable HTTPS/TLS
- [ ] Set secure environment variables
- [ ] Configure CORS properly
- [ ] Enable database encryption
- [ ] Setup firewall rules
- [ ] Regular security updates
- [ ] Implement rate limiting
- [ ] Configure backup strategy
- [ ] Monitor error logs

## Support

For deployment issues:
1. Check logs: `npm run dev` and inspect browser console
2. Review error types in `src/lib/logger.ts`
3. Check environment variables are set correctly
4. Review Docker/container configurations
5. Consult Next.js deployment docs

## Resources

- [Next.js Deployment](https://nextjs.org/learn/basics/deploying-nextjs-app)
- [Vercel Deployment](https://vercel.com/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Prisma](https://www.prisma.io/docs/)
- [Docker](https://docs.docker.com/)
