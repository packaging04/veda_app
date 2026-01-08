import React from 'react';
import PageLayout from '@/components/veda/PageLayout';

const OurStory: React.FC = () => {
  return (
    <PageLayout 
      title="Our Story" 
      subtitle="How a personal loss inspired a mission to preserve wisdom for generations"
    >
      <div className="prose prose-invert prose-lg max-w-none">
        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20 mb-8">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">The Beginning</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed mb-4">
            Veda was born from a deeply personal experience. When our founder lost his grandfather, he realized that while he had countless photos and a few recordings, he had lost something far more valuable—access to his grandfather's wisdom, his way of thinking, and his guidance for life's challenges.
          </p>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            That loss sparked a question: What if technology could preserve not just someone's voice, but their very essence? What if future generations could still seek guidance from those who came before?
          </p>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20 mb-8">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">The Vision</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed mb-4">
            We assembled a team of AI researchers, psychologists, and storytelling experts to create something unprecedented: a platform that could capture the depth of human wisdom through meaningful conversations.
          </p>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            The name "Veda" comes from the ancient Sanskrit word meaning "knowledge" or "wisdom"—a fitting tribute to our mission of preserving life's most valuable lessons across generations.
          </p>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Today & Tomorrow</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed mb-4">
            Today, Veda helps families around the world preserve their most precious inheritance—the wisdom of their elders. We've conducted thousands of conversations, captured millions of stories, and helped countless families bridge the gap between generations.
          </p>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            Our journey is just beginning. We continue to innovate, always guided by our founding principle: that every person's wisdom deserves to live on.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default OurStory;
