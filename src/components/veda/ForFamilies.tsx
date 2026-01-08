import React from 'react';

const ForFamilies: React.FC = () => {
  const audiences = [
    {
      title: 'For Adult Children',
      subtitle: 'The Gift of Forever',
      description: 'Give your parents the most meaningful gift imaginable—the chance to share their wisdom with grandchildren they may never meet. Set up scheduled calls, customize questions, and watch as their legacy takes shape.',
      image: 'https://d64gsuwffb70l.cloudfront.net/69550825a301a2b0fa97fbbd_1767180517552_720502db.jpg',
      features: ['Schedule calls on their behalf', 'Customize interview questions', 'Monitor progress remotely'],
    },
    {
      title: 'For Grandparents',
      subtitle: 'Your Voice, Your Legacy',
      description: 'No technology skills required. Simply answer the phone when Veda calls, and share your stories naturally. Our AI interviewer feels like talking to an old friend who truly wants to understand your life.',
      image: 'https://d64gsuwffb70l.cloudfront.net/69550825a301a2b0fa97fbbd_1767180496131_607aa910.jpg',
      features: ['Simple phone-based experience', 'Empathetic AI conversations', 'No apps or devices needed'],
    },
    {
      title: 'For Future Generations',
      subtitle: 'Wisdom That Lives On',
      description: 'Imagine asking your great-grandmother for advice on your wedding day, or consulting your grandfather\'s business wisdom decades after he\'s gone. Veda makes this possible.',
      image: 'https://d64gsuwffb70l.cloudfront.net/69550825a301a2b0fa97fbbd_1767180480446_16135eff.jpg',
      features: ['Interactive consultations', 'Authentic voice & personality', 'Accessible anytime, anywhere'],
    },
  ];

  return (
    <section id="families" className="py-24 bg-[#f5f1e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#d4af37] tracking-widest text-sm font-medium mb-4">FOR EVERY GENERATION</p>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#1a2332] mb-6">
            Bridging Hearts Across Time
          </h2>
          <p className="text-lg text-[#1a2332]/70 max-w-2xl mx-auto">
            Veda serves every member of your family, from the wisdom-keepers to the wisdom-seekers
          </p>
        </div>

        {/* Audience Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={audience.image}
                  alt={audience.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332] to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[#d4af37] text-sm tracking-wide">{audience.subtitle}</p>
                  <h3 className="text-2xl font-serif text-[#f5f1e8]">{audience.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-[#1a2332]/70 leading-relaxed mb-6">
                  {audience.description}
                </p>
                <ul className="space-y-2">
                  {audience.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-[#1a2332]/60">
                      <svg className="w-4 h-4 text-[#d4af37] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Emotional Quote */}
        <div className="mt-20 text-center">
          <div className="relative inline-block">
            <svg className="absolute -top-8 -left-8 w-16 h-16 text-[#d4af37]/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="text-2xl sm:text-3xl font-serif text-[#1a2332] italic max-w-3xl">
              "The greatest inheritance isn't wealth—it's wisdom. Veda ensures that inheritance is never lost."
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForFamilies;
