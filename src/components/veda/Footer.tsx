import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onNavigate: (section: string) => void;
  onBookConsultation: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onBookConsultation }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  // Links that scroll to sections on the landing page
  const productLinks = [
    { label: 'How It Works', section: 'how-it-works' },
    { label: 'The Legacy Box', section: 'experience' },
    { label: 'Pricing', section: 'pricing' },
    { label: 'For Families', section: 'families' },
    { label: 'Technology', section: 'technology' },
  ];

  // Links that go to separate pages
  const companyLinks = [
    { label: 'About Veda', path: '/about' },
    { label: 'Our Story', path: '/our-story' },
    { label: 'Contact', path: '/contact' },
  ];

  // Resource links - some go to pages, some scroll
  const resourceLinks = [
    { label: 'FAQ', section: 'faq' },
  ];

  // Legal links that go to separate pages
  const legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ];

  return (
    <footer className="bg-[#1a2332] pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Banner */}
        <div className="relative bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/5 rounded-2xl p-8 lg:p-12 mb-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-serif text-[#f5f1e8] mb-4">
                Begin Your Family's Legacy Journey Today
              </h3>
              <p className="text-[#f5f1e8]/70">
                Every day that passes is wisdom that could be lost. Start preserving your family's stories now.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <button
                onClick={onBookConsultation}
                className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-semibold rounded-sm hover:from-[#e5c55a] hover:to-[#d4af37] transition-all shadow-xl"
              >
                Book Free Consultation
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className="px-8 py-4 border-2 border-[#d4af37]/50 text-[#f5f1e8] font-medium rounded-sm hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            {/* Logo */}
            <Link to="/" className="flex items-center mb-6">
              <svg width="40" height="40" viewBox="0 0 48 48" className="text-[#d4af37]">
                <path d="M8 12 L24 38 L40 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 20 Q8 24 4 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <path d="M44 20 Q40 24 44 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <path d="M20 38 Q24 42 28 38" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="ml-3 text-xl font-serif tracking-wider text-[#d4af37]">VEDA</span>
            </Link>
            <p className="text-[#f5f1e8]/60 mb-6 max-w-xs">
              Preserving wisdom across generations through AI-powered legacy conversations.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-[#f5f1e8] font-medium mb-3">Stay Connected</p>
              {subscribed ? (
                <p className="text-[#d4af37] text-sm">Thank you for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-[#f5f1e8]/10 border border-[#d4af37]/20 rounded-l-sm text-[#f5f1e8] placeholder-[#f5f1e8]/40 focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#d4af37] text-[#1a2332] font-medium rounded-r-sm hover:bg-[#e5c55a] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-[#f5f1e8] font-medium mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => onNavigate(link.section)}
                    className="text-[#f5f1e8]/60 hover:text-[#d4af37] transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-[#f5f1e8] font-medium mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-[#f5f1e8]/60 hover:text-[#d4af37] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-[#f5f1e8] font-medium mb-4">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => onNavigate(link.section)}
                    className="text-[#f5f1e8]/60 hover:text-[#d4af37] transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-[#f5f1e8] font-medium mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-[#f5f1e8]/60 hover:text-[#d4af37] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#d4af37]/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#f5f1e8]/40 text-sm">
              © 2025 Veda Legacy Technologies. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {[
                { name: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { name: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { name: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z' },
                { name: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z' },
              ].map((social, index) => (
                <button
                  key={index}
                  className="p-2 text-[#f5f1e8]/40 hover:text-[#d4af37] transition-colors"
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={social.path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
