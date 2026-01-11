import { routes } from '@/router'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './index.css'

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) =>
{
    const filteredRoutes = routes.filter(route => route.meta?.navbar !== undefined)
    const sortedRoutes = filteredRoutes.sort((a, b) => {
        const orderA = a.meta?.navbar?.order ?? 0
        const orderB = b.meta?.navbar?.order ?? 0
        return orderA - orderB
    })

    const year = new Date().getFullYear()

    return (
        <div className="layout">
            <header>
                <nav className="navbar-wrapper">
                    <ul className="navbar">
                        {sortedRoutes.map((route, index) => (
                            <li className="nav-item" key={`nav-item_${index+1}`}>
                                <Link className="nav-link" to={route.path ?? ''}>{route.name}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="h-13.75! flex items-center justify-center text-[14px]">
                <p className="mb-3.75 text-[#888888]!">&copy; 2022-{year} React Starter v2.0.0 by <a className="text-[#999999]! font-medium transition duration-300 hover:opacity-80" href="https://rivaldy.net" target="_blank">Ahmad Rivaldy S</a></p>
            </footer>
        </div>
    )
}

export default Layout