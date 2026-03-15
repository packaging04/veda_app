import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Check if already submitted
      const { data: existing } = await supabase
        .from("demo_requests")
        .select("id, status")
        .eq("email", formData.email.toLowerCase().trim())
        .maybeSingle();

      if (existing) {
        if (existing.status === "approved") {
          setError(
            "Your request has already been approved. Check your email for your invite link, or use the Login button above.",
          );
          setIsSubmitting(false);
          return;
        }
        if (existing.status === "pending") {
          // Still show success — they might have forgotten they submitted
          setIsSubmitted(true);
          setIsSubmitting(false);
          return;
        }
      }

      const { error: insertError } = await supabase
        .from("demo_requests")
        .insert({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.toLowerCase().trim(),
          phone: formData.phone.trim() || null,
          relationship: formData.relationship || null,
          elder_name: formData.elderName.trim() || null,
          elder_age: formData.elderAge.trim() || null,
          preferred_contact: formData.preferredContact,
          message: formData.message.trim() || null,
          plan: formData.plan || null,
          status: "pending",
        });

      if (insertError) throw insertError;

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Demo request error:", err);
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1a2332]/80 backdrop-blur-sm"
        onClick={onClose}
      />

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
          /* ── Success State ── */
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
              Request Received!
            </h3>
            <p className="text-[#1a2332]/70 mb-3 leading-relaxed">
              Thank you, <strong>{formData.firstName}</strong>. We've received
              your demo request and will review it shortly.
            </p>
            <p className="text-[#1a2332]/55 text-sm mb-8">
              Once approved, you'll receive an email at{" "}
              <strong>{formData.email}</strong> with a link to access your Veda
              account. This usually takes under 24 hours.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#1a2332] text-[#f5f1e8] rounded-xl hover:bg-[#2a3342] transition-colors font-medium"
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <div className="p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-[#d4af37] tracking-widest text-xs font-bold mb-2">
                BEGIN YOUR LEGACY JOURNEY
              </p>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#1a2332] mb-2">
                Request Access to Veda
              </h3>
              <p className="text-[#1a2332]/60 text-sm">
                We're onboarding early users carefully. Tell us about yourself
                and we'll be in touch within 24 hours.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a2332]/60 mb-1.5 tracking-wide">
                    FIRST NAME *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Your first name"
                    className="w-full px-4 py-3 border border-[#1a2332]/15 rounded-xl focus:outline-none focus:border-[#d4af37] transition-colors text-sm bg-[#fafaf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a2332]/60 mb-1.5 tracking-wide">
                    LAST NAME
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Your last name"
                    className="w-full px-4 py-3 border border-[#1a2332]/15 rounded-xl focus:outline-none focus:border-[#d4af37] transition-colors text-sm bg-[#fafaf8]"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a2332]/60 mb-1.5 tracking-wide">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-[#1a2332]/15 rounded-xl focus:outline-none focus:border-[#d4af37] transition-colors text-sm bg-[#fafaf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a2332]/60 mb-1.5 tracking-wide">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234..."
                    className="w-full px-4 py-3 border border-[#1a2332]/15 rounded-xl focus:outline-none focus:border-[#d4af37] transition-colors text-sm bg-[#fafaf8]"
                  />
                </div>
              </div>

              {/* Relationship & Elder */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a2332]/60 mb-1.5 tracking-wide">
                    I AM REQUESTING FOR
                  </label>
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#1a2332]/15 rounded-xl focus:outline-none focus:border-[#d4af37] transition-colors text-sm bg-[#fafaf8]"
                  >
                    <option value="">Select...</option>
                    <option value="myself">Myself</option>
                    <option value="parent">A parent</option>
                    <option value="grandparent">A grandparent</option>
                    <option value="spouse">My spouse / partner</option>
                    <option value="business_partner">A business partner</option>
                    <option value="other">Someone else</option>
                  </select>
                </div>
                {formData.relationship &&
                  formData.relationship !== "myself" && (
                    <div>
                      <label className="block text-xs font-semibold text-[#1a2332]/60 mb-1.5 tracking-wide">
                        THEIR NAME
                      </label>
                      <input
                        type="text"
                        name="elderName"
                        value={formData.elderName}
                        onChange={handleChange}
                        placeholder="Their first name"
                        className="w-full px-4 py-3 border border-[#1a2332]/15 rounded-xl focus:outline-none focus:border-[#d4af37] transition-colors text-sm bg-[#fafaf8]"
                      />
                    </div>
                  )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-[#1a2332]/60 mb-1.5 tracking-wide">
                  WHAT BRINGS YOU TO VEDA?
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us whose wisdom you want to preserve and why it matters to you..."
                  rows={3}
                  className="w-full px-4 py-3 border border-[#1a2332]/15 rounded-xl focus:outline-none focus:border-[#d4af37] transition-colors text-sm bg-[#fafaf8] resize-none"
                />
              </div>

              {/* Plan interest */}
              <div>
                <label className="block text-xs font-semibold text-[#1a2332]/60 mb-1.5 tracking-wide">
                  PLAN OF INTEREST
                </label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#1a2332]/15 rounded-xl focus:outline-none focus:border-[#d4af37] transition-colors text-sm bg-[#fafaf8]"
                >
                  <option value="">Not sure yet</option>
                  <option value="free">Free — Explore the experience</option>
                  <option value="basic">Basic — $19.90 / 5 sessions</option>
                  <option value="standard">
                    Standard — $49.90 / 20 sessions
                  </option>
                  <option value="premium">
                    Premium — $99.90 / 45 sessions
                  </option>
                </select>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={
                    isSubmitting || !formData.firstName || !formData.email
                  }
                  className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-bold rounded-xl hover:from-[#e5c55a] hover:to-[#d4af37] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm tracking-wide"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Request Access →"
                  )}
                </button>
                <p className="text-center text-xs text-[#1a2332]/40 mt-3">
                  Access is reviewed manually. We'll email you within 24 hours.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;
