import { routes } from '@/router'
import { Link } from 'react-router-dom'
import './index.css'

const Layout = ({ children }) =>
{
    const filteredRoutes = routes.filter(route => route.meta.navbar && route.meta.navbar.type === 'topbar')
    const sortedRoutes = filteredRoutes.sort((a, b) => a.meta.navbar.order - b.meta.navbar.order)

    const year = new Date().getFullYear()

    return (
        <div className="layout">
            <header>
                <nav className="navbar-wrapper">
                    <ul className="navbar">
                        {sortedRoutes.map((route, index) => (
                            <li className="nav-item" key={`nav-item_${index+1}`}>
                                <Link className="nav-link" to={route.path}>{route.name}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            <main className="content">
                {children}
            </main>

            <footer className="footer">
                <p>&copy; 2022-{year} React Starter v1.2.0 by <a className="profile-link" href="https://rivaldy.net" target="_blank">Ahmad Rivaldy S</a></p>
            </footer>
        </div>
    )
}

export default Layout