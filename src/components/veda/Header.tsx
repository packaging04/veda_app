import React, { useState } from "react";

interface HeaderProps {
  onNavigate: (section: string) => void;
  onRequestDemo: () => void;
  onOpenAuth?: () => void;
  user?: any;
  onOpenDashboard?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onRequestDemo,
  onOpenAuth,
  user,
  onOpenDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "How It Works", section: "how-it-works" },
    { label: "The Experience", section: "experience" },
    { label: "For Families", section: "families" },
    { label: "Pricing", section: "pricing" },
    { label: "Stories", section: "testimonials" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a2332]/95 backdrop-blur-md border-b border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate("hero")}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              className="text-[#d4af37]"
            >
              <path
                d="M8 12 L24 38 L40 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 20 Q8 24 4 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M44 20 Q40 24 44 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M20 38 Q24 42 28 38"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="ml-3 text-2xl font-serif tracking-wider text-[#d4af37] group-hover:text-[#e5c55a] transition-colors">
              VEDA
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => onNavigate(item.section)}
                className="text-[#f5f1e8]/80 hover:text-[#d4af37] transition-colors text-sm tracking-wide font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-2 px-4 py-2 text-[#d4af37] hover:text-[#e5c55a] text-sm font-medium tracking-wide transition-colors border border-[#d4af37]/30 rounded-full hover:border-[#d4af37]"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                My Dashboard
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-[#f5f1e8]/60 hover:text-[#d4af37] text-sm font-medium transition-colors"
              >
                Sign In
              </button>
            )}
            <button
              onClick={onRequestDemo}
              className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] text-sm font-bold tracking-wide rounded-full hover:from-[#e5c55a] hover:to-[#d4af37] transition-all shadow-lg shadow-[#d4af37]/20 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Request a Demo
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#d4af37]"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#d4af37]/20">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => {
                    onNavigate(item.section);
                    setMobileMenuOpen(false);
                  }}
                  className="text-[#f5f1e8]/80 hover:text-[#d4af37] transition-colors text-left py-2"
                >
                  {item.label}
                </button>
              ))}
              {user ? (
                <button
                  onClick={() => {
                    onOpenDashboard?.();
                    setMobileMenuOpen(false);
                  }}
                  className="text-[#d4af37] hover:text-[#e5c55a] text-left py-2 font-medium"
                >
                  My Dashboard
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth?.();
                    setMobileMenuOpen(false);
                  }}
                  className="text-[#f5f1e8]/70 hover:text-[#d4af37] text-left py-2"
                >
                  Sign In
                </button>
              )}
              <button
                onClick={() => {
                  onRequestDemo();
                  setMobileMenuOpen(false);
                }}
                className="mt-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-bold rounded-full flex items-center gap-2 justify-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Request a Demo
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
