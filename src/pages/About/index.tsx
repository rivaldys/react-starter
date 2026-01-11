import { Layout } from '@/components'
import { Link } from 'react-router-dom'
import './index.css'

export default function About()
{
    return (
        <Layout>
            <div className="about-container">
                {/* Title Section */}
                <div className="about-title-wrapper">
                    <h1 className="about-title">About React Starter 🚀</h1>
                    <p className="about-description">
                        A React boilerplate with Atomic Design methodology.
                    </p>
                </div>
                
                <p className="leading-6.25 mb-5!">
                    A modern, production-ready React boilerplate with <strong><em>Atomic Design methodology</em></strong>, 
                    <strong><em> Server-Side Rendering (SSR)</em></strong> support (default: Client-Side Rendering (CSR)), and comprehensive tooling for building scalable web applications.
                </p>

                <p className="leading-6.25 mb-5!">
                    <span className="highlight">&gt; Main Idea</span>
                    The main idea of this boilerplate is to bundle everything you need when starting a frontend project — 
                    without manually configuring routing, state management, fetching, directory structure, and more.
                </p>

                <p className="leading-6.25 mb-5!">
                    <span className="highlight">&gt; Why Atomic Design?</span>
                    <strong>Atomic Design</strong> is a methodology that categorizes components from smallest to largest 
                    (hence "atomic", borrowed from physics). In frontend development, prioritizing <strong>reusable components</strong> leads 
                    to better maintainability, consistency, and developer experience. This boilerplate implements Atomic Design in its directory structure:
                </p>

                <div className="about-content">
                    <pre>
                        <code>{`components/
├── atoms/       # Basic building blocks (Button, Input, Icon)
├── molecules/   # Simple combinations (SearchBar, FormField)
├── organisms/   # Complex components (Header, Sidebar)
└── templates/   # Page layouts (Layout, AuthLayout)`}</code>
                    </pre>
                </div>

                <p>
                    <span className="highlight">&gt; Learn More</span>
                    Check out the <Link to="/docs" style={{ color: '#818cf8', textDecoration: 'underline' }}>Documentation</Link> for 
                    detailed guides on project structure, components, state management, routing, testing, and deployment.
                </p>
            </div>
        </Layout>
    )
}