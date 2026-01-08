import React from 'react';

const Technology: React.FC = () => {
  const features = [
    {
      title: 'Expert AI Interviewer',
      description: 'Our AI operates as a professional life story interviewer, using empathy, active listening, and narrative techniques to encourage meaningful conversation.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      title: 'Layered Questioning',
      description: 'Questions lead to deeper questions. We dig into the subtext of every answer to understand not just what happened, but how your loved one thinks.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      title: 'Emotional Intelligence',
      description: 'Veda analyzes tone, vocal speed, and emotional markers to understand personality traits—whether calm, passionate, spiritual, or logical.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: 'Behavioral Mapping',
      description: 'For video sessions, we analyze movement patterns and physical expressions to capture the complete essence of how someone communicates.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Wisdom Extraction Engine',
      description: 'We don\'t just record stories—we extract the wisdom. Understanding why decisions were made and what lessons were learned.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Dynamic Response System',
      description: 'The final AI replica doesn\'t play recordings—it generates responses using the exact logical and emotional framework of your loved one.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 bg-[#1a2332] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <img
          src="https://d64gsuwffb70l.cloudfront.net/69550825a301a2b0fa97fbbd_1767180640329_83d33936.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#d4af37] tracking-widest text-sm font-medium mb-4">THE TECHNOLOGY</p>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#f5f1e8] mb-6">
            Ancient Wisdom Meets<br />
            <span className="text-[#d4af37]">Modern Intelligence</span>
          </h2>
          <p className="text-lg text-[#f5f1e8]/70 max-w-2xl mx-auto">
            Our proprietary AI system is designed specifically for the sacred task of preserving human wisdom
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-[#f5f1e8]/5 rounded-lg border border-[#d4af37]/10 hover:border-[#d4af37]/30 hover:bg-[#f5f1e8]/10 transition-all duration-300"
            >
              <div className="text-[#d4af37] mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-serif text-[#f5f1e8] mb-3">{feature.title}</h3>
              <p className="text-[#f5f1e8]/60 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Security Badge */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 pt-12 border-t border-[#d4af37]/20">
          {[
            { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: 'End-to-End Encrypted' },
            { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'HIPAA Compliant' },
            { icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', label: 'Secure Cloud Storage' },
            { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Lifetime Preservation' },
          ].map((badge, index) => (
            <div key={index} className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={badge.icon} />
              </svg>
              <span className="text-[#f5f1e8]/70 text-sm">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technology;
