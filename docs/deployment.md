# Deployment

This guide covers deployment options including Docker, SSR, and production setup.

## Deployment Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **CSR** | Client-Side Rendering | Static hosting, CDN |
| **SSR** | Server-Side Rendering | SEO, dynamic content |

## Quick Reference

```bash
# Build CSR
pnpm build

# Build SSR
pnpm build:ssr

# Build Docker image (CSR)
pnpm build:image

# Build Docker image (SSR)
pnpm build:image -- --mode ssr

# Run container
pnpm run:container
```

## CSR Deployment

### Build

```bash
pnpm build
```

Output in `dist/` folder:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ...
```

### Static Hosting Options

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm build
      
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### AWS S3 + CloudFront

```bash
# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## SSR Deployment

### Build

```bash
pnpm build:ssr
```

Output:
```
dist/
├── client/       # Client bundle
│   ├── index.html
│   └── assets/
└── server/       # Server bundle
    └── entry-server.js
```

### Environment Variables

Create `.env` for production:

```env
NODE_ENV=production
VITE_APP_PORT=3000
VITE_PUBLIC_APP_NAME=React Starter
VITE_PUBLIC_APP_BASE_PATH=/
VITE_PUBLIC_API_BASE_URL=https://api.example.com
```

### Run Production Server

```bash
pnpm preview:ssr
```

### Node.js Server (PM2)

```bash
# Install PM2
npm i -g pm2

# Start server
pm2 start server.ts --interpreter tsx --name react-starter

# Or use ecosystem file
pm2 start ecosystem.config.js
```

```js
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'react-starter',
    script: 'server.ts',
    interpreter: 'node',
    interpreter_args: '--import tsx',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      VITE_APP_PORT: 3000,
    }
  }]
}
```

## Docker Deployment

### Folder Structure

```
deploy/
├── Dockerfile      # Multi-stage build
└── nginx.conf      # Nginx config for CSR
```

### Build Docker Image

```bash
# CSR mode (default)
pnpm build:image
# or
./scripts/build-image.sh

# SSR mode
pnpm build:image -- --mode ssr
# or
./scripts/build-image.sh --mode ssr

# Custom tag
./scripts/build-image.sh --tag myapp:v1.0.0 --mode csr
```

### Run Container

```bash
# Using script
pnpm run:container

# Manual
docker run -d \
  -p 3000:3000 \
  --name react-starter \
  -e VITE_PUBLIC_API_BASE_URL=https://api.example.com \
  react-starter:latest
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: deploy/Dockerfile
      target: runner-csr  # or runner-ssr
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - VITE_PUBLIC_API_BASE_URL=https://api.example.com
    restart: unless-stopped

  # Optional: with nginx reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - app
```

### Kubernetes

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: react-starter
spec:
  replicas: 3
  selector:
    matchLabels:
      app: react-starter
  template:
    metadata:
      labels:
        app: react-starter
    spec:
      containers:
        - name: app
          image: your-registry/react-starter:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: production
          resources:
            limits:
              cpu: "500m"
              memory: "512Mi"
            requests:
              cpu: "200m"
              memory: "256Mi"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: react-starter
spec:
  selector:
    app: react-starter
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test:run
      - run: pnpm build

  docker:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: deploy/Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## Production Checklist

### Security

- [ ] Enable HTTPS (TLS/SSL)
- [ ] Set secure headers (Helmet)
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Sanitize user inputs

### Performance

- [ ] Enable compression (gzip/brotli)
- [ ] Configure caching headers
- [ ] Use CDN for static assets
- [ ] Enable HTTP/2
- [ ] Optimize images
- [ ] Code splitting enabled

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure logging
- [ ] Set up health checks
- [ ] Monitor server metrics
- [ ] Set up alerts

### Infrastructure

- [ ] Configure auto-scaling
- [ ] Set up load balancer
- [ ] Configure backups
- [ ] Set up staging environment
- [ ] Document deployment process

## Health Check Endpoint

The SSR server provides a health check at `/health`:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "uptime": 12345.67,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "mode": "production",
  "ssr": true,
  "server": "koa"
}
```

## Troubleshooting

### Build Fails

```bash
# Clear caches
rm -rf node_modules dist .vite
pnpm install
pnpm build
```

### Docker Build Issues

```bash
# Build with no cache
docker build --no-cache -f deploy/Dockerfile -t react-starter .

# Check logs
docker logs react-starter
```

### SSR Hydration Mismatch

1. Ensure same data on server and client
2. Check for browser-only code in components
3. Verify environment variables match

### Memory Issues

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

## Next Steps

- [Getting Started](getting-started.md) - Local development setup
- [Project Structure](project-structure.md) - Codebase organization
- [Testing](testing.md) - CI test configuration
