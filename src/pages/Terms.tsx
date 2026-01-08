import React from 'react';
import PageLayout from '@/components/veda/PageLayout';

const Terms: React.FC = () => {
  return (
    <PageLayout 
      title="Terms of Service" 
      subtitle="Last updated: December 31, 2025"
    >
      <div className="prose prose-invert prose-lg max-w-none space-y-8">
        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Agreement to Terms</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            By accessing or using Veda's services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
          </p>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Description of Services</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            Veda provides AI-powered legacy preservation services, including voice and video recording, wisdom extraction, and the creation of interactive digital legacies. Our services are designed to capture and preserve the stories, wisdom, and essence of your loved ones for future generations.
          </p>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">User Responsibilities</h2>
          <ul className="space-y-2 text-[#f5f1e8]/80">
            <li>• You must be at least 18 years old to use our services</li>
            <li>• You must have proper consent from individuals whose stories you record</li>
            <li>• You are responsible for maintaining the confidentiality of your account</li>
            <li>• You agree not to use our services for any unlawful purpose</li>
            <li>• You will not upload content that infringes on others' rights</li>
          </ul>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Intellectual Property</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed mb-4">
            You retain all ownership rights to the content you upload to Veda. By using our services, you grant us a limited license to process, store, and display your content solely for the purpose of providing our services.
          </p>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            The Veda platform, including its design, features, and technology, remains the exclusive property of Veda Legacy Technologies.
          </p>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Subscription & Payments</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            Our services are offered on a subscription basis. Prices are subject to change with 30 days' notice. Refunds are available within 30 days of purchase if you are not satisfied with our services.
          </p>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Limitation of Liability</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            Veda shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the amount you paid for our services in the twelve months preceding the claim.
          </p>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Contact</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            For questions about these Terms of Service, please contact us at legal@veda-legacy.com.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Terms;
