import React, { useState } from 'react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  onBookConsultation: () => void;
  onOpenAuth?: () => void;
  user?: any;
  onOpenDashboard?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onBookConsultation, onOpenAuth, user, onOpenDashboard }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'How It Works', section: 'how-it-works' },
    { label: 'The Experience', section: 'experience' },
    { label: 'For Families', section: 'families' },
    { label: 'Pricing', section: 'pricing' },
    { label: 'Stories', section: 'testimonials' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a2332]/95 backdrop-blur-md border-b border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('hero')}>
            <svg width="48" height="48" viewBox="0 0 48 48" className="text-[#d4af37]">
              <path d="M8 12 L24 38 L40 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 20 Q8 24 4 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M44 20 Q40 24 44 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M20 38 Q24 42 28 38" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ml-3 text-2xl font-serif tracking-wider text-[#d4af37] group-hover:text-[#e5c55a] transition-colors">VEDA</span>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button key={item.section} onClick={() => onNavigate(item.section)} className="text-[#f5f1e8]/80 hover:text-[#d4af37] transition-colors text-sm tracking-wide font-medium">
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <button onClick={onOpenDashboard} className="text-[#d4af37] hover:text-[#e5c55a] text-sm font-medium tracking-wide transition-colors">
                My Dashboard
              </button>
            ) : (
              <button onClick={onOpenAuth} className="text-[#f5f1e8]/80 hover:text-[#d4af37] text-sm font-medium tracking-wide transition-colors">
                Sign In
              </button>
            )}
            <button onClick={onBookConsultation} className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] text-sm font-semibold tracking-wide rounded-sm hover:from-[#e5c55a] hover:to-[#d4af37] transition-all shadow-lg shadow-[#d4af37]/20">
              Book Consultation
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-[#d4af37]">
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#d4af37]/20">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button key={item.section} onClick={() => { onNavigate(item.section); setMobileMenuOpen(false); }} className="text-[#f5f1e8]/80 hover:text-[#d4af37] transition-colors text-left py-2">
                  {item.label}
                </button>
              ))}
              {user ? (
                <button onClick={() => { onOpenDashboard?.(); setMobileMenuOpen(false); }} className="text-[#d4af37] hover:text-[#e5c55a] text-left py-2">My Dashboard</button>
              ) : (
                <button onClick={() => { onOpenAuth?.(); setMobileMenuOpen(false); }} className="text-[#f5f1e8]/80 hover:text-[#d4af37] text-left py-2">Sign In</button>
              )}
              <button onClick={() => { onBookConsultation(); setMobileMenuOpen(false); }} className="mt-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-semibold rounded-sm">
                Book Consultation
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
