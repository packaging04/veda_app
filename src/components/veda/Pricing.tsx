import React, { useState } from 'react';

interface PricingProps {
  onSelectPlan: (plan: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      name: 'Legacy Starter',
      subtitle: 'Begin the Journey',
      price: billingCycle === 'annual' ? 149 : 179,
      period: '/month',
      description: 'Perfect for families starting their legacy preservation journey',
      features: [
        '4 AI-led phone calls per month',
        'Basic wisdom extraction',
        'Voice recording archive',
        'Family member access (up to 3)',
        'Email support',
        'Mobile app access',
      ],
      notIncluded: [
        'Video sessions',
        'Legacy Box',
        'Wisdom validation phase',
        'Interactive AI replica',
      ],
      cta: 'Start Your Legacy',
      popular: false,
    },
    {
      name: 'Heritage Complete',
      subtitle: 'Most Popular',
      price: billingCycle === 'annual' ? 349 : 399,
      period: '/month',
      description: 'The complete experience for meaningful legacy preservation',
      features: [
        '8 AI-led phone calls per month',
        'Advanced wisdom extraction',
        'Video session capability',
        'Legacy Box included',
        'Family member access (up to 10)',
        'Priority support',
        'Photo & story uploads',
        'Wisdom validation phase',
        'Basic interactive AI replica',
      ],
      notIncluded: [
        'Unlimited family access',
        'Full behavioral mapping',
      ],
      cta: 'Choose Heritage',
      popular: true,
    },
    {
      name: 'Eternal Wisdom',
      subtitle: 'The Ultimate Legacy',
      price: billingCycle === 'annual' ? 749 : 899,
      period: '/month',
      description: 'For families who want the most comprehensive preservation',
      features: [
        'Unlimited AI-led sessions',
        'Full behavioral & persona mapping',
        'Video + body language analysis',
        'Premium Legacy Box',
        'Unlimited family access',
        'Dedicated legacy consultant',
        'All media uploads',
        'Extended validation phase',
        'Full interactive AI replica',
        'Generational access forever',
        'White-glove onboarding',
      ],
      notIncluded: [],
      cta: 'Begin Eternal Legacy',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#f5f1e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-[#d4af37] tracking-widest text-sm font-medium mb-4">INVESTMENT IN LEGACY</p>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#1a2332] mb-6">
            Choose Your Legacy Journey
          </h2>
          <p className="text-lg text-[#1a2332]/70 max-w-2xl mx-auto mb-8">
            Every plan includes our commitment to preserving wisdom with dignity and care
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#1a2332] text-[#f5f1e8]'
                  : 'text-[#1a2332]/60 hover:text-[#1a2332]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'annual'
                  ? 'bg-[#1a2332] text-[#f5f1e8]'
                  : 'text-[#1a2332]/60 hover:text-[#1a2332]'
              }`}
            >
              Annual <span className="text-[#d4af37] ml-1">Save 15%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? 'bg-[#1a2332] shadow-2xl shadow-[#1a2332]/30 lg:-mt-4 lg:mb-4'
                  : 'bg-white shadow-xl'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#d4af37] text-[#1a2332] px-4 py-1 text-xs font-bold tracking-wide">
                  MOST POPULAR
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="mb-6">
                  <p className={`text-sm tracking-wide mb-1 ${plan.popular ? 'text-[#d4af37]' : 'text-[#d4af37]'}`}>
                    {plan.subtitle}
                  </p>
                  <h3 className={`text-2xl font-serif mb-2 ${plan.popular ? 'text-[#f5f1e8]' : 'text-[#1a2332]'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.popular ? 'text-[#f5f1e8]/60' : 'text-[#1a2332]/60'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <span className={`text-5xl font-serif ${plan.popular ? 'text-[#f5f1e8]' : 'text-[#1a2332]'}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-[#f5f1e8]/60' : 'text-[#1a2332]/60'}`}>
                    {plan.period}
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => onSelectPlan(plan.name)}
                  className={`w-full py-4 rounded-sm font-semibold tracking-wide transition-all mb-8 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] hover:from-[#e5c55a] hover:to-[#d4af37]'
                      : 'bg-[#1a2332] text-[#f5f1e8] hover:bg-[#2a3342]'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <svg
                        className={`w-5 h-5 mr-3 flex-shrink-0 ${plan.popular ? 'text-[#d4af37]' : 'text-[#d4af37]'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-sm ${plan.popular ? 'text-[#f5f1e8]/80' : 'text-[#1a2332]/70'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <div key={idx} className="flex items-start opacity-40">
                      <svg
                        className={`w-5 h-5 mr-3 flex-shrink-0 ${plan.popular ? 'text-[#f5f1e8]' : 'text-[#1a2332]'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className={`text-sm ${plan.popular ? 'text-[#f5f1e8]' : 'text-[#1a2332]'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-full shadow-md">
            <svg className="w-8 h-8 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div className="text-left">
              <p className="text-[#1a2332] font-medium">30-Day Satisfaction Guarantee</p>
              <p className="text-[#1a2332]/60 text-sm">Full refund if you're not completely satisfied</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
