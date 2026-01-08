import React from 'react';

const TrustBadges: React.FC = () => {
  const badges = [
    {
      title: 'Featured In',
      logos: [
        { name: 'Forbes', text: 'Forbes' },
        { name: 'TechCrunch', text: 'TechCrunch' },
        { name: 'Wired', text: 'WIRED' },
        { name: 'Fast Company', text: 'Fast Company' },
      ],
    },
  ];

  const awards = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: 'Best GriefTech Innovation',
      subtitle: 'TechCrunch Disrupt 2024',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: 'Editor\'s Choice',
      subtitle: 'Product Hunt 2024',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'SOC 2 Certified',
      subtitle: 'Enterprise Security',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Family Approved',
      subtitle: '98% Satisfaction Rate',
    },
  ];

  return (
    <section className="py-16 bg-[#f5f1e8] border-y border-[#1a2332]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Press Logos */}
        <div className="text-center mb-12">
          <p className="text-[#1a2332]/40 text-sm tracking-widest mb-8">AS FEATURED IN</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {badges[0].logos.map((logo, index) => (
              <span
                key={index}
                className="text-xl lg:text-2xl font-serif text-[#1a2332]/30 hover:text-[#1a2332]/60 transition-colors cursor-default"
              >
                {logo.text}
              </span>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-[#d4af37] mx-auto mb-3 flex justify-center">
                {award.icon}
              </div>
              <h4 className="text-[#1a2332] font-medium text-sm mb-1">{award.title}</h4>
              <p className="text-[#1a2332]/50 text-xs">{award.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
