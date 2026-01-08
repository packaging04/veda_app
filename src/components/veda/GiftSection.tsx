import React from 'react';

interface GiftSectionProps {
  onBookConsultation: () => void;
}

const GiftSection: React.FC<GiftSectionProps> = ({ onBookConsultation }) => {
  const giftReasons = [
    {
      title: 'Milestone Birthdays',
      description: 'Honor their 70th, 80th, or 90th birthday with a gift that celebrates their entire life story.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
        </svg>
      ),
    },
    {
      title: 'Retirement',
      description: 'As they transition from career to legacy, help them reflect on decades of wisdom and experience.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Health Diagnosis',
      description: 'When time becomes precious, Veda helps capture what matters most before it\'s too late.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: 'Grandchild Arrival',
      description: 'Ensure the new generation will know their grandparents\' voices, stories, and guidance.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Holiday Gift',
      description: 'The most meaningful Christmas, Hanukkah, or anniversary gift you could ever give.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
    },
    {
      title: 'Just Because',
      description: 'You don\'t need a reason. Every day is a good day to start preserving the wisdom you love.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="gift" className="py-24 bg-gradient-to-b from-[#f5f1e8] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#d4af37] tracking-widest text-sm font-medium mb-4">THE PERFECT GIFT</p>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#1a2332] mb-6">
            Gift the Gift of Forever
          </h2>
          <p className="text-lg text-[#1a2332]/70 max-w-2xl mx-auto">
            Give your parents or grandparents the most meaningful gift imaginable—the chance to share 
            their wisdom with generations they may never meet.
          </p>
        </div>

        {/* Gift Occasions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {giftReasons.map((reason, index) => (
            <div
              key={index}
              className="group p-6 bg-white rounded-lg border border-[#1a2332]/10 hover:border-[#d4af37]/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-3 bg-[#d4af37]/10 rounded-lg text-[#d4af37] w-fit mb-4 group-hover:bg-[#d4af37] group-hover:text-white transition-colors">
                {reason.icon}
              </div>
              <h3 className="text-lg font-serif text-[#1a2332] mb-2">{reason.title}</h3>
              <p className="text-[#1a2332]/60 text-sm leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>

        {/* Gift Card Visual */}
        <div className="bg-[#1a2332] rounded-2xl p-8 lg:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-2xl" />
          
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-[#d4af37]/20 rounded-full mb-6">
                <svg className="w-4 h-4 text-[#d4af37] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span className="text-[#d4af37] text-sm font-medium">Digital Gift Certificate Available</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-serif text-[#f5f1e8] mb-6">
                Send a Veda Gift Certificate
              </h3>
              <p className="text-[#f5f1e8]/70 leading-relaxed mb-8">
                Not sure which plan is right? Send a beautifully designed digital gift certificate 
                and let your loved one choose their own legacy journey. Perfect for surprising 
                someone special without needing to coordinate schedules.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Delivered instantly via email',
                  'Personalized message included',
                  'Valid for any plan',
                  'Never expires',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center text-[#f5f1e8]/80">
                    <svg className="w-5 h-5 text-[#d4af37] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={onBookConsultation}
                className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-semibold rounded-sm hover:from-[#e5c55a] hover:to-[#d4af37] transition-all shadow-xl"
              >
                Purchase Gift Certificate
              </button>
            </div>

            {/* Gift Card Preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#d4af37] to-[#c9a227] rounded-2xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <svg width="32" height="32" viewBox="0 0 48 48" className="text-[#1a2332]">
                      <path d="M8 12 L24 38 L40 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="ml-2 text-lg font-serif tracking-wider text-[#1a2332]">VEDA</span>
                  </div>
                  <span className="text-[#1a2332]/60 text-sm">Gift Certificate</span>
                </div>
                <div className="mb-8">
                  <p className="text-[#1a2332]/60 text-sm mb-1">This certificate entitles</p>
                  <p className="text-2xl font-serif text-[#1a2332]">Your Loved One</p>
                </div>
                <div className="mb-8">
                  <p className="text-[#1a2332]/60 text-sm mb-1">To a complete</p>
                  <p className="text-xl font-serif text-[#1a2332]">Legacy Preservation Journey</p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[#1a2332]/60 text-xs">From</p>
                    <p className="text-[#1a2332] font-medium">With All My Love</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#1a2332]/60 text-xs">Value</p>
                    <p className="text-2xl font-serif text-[#1a2332]">$349+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftSection;
