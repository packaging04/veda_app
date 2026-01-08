import React from 'react';

interface FinalCTAProps {
  onBookConsultation: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onBookConsultation }) => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://d64gsuwffb70l.cloudfront.net/69550825a301a2b0fa97fbbd_1767180623996_2376fc7c.png"
          alt="Family generations together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1a2332]/85" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-[#d4af37]/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f5f1e8] mb-6">
          Every Day That Passes Is<br />
          <span className="text-[#d4af37]">Wisdom That Could Be Lost</span>
        </h2>

        {/* Subtext */}
        <p className="text-lg text-[#f5f1e8]/70 max-w-2xl mx-auto mb-10">
          Don't wait until it's too late. Start preserving your family's stories, 
          wisdom, and legacy today. Future generations will thank you.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBookConsultation}
            className="group px-10 py-5 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] text-lg font-semibold tracking-wide rounded-sm hover:from-[#e5c55a] hover:to-[#d4af37] transition-all shadow-xl shadow-[#d4af37]/30 flex items-center justify-center"
          >
            Begin Your Legacy Journey
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <a
            href="tel:+1-800-VEDA-NOW"
            className="px-10 py-5 border-2 border-[#d4af37]/50 text-[#f5f1e8] text-lg font-medium tracking-wide rounded-sm hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call 1-800-VEDA-NOW
          </a>
        </div>

        {/* Urgency Note */}
        <p className="mt-8 text-[#d4af37]/80 text-sm">
          Free 30-minute consultation • No obligation • Start preserving today
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
