import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

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

    const closeMenu = () => setIsMenuOpen(false);

    const navLinkClasses = ({ isActive }: { isActive: boolean }) => [
        'relative block px-3 py-2 text-lg font-medium text-white transition-colors duration-200 hover:text-blue-100',
        isActive ? 'font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-white' : '',
    ].join(' ');

    const logoSrc = '/images/MollerFC.png';

    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-linear-to-r from-blue-600 to-indigo-600 shadow">
            <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                <NavLink to="/" onClick={closeMenu} className="shrink-0">
                    <img src={logoSrc} alt="Møller Fanclub Logo" className="h-12 w-auto" />
                </NavLink>
                
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-white/40 text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:hidden"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span
                            className={`block h-0.5 w-6 bg-white transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}
                        ></span>
                        <span
                            className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                        ></span>
                        <span
                            className={`block h-0.5 w-6 bg-white transition-transform duration-300 ease-in-out ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}
                        ></span>
                    </button>
                </div>
                
                <ul
                    className={`${isMenuOpen ? 'flex' : 'hidden'
                        } absolute left-0 right-0 top-full flex-col gap-2 bg-blue-600/95 px-6 py-4 shadow-lg md:static md:flex md:flex-row md:items-center md:gap-8 md:bg-transparent md:px-0 md:py-0 md:shadow-none`}
                >
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={navLinkClasses}
                                onClick={closeMenu}
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