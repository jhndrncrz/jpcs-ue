import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ModeToggle } from './ModeToggle';
import navbarLogo from '../assets/icon-full.png';
import { Menu, X } from 'lucide-react';
import Marquee from './ui/Marquee';

const Logo = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex justify-center items-center gap-1 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={navbarLogo} 
        alt="JPCS UE Manila Logo" 
        className="h-10 w-10 object-contain transition-transform duration-500 group-hover:scale-110 logo-shadow" 
      />
      <span className="font-logo text-2xl flex items-center h-10 tracking-tight" style={{ marginTop: "-0.2rem"}}>
        <span className="text-[var(--logo-brackets)] transition-colors duration-300">&lt;</span>
        <span 
          className="text-[var(--logo-text)] overflow-hidden transition-all duration-700 ease-in-out whitespace-nowrap relative flex items-center px-0.5"
          style={{ maxWidth: isHovered ? '320px' : '48px' }}
        >
            <span className={`transition-all duration-500 whitespace-nowrap ${isHovered ? 'opacity-0 scale-90 blur-sm pointer-events-none absolute' : 'opacity-100 scale-100 blur-0'}`}>
              jpcs
            </span>
            
            <span className={`inline-block whitespace-nowrap transition-all duration-500 ${isHovered ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm absolute'}`}>
                <Marquee speed={40} pauseOnHover={false} className="lowercase tracking-tighter">
                  junior-philippine-computer-society &nbsp;&nbsp;&nbsp;
                </Marquee>
            </span>
        </span>
        <span className="text-[var(--logo-brackets)] transition-colors duration-300">/&gt;</span>
      </span>
    </div>
  );
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    const base = "font-heading font-medium text-sm transition-colors relative tracking-wide text-[var(--foreground)] hover:text-[var(--primary)] py-1";
    const active = " text-[var(--primary)]";
    const underline = " after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:transition-all after:duration-300 after:bg-gradient-to-r after:from-[var(--c-orange)] after:to-[var(--c-yellow)]";
    
    if (location.pathname === path) {
        return `${base}${active}${underline} after:w-full`;
    }
    return `${base}${underline} after:w-0 hover:after:w-full`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-2 border-[var(--c-red-dark)] dark:border-[var(--c-orange-fire)] bg-white/90 dark:bg-[#0D0505]/95 backdrop-blur-md shadow-sm transition-colors duration-300 h-20">
      <div className="container mx-auto h-full flex items-center justify-between px-6">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 no-underline"
          onClick={() => setIsOpen(false)}
        >
          <Logo />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/about" className={isActive('/about')}>About Us</Link>
          <Link to="/contacts" className={isActive('/contacts')}>Contacts</Link>
          <Link to="/tools" className={isActive('/tools')}>Student Tools</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          
          <button 
            className="md:hidden text-[var(--foreground)]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[var(--background)] border-b border-[var(--border)] p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-4">
          <Link to="/" className={isActive('/')} onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className={isActive('/about')} onClick={() => setIsOpen(false)}>About Us</Link>
          <Link to="/contacts" className={isActive('/contacts')} onClick={() => setIsOpen(false)}>Contacts</Link>
          <Link to="/tools" className={isActive('/tools')} onClick={() => setIsOpen(false)}>Student Tools</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
