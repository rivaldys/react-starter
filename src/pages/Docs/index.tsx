import { Icon, Layout } from '@/components'
import { iconNames, type IconName } from '@/components/atoms/Icon'
import { Link } from 'react-router-dom'
import './index.css'

const docs = [
    {
        title: 'Getting Started',
        description: 'Installation, setup, and running the project',
        icon: '🚀',
        path: '/docs/getting-started'
    },
    {
        title: 'Project Structure',
        description: 'Folder organization and architecture overview',
        icon: '📁',
        path: '/docs/project-structure'
    },
    {
        title: 'Components',
        description: 'Atomic Design methodology and component patterns',
        icon: '🧩',
        path: '/docs/components'
    },
    {
        title: 'State Management',
        description: 'Redux Toolkit setup with SSR hydration',
        icon: '🔄',
        path: '/docs/state-management'
    },
    {
        title: 'Routing',
        description: 'React Router configuration and route protection',
        icon: '🧭',
        path: '/docs/routing'
    },
    {
        title: 'Testing',
        description: 'Unit testing with Vitest and Testing Library',
        icon: '🧪',
        path: '/docs/testing'
    },
    {
        title: 'Deployment',
        description: 'Docker, SSR, and production deployment guides',
        icon: '🐳',
        path: '/docs/deployment'
    }
]

const features = [
    { icon: 'react', title: 'React 19', description: 'Latest React with concurrent features' },
    { icon: 'typescript', title: 'TypeScript', description: 'Full type safety across the codebase' },
    { icon: 'vite', title: 'Vite', description: 'Lightning-fast HMR and optimized builds' },
    { icon: 'tailwind', title: 'Tailwind CSS 4', description: 'Utility-first CSS framework' },
    { icon: '🏗️', title: 'Atomic Design', description: 'Scalable component architecture' },
    { icon: '🌐', title: 'SSR Support', description: 'Server-side rendering with Koa' },
    { icon: '🔄', title: 'Redux Toolkit', description: 'Predictable state management' },
    { icon: '🧪', title: 'Vitest', description: 'Fast unit testing with coverage' },
    { icon: 'docker', title: 'Docker', description: 'Containerized deployment ready' }
]

const sitemap = [
    { path: '/', name: 'Home', description: 'Landing page' },
    { path: '/about', name: 'About', description: 'About the project' },
    { path: '/docs', name: 'Docs', description: 'Documentation hub' },
    { path: '/docs/*', name: 'Doc Pages', description: '7 documentation guides' },
    { path: '/playground', name: 'Playground', description: 'Component testing (dev only)' },
    { path: '*', name: '404', description: 'Not found page' }
]

const scripts = [
    { cmd: 'pnpm dev', desc: 'Start Vite dev server (CSR)' },
    { cmd: 'pnpm dev:ssr', desc: 'Start Koa dev server (SSR)' },
    { cmd: 'pnpm build', desc: 'Build for production (CSR)' },
    { cmd: 'pnpm build:ssr', desc: 'Build for production (SSR)' },
    { cmd: 'pnpm test', desc: 'Run tests in watch mode' },
    { cmd: 'pnpm test:coverage', desc: 'Run tests with coverage' },
    { cmd: 'pnpm lint', desc: 'Lint code with ESLint' },
    { cmd: 'pnpm build:image', desc: 'Build Docker image' }
]

const techStack = [
    {
        category: 'Frontend',
        items: ['React 19', 'TypeScript 5.9', 'Tailwind CSS 4', 'React Router 7']
    },
    {
        category: 'State & Data',
        items: ['Redux Toolkit 2', 'Axios']
    },
    {
        category: 'Build & Dev',
        items: ['Vite 7', 'ESLint 9', 'Vitest', 'Testing Library']
    },
    {
        category: 'Server & Deploy',
        items: ['Koa 3', 'Docker', 'Nginx']
    }
]

export default function Docs()
{
    return (
        <>
            <title>Documentation &#8729; React Starter</title>
            <meta name="description" content="Comprehensive documentation for React Starter - covering installation, project structure, components, state management, routing, testing, and deployment." />
            <meta name="keywords" content="React, Documentation, Guide, Tutorial, Atomic Design" />
            <meta property="og:title" content="Documentation &#8729; React Starter" />
            <meta property="og:description" content="Comprehensive documentation for React Starter boilerplate." />
            <meta property="og:type" content="article" />

            <Layout>
                <div className="docs-container">
                    {/* Title Section */}
                <div className="docs-title-wrapper">
                    <h1 className="docs-title">📚 Documentation</h1>
                    <p className="docs-subtitle">
                        Everything you need to know about React Starter
                    </p>
                </div>

                {/* Features Section */}
                <section className="docs-section">
                    <h2 className="docs-section-title">✨ Features</h2>
                    <div className="docs-features-grid">
                        {features.map((feature) => (
                            <div key={feature.title} className="docs-feature-card">
                                {iconNames.includes(feature.icon as IconName) 
                                    ? <div className="flex justify-center items-center mb-2 h-12"><Icon name={feature.icon as IconName} size={30} /></div>
                                    : <span className="docs-feature-icon">{feature.icon}</span>
                                }
                                <h3 className="docs-feature-title">{feature.title}</h3>
                                <p className="docs-feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Documentation Links */}
                <section className="docs-section">
                    <h2 className="docs-section-title">📖 Guides</h2>
                    <div className="docs-grid">
                        {docs.map((doc) => (
                            <Link key={doc.title} to={doc.path} className="docs-card">
                                <span className="docs-card-icon">{doc.icon}</span>
                                <div className="docs-card-content">
                                    <h3 className="docs-card-title">{doc.title}</h3>
                                    <p className="docs-card-description">{doc.description}</p>
                                </div>
                                <span className="docs-card-arrow">→</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Sitemap Section */}
                <section className="docs-section">
                    <h2 className="docs-section-title">🗺️ Site Map</h2>
                    <div className="docs-table-container">
                        <table className="docs-table">
                            <thead>
                                <tr>
                                    <th>Path</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sitemap.map((route) => (
                                    <tr key={route.path}>
                                        <td>
                                            <code className="docs-code">{route.path}</code>
                                        </td>
                                        <td>{route.name}</td>
                                        <td>{route.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Quick Start Section */}
                <section className="docs-section">
                    <h2 className="docs-section-title">🚀 Quick Start</h2>
                    <div className="docs-code-block">
                        <pre className="docs-pre">
{`# Clone the repository
git clone https://github.com/rivaldys/react-starter.git
cd react-starter

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Or start with SSR
pnpm dev:ssr`}
                        </pre>
                    </div>
                </section>

                {/* Scripts Section */}
                <section className="docs-section">
                    <h2 className="docs-section-title">📜 Available Scripts</h2>
                    <div className="docs-scripts-grid">
                        {scripts.map((script) => (
                            <div key={script.cmd} className="docs-script-card">
                                <code className="docs-script-code">{script.cmd}</code>
                                <p className="docs-script-description">{script.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tech Stack Section */}
                <section className="docs-section">
                    <h2 className="docs-section-title">🛠️ Tech Stack</h2>
                    <div className="docs-tech-grid">
                        {techStack.map((group) => (
                            <div key={group.category} className="docs-tech-category">
                                <h4 className="docs-tech-category-title">{group.category}</h4>
                                <ul className="docs-tech-list">
                                    {group.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    </>
    )
}