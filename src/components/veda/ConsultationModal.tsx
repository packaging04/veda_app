import React, { useState } from "react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    relationship: "",
    elderName: "",
    elderAge: "",
    preferredContact: "email",
    message: "",
    plan: selectedPlan || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 
        bg-[#1a2332]/80
        backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#1a2332]/40 hover:text-[#1a2332] transition-colors z-10"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {isSubmitted ? (
          /* Success State */
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-[#d4af37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-[#1a2332] mb-4">
              Thank You for Reaching Out
            </h3>
            <p className="text-[#1a2332]/70 mb-8">
              A Veda legacy consultant will contact you within 24 hours to
              discuss your family's unique journey.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#1a2332] text-[#f5f1e8] rounded-sm hover:bg-[#2a3342] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          /* Form */
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-[#d4af37] tracking-widest text-sm font-medium mb-2">
                BEGIN YOUR LEGACY JOURNEY
              </p>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#1a2332] mb-2">
                Book a Free Consultation
              </h3>
              <p className="text-[#1a2332]/60">
                Speak with a legacy consultant about preserving your family's
                wisdom
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2332] mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2332] mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              {/* Contact Row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2332] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2332] mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Elder Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2332] mb-2">
                    Your Relationship
                  </label>
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors bg-white"
                  >
                    <option value="">Select relationship</option>
                    <option value="child">Son/Daughter</option>
                    <option value="grandchild">Grandchild</option>
                    <option value="spouse">Spouse</option>
                    <option value="self">For Myself</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2332] mb-2">
                    Elder's Age (approx)
                  </label>
                  <input
                    type="text"
                    name="elderAge"
                    value={formData.elderAge}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="e.g., 75"
                  />
                </div>
              </div>

              {/* Plan Selection */}
              <div>
                <label className="block text-sm font-medium text-[#1a2332] mb-2">
                  Interested Plan
                </label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors bg-white"
                >
                  <option value="">Not sure yet</option>
                  <option value="Legacy Starter">
                    Legacy Starter ($149/mo)
                  </option>
                  <option value="Heritage Complete">
                    Heritage Complete ($349/mo)
                  </option>
                  <option value="Eternal Wisdom">
                    Eternal Wisdom ($749/mo)
                  </option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-[#1a2332] mb-2">
                  Tell Us About Your Family
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                  placeholder="Share any details about your loved one or questions you have..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-semibold rounded-sm hover:from-[#e5c55a] hover:to-[#d4af37] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Scheduling...
                  </>
                ) : (
                  "Schedule Free Consultation"
                )}
              </button>

              <p className="text-center text-sm text-[#1a2332]/50">
                By submitting, you agree to our Privacy Policy and Terms of
                Service
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;
