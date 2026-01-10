import { config } from 'dotenv'
import express from 'express'
import fs from 'node:fs/promises'

/**
 * Server Entry Point for SSR
 * 
 * Environment Variables:
 * - process.env (runtime, from .env file via dotenv)
 *   Used by: server.js, entry-server.tsx
 * - import.meta.env (build-time, injected by Vite)
 *   Used by: client-side code, compiled bundles
 * 
 * Note: The base path and other config comes from process.env at runtime,
 * allowing flexibility to change configuration without rebuilding.
 */

// Load environment variables from .env file at runtime
config()

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.VITE_APP_PORT || 3000
const base = process.env.VITE_PUBLIC_APP_BASE_PATH || '/'

console.log('[SERVER] Mode:', isProduction ? 'production' : 'development')
console.log('[SERVER] Port:', port)
console.log('[SERVER] Base:', base)

// Cached production assets
// Note: dist/client/index.ssr.html is the build output from index.ssr.html
const templateHtml = isProduction
    ? await fs.readFile('./dist/client/index.ssr.html', 'utf-8')
    : ''

// Whitelist public env variables (prefixed with VITE_PUBLIC_)
const PUBLIC_ENV_PREFIX = 'VITE_PUBLIC_'

/**
 * Load public environment variables that should be exposed to client
 * @returns {Object} Object containing all VITE_PUBLIC_* env vars
 */
function loadPublicEnv() {
    return Object.keys(process.env)
        .filter(key => key.startsWith(PUBLIC_ENV_PREFIX))
        .reduce((acc, key) => {
            acc[key] = process.env[key]
            return acc
        }, {})
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
        // Reload .env file
        config({ override: true })
        
        // Reload public env vars
        publicEnv = loadPublicEnv()
        
        console.log('[SERVER] 🔄 Environment variables reloaded. Client will see changes on next page load.')
        console.log('[SERVER] Updated public env vars:', Object.keys(publicEnv).length, 'variables')
    })

    console.log('[SERVER] 👀 Watching .env file for changes...')
}

// Create http server
const app = express()

// Security: Hide X-Powered-By header to avoid exposing Express
app.disable('x-powered-by')

// Security: Add common security headers
app.use((req, res, next) => {
    // Hide powered-by header
    res.removeHeader('X-Powered-By')
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff')
    
    // Enable X-Frame-Options to prevent clickjacking
    res.setHeader('X-Frame-Options', 'SAMEORIGIN')
    
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block')
    
    next()
})

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base
    })
    app.use(vite.middlewares)
} else {
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default
    app.use(compression())
    app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Health check endpoint for container orchestration
// Location depends on base path configuration
const healthHandler = (req, res) => {
    res.status(200).json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        mode: isProduction ? 'production' : 'development',
        ssr: true,
        env: {
            publicVarsCount: Object.keys(publicEnv).length,
            nodeVersion: process.version
        }
    })
}

// Register health check at root or base path (not both)
if (base === '/') {
    app.get('/health', healthHandler)
} else {
    const healthCheckPath = base.replace(/\/$/, '') + '/health'
    app.get(healthCheckPath, healthHandler)
}

// Serve HTML
app.use(/.*/, async (req, res) => {
    try {
        let url = req.originalUrl
        let statusCode = 200

        // Handle base path routing
        if (base !== '/') {
            const basePath = base.endsWith('/') ? base.slice(0, -1) : base
            
            // If accessing root without base path, redirect to base path
            if (url === '/' || url === '') {
                return res.redirect(301, base)
            }
            
            // If accessing base path without trailing slash, redirect with trailing slash
            if (url === basePath) {
                return res.redirect(301, base)
            }
            
            // If accessing a path without base path, redirect to include base path
            if (!url.startsWith(base)) {
                const cleanUrl = url.startsWith('/') ? url : '/' + url
                return res.redirect(301, basePath + cleanUrl)
            }
        }

        let template, render

        if (!isProduction) {
            // Use index.ssr.html for SSR mode
            template = await fs.readFile('./index.ssr.html', 'utf-8')
            // Transform template with the actual URL path (relative to base)
            const urlRelativeToBase = url.startsWith(base) ? url.slice(base.length) || '/' : url
            template = await vite.transformIndexHtml(
                urlRelativeToBase,
                template
            )
            render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
        } else {
            template = templateHtml
            render = (await import('./dist/server/entry-server.js')).render
        }

        // Pass both URL and base path to render function
        const rendered = await render(url, base)

        const appConfigScript = `<script>window.__APP_CONFIG__ = ${JSON.stringify(publicEnv)}</script>`

        const html = template
            .replace(`<!--app-head-->`, rendered.head ?? '')
            .replace(`<!--app-html-->`, rendered.html ?? '')
            .replace(`<!--app-config-->`, appConfigScript)

        res.status(statusCode).set({ 'Content-Type': 'text/html' }).send(html)
    } catch (e) {
        vite?.ssrFixStacktrace(e)
        res.status(500).end(e.stack)
    }
})

// Start http server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}${base}`)
})
