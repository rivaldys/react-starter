import { Link } from 'react-router-dom'
import { Layout } from '@/components'
import './DocLayout.css'

interface DocLayoutProps {
    title: string
    icon: string
    children: React.ReactNode
}

const docNav = [
    { path: '/docs/getting-started', title: 'Getting Started', icon: '🚀' },
    { path: '/docs/project-structure', title: 'Project Structure', icon: '📁' },
    { path: '/docs/components', title: 'Components', icon: '🧩' },
    { path: '/docs/state-management', title: 'State Management', icon: '🔄' },
    { path: '/docs/routing', title: 'Routing', icon: '🧭' },
    { path: '/docs/testing', title: 'Testing', icon: '🧪' },
    { path: '/docs/deployment', title: 'Deployment', icon: '🐳' }
]

export default function DocLayout({ title, icon, children }: DocLayoutProps)
{
    return (
        <Layout>
            <div className="doc-layout">
                <div className="doc-layout-wrapper">
                    {/* Sidebar */}
                    <aside className="doc-sidebar">
                        <div className="doc-sidebar-sticky">
                            <Link to="/docs" className="doc-back-link">
                                ← Back to Docs
                            </Link>
                            <nav className="doc-nav">
                                {docNav.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`doc-nav-item ${item.title === title ? 'active' : ''}`}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.title}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="doc-main">
                        {/* Mobile back button */}
                        <Link to="/docs" className="doc-mobile-back">
                            ← Back to Docs
                        </Link>

                        {/* Header */}
                        <header className="doc-header">
                            <div className="doc-header-title">
                                <span className="doc-header-icon">{icon}</span>
                                <h1>{title}</h1>
                            </div>
                        </header>

                        {/* Content */}
                        <article className="doc-content">
                            {children}
                        </article>
                    </main>
                </div>
            </div>
        </Layout>
    )
}
