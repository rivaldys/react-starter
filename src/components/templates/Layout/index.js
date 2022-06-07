import { Link } from 'react-router-dom'
import logo from '../../../logo.svg'
import './layout.css'

const Layout = ({ children }) =>
{
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>React App</p>

                <ul className="App-menu">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/contact">Contact</Link>
                    </li>
                </ul>
                {children}
            </header>
        </div>
    )
}

export default Layout