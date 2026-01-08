import React from 'react';

const ComparisonSection: React.FC = () => {
  const comparisons = [
    {
      traditional: 'Written memoirs that sit unread on shelves',
      veda: 'Interactive wisdom you can consult anytime',
    },
    {
      traditional: 'Static video recordings with no interaction',
      veda: 'Dynamic AI that responds to new questions',
    },
    {
      traditional: 'Scattered photos with forgotten stories',
      veda: 'Every photo connected to its full narrative',
    },
    {
      traditional: 'Memories that fade with each generation',
      veda: 'Wisdom preserved in their exact voice and style',
    },
    {
      traditional: 'One-time interviews that miss important details',
      veda: 'Months of deep conversations that capture everything',
    },
    {
      traditional: 'Generic questions that don\'t go deep',
      veda: 'AI that learns what questions to ask next',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#d4af37] tracking-widest text-sm font-medium mb-4">THE VEDA DIFFERENCE</p>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#1a2332] mb-6">
            Beyond Traditional Memory Keeping
          </h2>
          <p className="text-lg text-[#1a2332]/70 max-w-2xl mx-auto">
            See how Veda transforms legacy preservation from passive recording to active wisdom
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          {/* Header Row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <span className="text-[#1a2332]/50 text-sm font-medium tracking-wide">TRADITIONAL METHODS</span>
            </div>
            <div className="text-center">
              <span className="text-[#d4af37] text-sm font-medium tracking-wide">THE VEDA WAY</span>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="space-y-4">
            {comparisons.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                {/* Traditional */}
                <div className="p-6 bg-[#f5f1e8]/50 rounded-lg border border-[#1a2332]/10">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#1a2332]/30 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-[#1a2332]/60">{item.traditional}</span>
                  </div>
                </div>

                {/* Veda */}
                <div className="p-6 bg-[#1a2332] rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[#f5f1e8]">{item.veda}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-xl sm:text-2xl font-serif text-[#1a2332] italic max-w-3xl mx-auto">
            "Veda doesn't just preserve what they said—it preserves how they think."
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
