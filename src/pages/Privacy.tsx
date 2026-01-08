import React from 'react';
import PageLayout from '@/components/veda/PageLayout';

const Privacy: React.FC = () => {
  return (
    <PageLayout 
      title="Privacy Policy" 
      subtitle="Last updated: December 31, 2025"
    >
      <div className="prose prose-invert prose-lg max-w-none space-y-8">
        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Introduction</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            At Veda Legacy Technologies ("Veda," "we," "us," or "our"), we understand that your family's stories and personal information are sacred. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
          </p>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Information We Collect</h2>
          <div className="space-y-4 text-[#f5f1e8]/80">
            <p><strong className="text-[#f5f1e8]">Personal Information:</strong> Name, email address, phone number, billing information, and other contact details you provide.</p>
            <p><strong className="text-[#f5f1e8]">Legacy Content:</strong> Voice recordings, video recordings, photographs, written stories, and other content you upload or create through our platform.</p>
            <p><strong className="text-[#f5f1e8]">Usage Data:</strong> Information about how you interact with our services, including session duration, features used, and preferences.</p>
          </div>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">How We Use Your Information</h2>
          <ul className="space-y-2 text-[#f5f1e8]/80">
            <li>• To provide and maintain our legacy preservation services</li>
            <li>• To train and improve our AI models for better wisdom extraction</li>
            <li>• To communicate with you about your account and our services</li>
            <li>• To process payments and prevent fraud</li>
            <li>• To comply with legal obligations</li>
          </ul>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Data Security</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            We implement industry-leading security measures to protect your information, including end-to-end encryption, secure data centers, and regular security audits. Your legacy content is encrypted both in transit and at rest.
          </p>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Your Rights</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed mb-4">
            You have the right to access, correct, or delete your personal information at any time. You may also request a copy of all data we hold about you or your family members.
          </p>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            To exercise these rights, please contact us at privacy@veda-legacy.com.
          </p>
        </div>

        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Contact Us</h2>
          <p className="text-[#f5f1e8]/80 leading-relaxed">
            If you have questions about this Privacy Policy, please contact our Data Protection Officer at privacy@veda-legacy.com or write to us at: Veda Legacy Technologies, Privacy Team, San Francisco, CA.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Privacy;
