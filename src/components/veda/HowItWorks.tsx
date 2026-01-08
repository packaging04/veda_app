import React, { useState } from 'react';

const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Begin the Journey',
      subtitle: 'Simple Setup for Everyone',
      description: 'Whether your loved one prefers phone calls or a mobile app, Veda adapts. Family members can register and schedule AI-led conversations, or tech-savvy elders can use our elegant app to share stories directly.',
      features: ['Schedule automated calls', 'Upload existing recordings', 'Invite family members'],
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Expert AI Conversations',
      subtitle: 'More Than Just Recording',
      description: 'Our AI operates as an Expert Life Story Interviewer—not a bot. Using empathy and professional narrative techniques, it uncovers not just what happened, but how your loved one thinks, reasons, and makes decisions.',
      features: ['Layered questioning technique', 'Emotional intelligence', 'Wisdom extraction'],
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Wisdom Validation',
      subtitle: 'Accuracy You Can Trust',
      description: 'While your loved one is still with you, they validate the AI\'s understanding. We present scenarios and let them correct the AI\'s responses, ensuring the digital replica truly represents their unique wisdom and personality.',
      features: ['Real-time feedback loop', 'Personality calibration', 'Accuracy testing'],
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Eternal Wisdom',
      subtitle: 'A Living Legacy',
      description: 'The final result is a Wisdom-Based Replica. Future generations don\'t just listen to recordings—they consult the wisdom. Ask questions and receive guidance in the exact logical and emotional framework your loved one would have used.',
      features: ['Interactive consultations', 'Dynamic responses', 'Generational access'],
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#f5f1e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#d4af37] tracking-widest text-sm font-medium mb-4">THE VEDA PROCESS</p>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#1a2332] mb-6">
            How We Preserve Wisdom
          </h2>
          <p className="text-lg text-[#1a2332]/70 max-w-2xl mx-auto">
            A thoughtful, multi-month journey that transforms stories into an interactive legacy
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Steps Navigation */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left p-6 rounded-lg transition-all duration-300 ${
                  activeStep === index
                    ? 'bg-[#1a2332] shadow-xl'
                    : 'bg-white hover:bg-[#1a2332]/5 border border-[#1a2332]/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className={`text-3xl font-serif ${
                    activeStep === index ? 'text-[#d4af37]' : 'text-[#1a2332]/30'
                  }`}>
                    {step.number}
                  </span>
                  <div>
                    <h3 className={`text-xl font-serif mb-1 ${
                      activeStep === index ? 'text-[#f5f1e8]' : 'text-[#1a2332]'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${
                      activeStep === index ? 'text-[#d4af37]' : 'text-[#1a2332]/50'
                    }`}>
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Detail */}
          <div className="bg-[#1a2332] rounded-lg p-8 lg:p-12 flex flex-col justify-center">
            <div className="text-[#d4af37] mb-6">
              {steps[activeStep].icon}
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#f5f1e8] mb-4">
              {steps[activeStep].title}
            </h3>
            <p className="text-[#f5f1e8]/80 leading-relaxed mb-8">
              {steps[activeStep].description}
            </p>
            <ul className="space-y-3">
              {steps[activeStep].features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-[#f5f1e8]/70">
                  <svg className="w-5 h-5 text-[#d4af37] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
