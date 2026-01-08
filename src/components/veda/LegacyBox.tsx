import React from 'react';

interface LegacyBoxProps {
  onBookConsultation: () => void;
}

const LegacyBox: React.FC<LegacyBoxProps> = ({ onBookConsultation }) => {
  const boxContents = [
    {
      title: 'Heritage Journal',
      description: 'Navy linen-bound journal with gold foil embossing for handwritten reflections',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'Professional Microphone',
      description: 'Vintage-style gold microphone for crystal-clear voice recordings',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      title: 'Legacy USB Archive',
      description: 'Premium leather-bound case containing all recordings and the wisdom model',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
    },
    {
      title: 'Family Tree Canvas',
      description: 'Beautifully illustrated family tree ready for your unique story',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="experience" className="py-24 bg-[#1a2332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#d4af37]/20 to-transparent rounded-lg blur-2xl" />
            <img
              src="https://d64gsuwffb70l.cloudfront.net/69550825a301a2b0fa97fbbd_1767180464160_e60dfe3a.png"
              alt="The Veda Legacy Box"
              className="relative rounded-lg shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-[#d4af37] text-[#1a2332] px-6 py-3 rounded-lg shadow-xl">
              <p className="text-sm font-medium">Included with Heritage & Eternal Plans</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-[#d4af37] tracking-widest text-sm font-medium mb-4">THE VEDA EXPERIENCE</p>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#f5f1e8] mb-6">
              More Than an App—<br />
              <span className="text-[#d4af37]">A Treasured Heirloom</span>
            </h2>
            <p className="text-lg text-[#f5f1e8]/70 leading-relaxed mb-10">
              The Veda Legacy Box transforms your digital investment into a tangible family treasure. 
              Each element is crafted to honor the gravity of preserving a life's wisdom.
            </p>

            {/* Box Contents */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {boxContents.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 bg-[#d4af37]/10 rounded-lg text-[#d4af37]">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-[#f5f1e8] font-medium mb-1">{item.title}</h4>
                    <p className="text-[#f5f1e8]/50 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onBookConsultation}
              className="group px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-semibold tracking-wide rounded-sm hover:from-[#e5c55a] hover:to-[#d4af37] transition-all shadow-xl shadow-[#d4af37]/30 flex items-center"
            >
              Reserve Your Legacy Box
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacyBox;
