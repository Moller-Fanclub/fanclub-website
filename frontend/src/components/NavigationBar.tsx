import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.css';

interface NavItem {
    name: string;
    path: string;
}

const navItems: NavItem[] = [
    { name: 'Hjem', path: '/' },
    { name: 'Kalender', path: '/races' },
    { name: 'Om Oss', path: '/about' },
    { name: 'Merch', path: '/merch' },
];

const NavigationBar: React.FC = () => {
    return (
        <header className="navbar">
            <nav className="navbar-container">
                <div className="navbar-logo">
                    Møller Fanclub
                </div>
                <ul className="navbar-menu">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `navbar-link ${isActive ? 'navbar-link-active' : ''}`
                                }
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