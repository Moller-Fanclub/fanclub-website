import React, { useState } from 'react';

interface NavigationBarProps {
  showBranding?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ showBranding = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Different styling for homepage vs other pages
  const isHomePage = !showBranding;
  const menuBgClass = isHomePage 
    ? "bg-black/70 backdrop-blur-xl" 
    : "bg-gray-900/95 backdrop-blur-md";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        {/* Logo/Brand - Only shown when showBranding is true */}
        {showBranding ? (
          <a href="/" className="text-white font-bold text-2xl hover:text-blue-200 transition-colors drop-shadow-md">
            Møller Fanclub
          </a>
        ) : (
          <div></div>
        )}
        
        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-8">
          <li><a href="/races" className="text-white font-semibold text-xl hover:text-blue-200 transition-colors drop-shadow-md">Kalender</a></li>
          <li><a href="/resultater" className="text-white font-semibold text-xl hover:text-blue-200 transition-colors drop-shadow-md">Resultater</a></li>
          <li><a href="/kommer-snart" className="text-white font-semibold text-xl hover:text-blue-200 transition-colors drop-shadow-md">Merch</a></li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden text-white bg-white/20 backdrop-blur-sm rounded-lg p-2 hover:bg-white/30 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className={`md:hidden ${menuBgClass} border-t border-white/20 shadow-xl`}>
          <ul className="flex flex-col px-6 py-4 gap-4">
            <li>
              <a 
                href="/races" 
                className="block text-white font-semibold text-lg hover:text-blue-200 transition-colors py-2 drop-shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Kalender
              </a>
            </li>
            <li>
              <a 
                href="/resultater" 
                className="block text-white font-semibold text-lg hover:text-blue-200 transition-colors py-2 drop-shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Resultater
              </a>
            </li>
            <li>
              <a 
                href="/kommer-snart" 
                className="block text-white font-semibold text-lg hover:text-blue-200 transition-colors py-2 drop-shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Merch
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default NavigationBar;