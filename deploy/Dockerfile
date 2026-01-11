# =============================================================================
# Multi-stage Dockerfile for React Starter
# Supports both SSR and CSR modes
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# -----------------------------------------------------------------------------
FROM node:24-alpine AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# Stage 2: Builder
# -----------------------------------------------------------------------------
FROM node:24-alpine AS builder

# Build argument for mode selection (ssr or csr)
ARG BUILD_MODE=ssr

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build based on mode
RUN if [ "$BUILD_MODE" = "ssr" ]; then \
        pnpm build:ssr; \
    else \
        pnpm build; \
    fi

# -----------------------------------------------------------------------------
# Stage 3: Production Runner (SSR)
# -----------------------------------------------------------------------------
FROM node:24-alpine AS runner-ssr

# Install pnpm for production deps
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 reactapp

# Copy necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.node.json ./tsconfig.node.json

# Install only production dependencies + tsx for TypeScript execution
RUN pnpm install --prod --frozen-lockfile && pnpm add tsx

# Change ownership
RUN chown -R reactapp:nodejs /app

# Switch to non-root user
USER reactapp

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the server using tsx
CMD ["npx", "tsx", "server.ts"]

# -----------------------------------------------------------------------------
# Stage 4: Production Runner (CSR with nginx)
# -----------------------------------------------------------------------------
FROM nginx:alpine AS runner-csr

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# -----------------------------------------------------------------------------
# Default target (CSR - Client Side Rendering)
# Use: docker build --target runner-ssr -f docker/Dockerfile . for SSR mode
# -----------------------------------------------------------------------------
FROM runner-csr
