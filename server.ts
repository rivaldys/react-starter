import Router from '@koa/router'
import { config } from 'dotenv'
import Koa, { type Context, type Next } from 'koa'
import compress from 'koa-compress'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import helmet from 'koa-helmet'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { constants as zlibConstants } from 'node:zlib'
import sirv from 'sirv'

// Type definitions for SSR render function
type RenderFunction = (url: string, base: string) => Promise<{ html: string; head: string; state: unknown }>

/**
 * Server Entry Point for SSR using Koa
 * 
 * This is a modern, lightweight server implementation using Koa.js
 * which provides better middleware composition, async/await support,
 * and a cleaner API compared to Express.
 * 
 * Environment Variables:
 * - process.env (runtime, from .env file via dotenv)
 *   Used by: server.js, entry-server.tsx
 * - import.meta.env (build-time, injected by Vite)
 *   Used by: client-side code, compiled bundles
 */

// Load environment variables from .env file at runtime
config()

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = parseInt(process.env.VITE_APP_PORT || '3000', 10)
const base = process.env.VITE_PUBLIC_APP_BASE_PATH || '/'

// Logger utility
const logger = {
    info: (message: string, ...args: unknown[]) => {
        console.log(`[SERVER] ${message}`, ...args)
    },
    error: (message: string, ...args: unknown[]) => {
        console.error(`[SERVER] ❌ ${message}`, ...args)
    },
    warn: (message: string, ...args: unknown[]) => {
        console.warn(`[SERVER] ⚠️ ${message}`, ...args)
    },
    success: (message: string, ...args: unknown[]) => {
        console.log(`[SERVER] ✅ ${message}`, ...args)
    }
}

logger.info('Mode:', isProduction ? 'production' : 'development')
logger.info('Port:', port)
logger.info('Base:', base)

// Cached production assets
const templateHtml = isProduction
    ? await fs.readFile('./dist/client/index.ssr.html', 'utf-8')
    : ''

// Whitelist public env variables (prefixed with VITE_PUBLIC_)
const PUBLIC_ENV_PREFIX = 'VITE_PUBLIC_'

/**
 * Load public environment variables that should be exposed to client
 */
function loadPublicEnv(): Record<string, string> {
    return Object.keys(process.env)
        .filter(key => key.startsWith(PUBLIC_ENV_PREFIX))
        .reduce((acc, key) => {
            acc[key] = process.env[key] as string
            return acc
        }, {} as Record<string, string>)
}

// Initial load of public env vars
let publicEnv = loadPublicEnv()

// Watch .env file for changes and hot-reload environment variables (development only)
if (!isProduction) {
    const { watch } = await import('chokidar')
    const envWatcher = watch('.env', {
        ignoreInitial: true,
        awaitWriteFinish: {
            stabilityThreshold: 100,
            pollInterval: 50
        }
    })

    envWatcher.on('change', () => {
        config({ override: true })
        publicEnv = loadPublicEnv()
        logger.info('🔄 Environment variables reloaded. Client will see changes on next page load.')
        logger.info('Updated public env vars:', Object.keys(publicEnv).length, 'variables')
    })

    logger.info('👀 Watching .env file for changes...')
}

// Create Koa application
const app = new Koa()
const router = new Router()

// Trust proxy (for when behind reverse proxy)
app.proxy = true

// Error handling middleware
app.use(async (ctx: Context, next: Next) => {
    try {
        await next()
    } catch (err) {
        const error = err as Error & { status?: number; expose?: boolean }
        ctx.status = error.status || 500
        
        if (isProduction && !error.expose) {
            ctx.body = { error: 'Internal Server Error' }
        } else {
            ctx.body = { 
                error: error.message,
                stack: isProduction ? undefined : error.stack 
            }
        }
        
        // Emit error for logging
        ctx.app.emit('error', error, ctx)
    }
})

// App-level error handler
app.on('error', (err: Error, ctx: Context) => {
    logger.error('Server error:', err.message)
    if (!isProduction) {
        console.error(err.stack)
    }
})

// Request logging middleware (development only)
if (!isProduction) {
    app.use(async (ctx: Context, next: Next) => {
        const start = Date.now()
        await next()
        const ms = Date.now() - start
        const logLevel = ctx.status >= 400 ? 'warn' : 'info'
        logger[logLevel](`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`)
    })
}

// Security headers using koa-helmet
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for now (can be configured later)
    crossOriginEmbedderPolicy: false
}))

// Additional security headers
app.use(async (ctx: Context, next: Next) => {
    ctx.set('X-Content-Type-Options', 'nosniff')
    ctx.set('X-Frame-Options', 'SAMEORIGIN')
    ctx.set('X-XSS-Protection', '1; mode=block')
    ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    await next()
})

// Vite dev server or production static middleware
let vite: import('vite').ViteDevServer | undefined

