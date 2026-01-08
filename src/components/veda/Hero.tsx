import React from 'react';

interface HeroProps {
  onBookConsultation: () => void;
  onLearnMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookConsultation, onLearnMore }) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://d64gsuwffb70l.cloudfront.net/69550825a301a2b0fa97fbbd_1767180435984_020a577c.jpg"
          alt="Elegant grandfather sharing wisdom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/90 via-[#1a2332]/70 to-[#1a2332]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse mr-3" />
            <span className="text-[#d4af37] text-sm tracking-wide">The Future of Legacy Preservation</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#f5f1e8] leading-tight mb-6">
            Preserve Wisdom.
            <br />
            <span className="text-[#d4af37]">Honor Legacy.</span>
            <br />
            Bridge Generations.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-[#f5f1e8]/80 leading-relaxed mb-10 max-w-2xl">
            Veda transforms your loved one's stories, wisdom, and life philosophy into an 
            interactive AI companion that future generations can consult for guidance—forever.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBookConsultation}
              className="group px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-semibold tracking-wide rounded-sm hover:from-[#e5c55a] hover:to-[#d4af37] transition-all shadow-xl shadow-[#d4af37]/30 flex items-center justify-center"
            >
              Begin Your Legacy Journey
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button
              onClick={onLearnMore}
              className="px-8 py-4 border-2 border-[#d4af37]/50 text-[#f5f1e8] font-medium tracking-wide rounded-sm hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch How It Works
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-[#d4af37]/20">
            <p className="text-[#f5f1e8]/50 text-sm mb-4 tracking-wide">TRUSTED BY FAMILIES WORLDWIDE</p>
            <div className="flex flex-wrap items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-serif text-[#d4af37]">2,500+</p>
                <p className="text-[#f5f1e8]/60 text-sm">Legacies Preserved</p>
              </div>
              <div className="w-px h-12 bg-[#d4af37]/20 hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-serif text-[#d4af37]">98%</p>
                <p className="text-[#f5f1e8]/60 text-sm">Family Satisfaction</p>
              </div>
              <div className="w-px h-12 bg-[#d4af37]/20 hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-serif text-[#d4af37]">50+</p>
                <p className="text-[#f5f1e8]/60 text-sm">Countries Served</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={() => {
            const element = document.getElementById('how-it-works');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }} 
          className="text-[#d4af37]/60 hover:text-[#d4af37] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

    </section>
  );
};

export default Hero;
