import React from 'react';
import PageLayout from '@/components/veda/PageLayout';

const About: React.FC = () => {
  return (
    <PageLayout 
      title="About Veda" 
      subtitle="Preserving wisdom across generations through AI-powered legacy conversations"
    >
      <div className="prose prose-invert prose-lg max-w-none">
        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20 mb-8">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Our Mission</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            At Veda, we believe that every person carries a lifetime of wisdom, stories, and experiences that deserve to be preserved for future generations. Our mission is to bridge the gap between generations by capturing and preserving the essence of who we are—our thoughts, our values, our life lessons—in a way that transcends time.
          </p>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20 mb-8">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">What We Do</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed mb-4">
            Veda is an AI-powered legacy preservation platform designed to capture, extract, and preserve the wisdom and identity of your loved ones. Through expert AI-led conversations, we go beyond simple recordings to understand how a person thinks, speaks, reasons, and responds to life's challenges.
          </p>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            The result is a wisdom-based digital replica that future generations can consult for guidance, preserving not just memories, but the very essence of a person's character and wisdom.
          </p>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Our Values</h2>
          <ul className="space-y-4 text-[#f5f1e8]/80">
            <li className="flex items-start gap-3">
              <span className="text-[#d4af37] mt-1">•</span>
              <span><strong className="text-[#f5f1e8]">Dignity:</strong> We treat every story with the respect and reverence it deserves.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4af37] mt-1">•</span>
              <span><strong className="text-[#f5f1e8]">Privacy:</strong> Your family's stories are sacred. We employ the highest standards of data security.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4af37] mt-1">•</span>
              <span><strong className="text-[#f5f1e8]">Authenticity:</strong> We capture the true essence of a person, validated by them while they're still with us.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4af37] mt-1">•</span>
              <span><strong className="text-[#f5f1e8]">Legacy:</strong> We believe wisdom should be an inheritance that grows more valuable with time.</span>
            </li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