if (!isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base
    })
    
    // Use Vite's connect middleware
    app.use(async (ctx: Context, next: Next) => {
        const handled = await new Promise<boolean>((resolve) => {
            vite!.middlewares(ctx.req, ctx.res, () => resolve(false))
            // If response is finished, it was handled by Vite
            ctx.res.on('finish', () => resolve(true))
        })
        if (!handled) {
            await next()
        }
    })
} else {
    // Compression middleware (production only)
    app.use(compress({
        filter: (contentType: string) => {
            return /text|javascript|json|css|svg/.test(contentType)
        },
        threshold: 1024,
        gzip: {
            flush: zlibConstants.Z_SYNC_FLUSH
        },
        br: {
            params: {
                [zlibConstants.BROTLI_PARAM_QUALITY]: 4
            }
        }
    }))
    
    // Conditional GET & ETag for caching
    app.use(conditional())
    app.use(etag())
    
    /**
     * Static file serving using sirv
     * 
     * Why sirv over koa-static?
     * - sirv is used by Vite itself for production preview
     * - Better performance with optimized file lookup
     * - Built-in brotli/gzip support
     * - Smart caching with etag/last-modified headers
     * - Smaller footprint and faster startup
     * - Single-pass directory reading (cached)
     */
    const staticPath = path.resolve(__dirname, 'dist/client')
    const sirvHandler = sirv(staticPath, {
        maxAge: 31536000, // 1 year in seconds
        immutable: true,  // Assets are immutable (use cache busting)
        gzip: true,
        brotli: true,
        etag: true,
        dotfiles: false,  // Don't serve hidden files
        extensions: [],   // Don't auto-append extensions
        single: false     // Don't serve index.html for all routes (we handle SSR)
    })
    
    // Wrap sirv for Koa (sirv uses native http req/res)
    app.use(async (ctx: Context, next: Next) => {
        // Let sirv try to handle the request
        await new Promise<void>((resolve) => {
            // Check if sirv handled the request
            const originalEnd = ctx.res.end.bind(ctx.res)
            let handled = false
            
            // Override end to detect when sirv writes response
            ctx.res.end = function(
                chunkOrCb?: unknown,
                encodingOrCb?: BufferEncoding | (() => void),
                cb?: () => void
            ) {
                handled = true
                return originalEnd(chunkOrCb, encodingOrCb as BufferEncoding, cb)
            } as typeof ctx.res.end
            
            sirvHandler(ctx.req, ctx.res, () => {
                // sirv didn't handle it, continue to next middleware
                if (!handled) {
                    resolve()
                }
            })
            
            // If sirv handled, resolve after response
            ctx.res.on('finish', () => {
                if (handled) resolve()
            })
        })
        
        // If response not finished, continue
        if (!ctx.res.writableEnded) {
            await next()
        }
    })
}

// Health check endpoint
const healthHandler = async (ctx: Koa.Context) => {
    ctx.body = {
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        mode: isProduction ? 'production' : 'development',
        ssr: true,
        server: 'koa',
        env: {
            publicVarsCount: Object.keys(publicEnv).length,
            nodeVersion: process.version
        }
    }
}

// Register health check routes
if (base === '/') {
    router.get('/health', healthHandler)
} else {
    const healthPath = base.replace(/\/$/, '') + '/health'
    router.get(healthPath, healthHandler)
}

// SSR render handler
const renderHandler = async (ctx: Koa.Context) => {
    let url = ctx.originalUrl
    
    // Handle base path routing
    if (base !== '/') {
        const basePath = base.endsWith('/') ? base.slice(0, -1) : base
        
        // Redirect root to base path
        if (url === '/' || url === '') {
            ctx.redirect(base)
            ctx.status = 301
            return
        }
        
        // Redirect base path without trailing slash
        if (url === basePath) {
            ctx.redirect(base)
            ctx.status = 301
            return
        }
        
        // Redirect paths without base path
        if (!url.startsWith(base)) {
            const cleanUrl = url.startsWith('/') ? url : '/' + url
            ctx.redirect(basePath + cleanUrl)
            ctx.status = 301
            return
        }
    }

    let template: string
    let render: RenderFunction

    if (!isProduction && vite) {
        // Development mode
        template = await fs.readFile('./index.ssr.html', 'utf-8')
        const urlRelativeToBase = url.startsWith(base) ? url.slice(base.length) || '/' : url
        template = await vite.transformIndexHtml(urlRelativeToBase, template)
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render as RenderFunction
    } else {
        // Production mode
        template = templateHtml
        render = (await import('./dist/server/entry-server.js')).render as unknown as RenderFunction
    }

    // Render the app
    const rendered = await render(url, base)
    
    /**
     * Inject scripts for client-side hydration
     * 
     * 1. __APP_CONFIG__: Runtime environment variables (VITE_PUBLIC_*)
     * 2. __PRELOADED_STATE__: Redux state for hydration
     * 
     * Security note: We escape < to prevent XSS via </script> injection
     */
    const safeSerialize = (obj: unknown) => 
        JSON.stringify(obj).replace(/</g, '\\u003c')
    
    const appConfigScript = `<script>
        window.__APP_CONFIG__ = ${safeSerialize(publicEnv)};
        window.__PRELOADED_STATE__ = ${safeSerialize(rendered.state)};
        </script>`
    
    // Replace placeholders with rendered content
    const html = template
        .replace('<!--app-head-->', rendered.head ?? '')
        .replace('<!--app-html-->', rendered.html ?? '')
        .replace('<!--app-config-->', appConfigScript)

    ctx.type = 'text/html'
    ctx.body = html
}

// Use router
app.use(router.routes())
app.use(router.allowedMethods())

// Catch-all route for SSR
app.use(renderHandler)

// Start the server
app.listen(port, () => {
    logger.success(`Server started at http://localhost:${port}${base}`)
    if (!isProduction) {
        logger.info('Press Ctrl+C to stop')
    }
})

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully...`)
    process.exit(0)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

export default app
