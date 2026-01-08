import React, { useState } from 'react';
import PageLayout from '@/components/veda/PageLayout';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
  };

  return (
    <PageLayout 
      title="Contact Us" 
      subtitle="We'd love to hear from you. Reach out with any questions or inquiries."
    >
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#d4af37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[#f5f1e8] mb-2">Message Sent!</h3>
              <p className="text-[#f5f1e8]/70">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#f5f1e8] mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#d4af37]/20 rounded-sm text-[#f5f1e8] focus:outline-none focus:border-[#d4af37] transition-colors"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f5f1e8] mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#d4af37]/20 rounded-sm text-[#f5f1e8] focus:outline-none focus:border-[#d4af37] transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f5f1e8] mb-2">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#d4af37]/20 rounded-sm text-[#f5f1e8] focus:outline-none focus:border-[#d4af37] transition-colors"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Customer Support</option>
                  <option value="sales">Sales Question</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="press">Press Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f5f1e8] mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#d4af37]/20 rounded-sm text-[#f5f1e8] focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-semibold rounded-sm hover:from-[#e5c55a] hover:to-[#d4af37] transition-all"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
            <h3 className="text-xl font-serif text-[#d4af37] mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#d4af37]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#f5f1e8] font-medium">Email</p>
                  <p className="text-[#f5f1e8]/70">hello@veda-legacy.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#d4af37]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#f5f1e8] font-medium">Phone</p>
                  <p className="text-[#f5f1e8]/70">+1 (800) VEDA-NOW</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#d4af37]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#f5f1e8] font-medium">Office</p>
                  <p className="text-[#f5f1e8]/70">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2332]/50 rounded-xl p-8 border border-[#d4af37]/20">
            <h3 className="text-xl font-serif text-[#d4af37] mb-4">Office Hours</h3>
            <div className="space-y-2 text-[#f5f1e8]/70">
              <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
              <p>Saturday: 10:00 AM - 4:00 PM PST</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
