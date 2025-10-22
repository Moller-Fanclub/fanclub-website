import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../public/images/MollerFC.png';
import './styles/NavigationBar.css';

interface NavItem {
    name: string;
    path: string;
}

const navItems: NavItem[] = [
    { name: 'Hjem', path: '/' },
    { name: 'Kalender', path: '/races' },
    { name: 'Merch', path: '/merch' },
];

const NavigationBar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="navbar">
            <nav className="navbar-container">
                <NavLink className="navbar-logo" to="/" onClick={() => setIsMenuOpen(false)}>
                    <img src={logo} alt="Møller Fanclub Logo" style={{ height: '50px' }} />
                </NavLink>
                <button
                    className={`navbar-toggle ${isMenuOpen ? 'open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    <span className="navbar-toggle-icon"></span>
                    <span className="navbar-toggle-icon"></span>
                    <span className="navbar-toggle-icon"></span>
                </button>
                <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `navbar-link ${isActive ? 'navbar-link-active' : ''}`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default NavigationBar;