import DocLayout from '../_components/DocLayout'

export default function GettingStarted()
{
    return (
        <DocLayout title="Getting Started" icon="🚀">
            <p>
                This guide will help you set up and run the React Starter project on your local machine.
            </p>

            <h2>Prerequisites</h2>
            <p>Before you begin, ensure you have the following installed:</p>
            <ul>
                <li><strong>Node.js</strong> &gt;= 24.x (<a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Download</a>)</li>
                <li><strong>pnpm</strong> &gt;= 10.x (<a href="https://pnpm.io/installation" target="_blank" rel="noopener noreferrer">Installation</a>)</li>
                <li><strong>Git</strong> (<a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer">Download</a>)</li>
            </ul>

            <h3>Verify Installation</h3>
            <pre><code>{`node --version    # Should output v24.x.x or higher
pnpm --version    # Should output 10.x.x or higher`}</code></pre>

            <h2>Installation</h2>

            <h3>1. Clone the Repository</h3>
            <pre><code>{`git clone https://github.com/rivaldys/react-starter.git
cd react-starter`}</code></pre>

            <h3>2. Install Dependencies</h3>
            <pre><code>pnpm install</code></pre>

            <h3>3. Environment Setup</h3>
            <p>Copy the example environment file:</p>
            <pre><code>cp .env.example .env</code></pre>

            <p>Edit <code>.env</code> to configure your environment:</p>
            <pre><code>{`# Server port
VITE_APP_PORT=3000

# Application name (exposed to client)
VITE_PUBLIC_APP_NAME=React Starter

# Base path for routing (use "/" for root)
VITE_PUBLIC_APP_BASE_PATH=/

# API base URL
VITE_PUBLIC_API_BASE_URL=http://localhost:8080

# Enable SSR (true/false)
VITE_USE_SSR=false`}</code></pre>

            <h2>Running the Application</h2>

            <h3>Development Mode</h3>

            <h4>Client-Side Rendering (CSR)</h4>
            <pre><code>pnpm dev</code></pre>
            <p>Opens at <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">http://localhost:3000</a> with hot module replacement.</p>

            <h4>Server-Side Rendering (SSR)</h4>
            <pre><code>pnpm dev:ssr</code></pre>
            <p>Opens at <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">http://localhost:3000</a> with SSR and HMR.</p>

            <h3>Production Mode</h3>

            <h4>Build CSR</h4>
            <pre><code>{`pnpm build
pnpm preview`}</code></pre>

            <h4>Build SSR</h4>
            <pre><code>{`pnpm build:ssr
pnpm preview:ssr`}</code></pre>

            <h2>Development Tools</h2>

            <h3>Component Playground</h3>
            <p>In development mode, access the Component Playground at <code>/playground</code> to test UI components:</p>
            <ul>
                <li><strong>Error Boundary</strong> - Test error handling</li>
                <li><strong>Skeleton</strong> - Preview loading animations</li>
                <li><strong>Loading Fallback</strong> - Test loading states</li>
            </ul>

            <h3>Testing</h3>
            <pre><code>{`# Watch mode
pnpm test

# Single run
pnpm test:run

# With coverage
pnpm test:coverage

# With UI
pnpm test:ui`}</code></pre>

            <h3>Linting</h3>
            <pre><code>pnpm lint</code></pre>

            <h2>Troubleshooting</h2>

            <h3>Port Already in Use</h3>
            <pre><code>{`# Find and kill the process using the port
lsof -i :3000
kill -9 <PID>`}</code></pre>

            <h3>Node Version Mismatch</h3>
            <p>Use a Node version manager:</p>
            <pre><code>{`# Using nvm
nvm install 24
nvm use 24

# Using fnm
fnm install 24
fnm use 24`}</code></pre>

            <h3>pnpm Lock File Issues</h3>
            <pre><code>{`rm -rf node_modules pnpm-lock.yaml
pnpm install`}</code></pre>
        </DocLayout>
    )
}
