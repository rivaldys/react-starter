import DocLayout from '../_components/DocLayout'

export default function Deployment()
{
    return (
        <>
            <title>Deployment &#8729; React Starter</title>
            <meta name="description" content="Docker deployment guide for React Starter with CSR and SSR modes. Multi-stage build configuration." />
            <meta name="keywords" content="React, Deployment, Docker, CSR, SSR, Nginx" />
            <meta property="og:title" content="Deployment &#8729; React Starter" />
            <meta property="og:description" content="Docker deployment guide for both CSR and SSR modes." />
            <meta property="og:type" content="article" />

            <DocLayout title="Deployment" icon="🐳">
                <p>
                    This project includes Docker configuration for both <strong>CSR (Client-Side Rendering)</strong> and 
                    <strong> SSR (Server-Side Rendering)</strong> modes, with multi-stage builds for optimized production images.
                </p>

                <h2>Quick Deploy</h2>
                <pre><code>{`# Build Docker image (CSR - default)
pnpm build:image

# Build Docker image (SSR)
pnpm build:image -- --mode ssr

# Run container
pnpm run:container`}</code></pre>

                <h2>Docker Files</h2>
                <p>All Docker files are in the <code>deploy/</code> folder:</p>
                <pre><code>{`deploy/
├── Dockerfile      # Multi-stage Docker build (SSR & CSR)
└── nginx.conf      # Nginx config for CSR mode`}</code></pre>

                <h2>Multi-Stage Dockerfile</h2>
                <p>The Dockerfile supports both SSR and CSR modes via build arguments:</p>
                <pre><code>{`# deploy/Dockerfile
# =============================================================================
# Multi-stage Dockerfile for React Starter
# Supports both SSR and CSR modes
# =============================================================================

# Stage 1: Dependencies
FROM node:24-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:24-alpine AS builder
ARG BUILD_MODE=ssr
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build based on mode
RUN if [ "$BUILD_MODE" = "ssr" ]; then \\
        pnpm build:ssr; \\
    else \\
        pnpm build; \\
    fi

# Stage 3: Production Runner (SSR)
FROM node:24-alpine AS runner-ssr
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 reactapp

# Copy necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.node.json ./tsconfig.node.json

# Install production deps + tsx
RUN pnpm install --prod --frozen-lockfile && pnpm add tsx
RUN chown -R reactapp:nodejs /app
USER reactapp

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["npx", "tsx", "server.ts"]

# Stage 4: Production Runner (CSR with Nginx)
FROM nginx:alpine AS runner-csr
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

# Default target (CSR)
# Use: docker build --target runner-ssr for SSR mode
FROM runner-csr`}</code></pre>

                <h2>Building Docker Images</h2>
                
                <h3>CSR Mode (Default)</h3>
                <pre><code>{`# Build CSR image (uses nginx)
docker build -f deploy/Dockerfile -t react-starter:csr .

# Or use the script
pnpm build:image`}</code></pre>

                <h3>SSR Mode</h3>
                <pre><code>{`# Build SSR image (uses Koa server)
docker build -f deploy/Dockerfile --target runner-ssr \\
    --build-arg BUILD_MODE=ssr -t react-starter:ssr .

# Or use the script
pnpm build:image -- --mode ssr`}</code></pre>

                <h2>Running Containers</h2>
                <pre><code>{`# Run CSR container (port 80)
docker run -d -p 80:80 --name react-app-csr react-starter:csr

# Run SSR container (port 3000)
docker run -d -p 3000:3000 --name react-app-ssr react-starter:ssr

# Or use the script
pnpm run:container`}</code></pre>

                <h2>Environment Variables</h2>
                <p>Create a <code>.env</code> file based on <code>.env.example</code>:</p>
                <pre><code>{`# Application
VITE_APP_PORT=3000
VITE_PUBLIC_APP_NAME=React Starter
VITE_PUBLIC_APP_BASE_PATH=/

# API
VITE_PUBLIC_API_BASE_URL=http://localhost:8080

# Features
VITE_USE_SSR=false`}</code></pre>
                <p><strong>Note:</strong> Variables prefixed with <code>VITE_PUBLIC_</code> are exposed to the client.</p>

                <h2>Build Process</h2>
                <ol>
                    <li><strong>CSR Build:</strong> <code>pnpm build</code> → outputs to <code>dist/</code></li>
                    <li><strong>SSR Build:</strong> <code>pnpm build:ssr</code> → outputs client to <code>dist/client/</code> and server to <code>dist/server/</code></li>
                </ol>
                <pre><code>{`# CSR build command
pnpm build
# Runs: tsc -b && vite build

# SSR build command
pnpm build:ssr
# Runs: 
#   1. pnpm build:client (vite build --outDir dist/client)
#   2. pnpm build:server (vite build --ssr src/entry-server.tsx --outDir dist/server)`}</code></pre>

                <h2>Health Checks</h2>
                <p>Both CSR and SSR containers include health checks:</p>
                <ul>
                    <li><strong>SSR:</strong> <code>http://localhost:3000/health</code></li>
                    <li><strong>CSR:</strong> <code>http://localhost:80/</code></li>
                </ul>
                <pre><code>{`# Check container health
docker inspect --format='{{.State.Health.Status}}' react-app-ssr`}</code></pre>

                <h2>Cloud Deployment</h2>

                <h3>Railway / Render</h3>
                <pre><code>{`# railway.json / render.yaml
{
"build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "deploy/Dockerfile",
    "dockerTarget": "runner-ssr"
},
"deploy": {
    "healthcheckPath": "/health"
}
}`}</code></pre>

            <h3>Vercel (Static Only)</h3>
            <pre><code>{`// vercel.json
{
"buildCommand": "pnpm build",
"outputDirectory": "dist",
"framework": "vite"
}`}</code></pre>

                <h2>Best Practices</h2>
                <ul>
                    <li><strong>Multi-Stage Builds:</strong> Keeps production images small (~50MB for CSR, ~150MB for SSR)</li>
                    <li><strong>Non-Root User:</strong> SSR container runs as non-root for security</li>
                    <li><strong>Layer Caching:</strong> Dependencies installed before copying source for cache efficiency</li>
                    <li><strong>Health Checks:</strong> Built-in health endpoints for orchestration</li>
                    <li><strong>Cross-Platform Scripts:</strong> Build scripts work on macOS, Linux, and Windows</li>
                    <li><strong>Secrets:</strong> Never commit <code>.env</code> files, use secrets management</li>
                </ul>
            </DocLayout>
        </>
    )
}
