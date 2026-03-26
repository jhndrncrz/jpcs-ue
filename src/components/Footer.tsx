import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 pt-16 pb-8 mt-auto border-t-[3px] border-[var(--c-orange)] bg-[image:var(--gradient-main)] dark:bg-none dark:bg-[#120505] text-[var(--c-light-surface)] dark:text-[var(--foreground)] transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: About */}
          <div className="md:col-span-1">
             <h4 className="text-[var(--c-yellow)] font-bold mb-5 uppercase tracking-widest text-sm font-heading">
                JPCS UE Manila
             </h4>
             <p className="opacity-80 mb-4 leading-relaxed text-sm">
               The premier student organization for future IT professionals at the University of the East Manila.
             </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-[var(--c-yellow)] font-bold mb-5 uppercase tracking-widest text-sm font-heading">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="opacity-80 hover:opacity-100 hover:text-[var(--c-yellow)] hover:translate-x-1 transition-all text-sm">Home</Link>
              <Link to="/about" className="opacity-80 hover:opacity-100 hover:text-[var(--c-yellow)] hover:translate-x-1 transition-all text-sm">About Us</Link>
              <Link to="/contacts" className="opacity-80 hover:opacity-100 hover:text-[var(--c-yellow)] hover:translate-x-1 transition-all text-sm">Contacts</Link>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="md:col-span-1">
             <h4 className="text-[var(--c-yellow)] font-bold mb-5 uppercase tracking-widest text-sm font-heading">
               Contact
             </h4>
             <p className="opacity-80 text-sm mb-2">Recto Ave, Sampaloc, Manila</p>
             <div className="flex items-center gap-2 opacity-80 text-sm hover:opacity-100 hover:text-[var(--c-yellow)] transition-colors cursor-pointer">
               <Mail size={16} />
               <span>jpcs.uemanila@gmail.com</span>
             </div>
          </div>

          {/* Column 4: Socials */}
          <div className="md:col-span-1">
            <h4 className="text-[var(--c-yellow)] font-bold mb-5 uppercase tracking-widest text-sm font-heading">
              Follow Us
            </h4>
            <div className="flex gap-3 mt-5">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 bg-white/10 dark:bg-white/5 flex items-center justify-center text-white dark:text-[var(--foreground)] transition-all hover:bg-[var(--c-orange)] hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--c-orange)]/50"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-white/10 dark:border-white/5 opacity-50 text-xs">
          © {new Date().getFullYear()} Junior Philippine Computer Society - UE Manila. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
