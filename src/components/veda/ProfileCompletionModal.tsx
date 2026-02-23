import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  userId: string;
  firstName: string;
  onComplete: () => void;
}

const USER_TYPES = [
  {
    id: "executive",
    label: "Executive / CEO",
    icon: "🏢",
    desc: "Business leader, entrepreneur, or senior professional",
  },
  {
    id: "alzheimers",
    label: "Early Alzheimer's Patient",
    icon: "🧠",
    desc: "Preserving memories and wisdom while clarity is present",
  },
  {
    id: "elder",
    label: "Elder / Patriarch / Matriarch",
    icon: "🌿",
    desc: "Older adult with a lifetime of stories to share",
  },
  {
    id: "professional",
    label: "Professional / Expert",
    icon: "⚕️",
    desc: "Doctor, lawyer, teacher, or domain expert",
  },
  {
    id: "parent",
    label: "Parent / Grandparent",
    icon: "👨‍👩‍👧",
    desc: "Preserving family history for future generations",
  },
  {
    id: "other",
    label: "Other",
    icon: "✨",
    desc: "I have a unique story to tell",
  },
];

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  isOpen,
  userId,
  firstName,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Profile fields
  const [userType, setUserType] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [occupation, setOccupation] = useState("");
  const [legacyGoal, setLegacyGoal] = useState("");
  const [notifyMethod, setNotifyMethod] = useState("email");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  );
  const [profileForOther, setProfileForOther] = useState(false);
  const [otherName, setOtherName] = useState("");
  const [otherRelationship, setOtherRelationship] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await supabase
        .from("profiles")
        .update({
          phone: phone || null,
          date_of_birth: dateOfBirth || null,
          occupation: occupation || null,
          user_type: userType,
          legacy_goal: legacyGoal || null,
          notify_method: notifyMethod,
          timezone,
          profile_completed: true,
          profile_for_other: profileForOther,
          other_name: profileForOther ? otherName : null,
          other_relationship: profileForOther ? otherRelationship : null,
        })
        .eq("id", userId);
      onComplete();
    } catch (err) {
      onComplete(); // proceed regardless
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep1 = userType !== "";
  const canProceedStep2 = true; // phone optional
  const canSubmit = legacyGoal.trim().length > 0 || true; // optional too

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0d1520]/90 backdrop-blur-md" />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#d4af37] via-[#e5c55a] to-[#c9a227]" />

        {/* Step progress */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                  s <= step ? "bg-[#d4af37]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-[#1a2332]/40 mt-1.5">
            Step {step} of 3 — Profile Setup
          </p>
        </div>

        <div className="px-6 pb-6">
          {/* ─── STEP 1: Who are you? ─── */}
          {step === 1 && (
            <>
              <h3 className="text-xl font-serif text-[#1a2332] mb-1">
                Welcome, {firstName}! Tell us about yourself
              </h3>
              <p className="text-sm text-[#1a2332]/55 mb-5">
                This helps us tailor your wisdom sessions to what matters most
                to you.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {USER_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setUserType(type.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      userType === type.id
                        ? "border-[#d4af37] bg-[#d4af37]/5"
                        : "border-gray-200 hover:border-[#d4af37]/50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-xs font-bold text-[#1a2332]">
                      {type.label}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                      {type.desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Profile for someone else option */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForOther}
                    onChange={(e) => setProfileForOther(e.target.checked)}
                    className="mt-0.5 accent-[#d4af37]"
                  />
                  <div>
                    <p className="text-xs font-semibold text-amber-900">
                      I'm setting this up for someone else
                    </p>
                    <p className="text-[10px] text-amber-700 mt-0.5">
                      Note: We don't support outbound calling. The person you
                      add will need to call us directly.
                    </p>
                  </div>
                </label>
                {profileForOther && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Their full name"
                      value={otherName}
                      onChange={(e) => setOtherName(e.target.value)}
                      className="w-full px-3 py-2 border border-amber-200 rounded-lg text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                    <input
                      type="text"
                      placeholder="Your relationship (e.g. son, daughter)"
                      value={otherRelationship}
                      onChange={(e) => setOtherRelationship(e.target.value)}
                      className="w-full px-3 py-2 border border-amber-200 rounded-lg text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                )}
              </div>

              <button
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
                className="w-full py-3 bg-[#1a2332] text-[#d4af37] font-bold rounded-xl hover:bg-[#2a3342] transition-colors disabled:opacity-40"
              >
                Continue →
              </button>
            </>
          )}

          {/* ─── STEP 2: Contact details ─── */}
          {step === 2 && (
            <>
              <h3 className="text-xl font-serif text-[#1a2332] mb-1">
                Contact & Availability
              </h3>
              <p className="text-sm text-[#1a2332]/55 mb-5">
                Help us personalize your experience.
              </p>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-[#1a2332] mb-1.5">
                    Phone Number{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 000 0000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2332] mb-1.5">
                    Date of Birth{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2332] mb-1.5">
                    Occupation / Title{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Retired teacher, CEO of Acme Inc."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2332] mb-1.5">
                    Preferred notification method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["email", "sms"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setNotifyMethod(method)}
                        className={`py-2.5 rounded-lg text-sm font-medium border-2 transition-all capitalize ${
                          notifyMethod === method
                            ? "border-[#d4af37] bg-[#d4af37]/5 text-[#1a2332]"
                            : "border-gray-200 text-gray-500"
                        }`}
                      >
                        {method === "email" ? "📧 Email" : "📱 SMS"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border-2 border-gray-200 text-[#1a2332]/60 font-medium rounded-xl hover:border-gray-300 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-[#1a2332] text-[#d4af37] font-bold rounded-xl hover:bg-[#2a3342] transition-colors"
                >
                  Continue →
                </button>
              </div>
            </>
          )}

          {/* ─── STEP 3: Legacy goal ─── */}
          {step === 3 && (
            <>
              <h3 className="text-xl font-serif text-[#1a2332] mb-1">
                Your Legacy Vision
              </h3>
              <p className="text-sm text-[#1a2332]/55 mb-5">
                What do you most want to preserve for future generations?
              </p>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-[#1a2332] mb-1.5">
                    In your own words…{" "}
                    <span className="text-gray-400 font-normal">
                      (optional but meaningful)
                    </span>
                  </label>
                  <textarea
                    value={legacyGoal}
                    onChange={(e) => setLegacyGoal(e.target.value)}
                    rows={4}
                    placeholder="e.g. I want my grandchildren to know my life story, my values, and the lessons I've learned so they can face challenges with wisdom I never had at their age."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                  />
                </div>

                <div className="bg-[#f5f1e8] rounded-xl p-4">
                  <p className="text-xs font-bold text-[#1a2332] mb-2">
                    🎯 Quick pick (optional)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Life lessons",
                      "Business wisdom",
                      "Family history",
                      "Values & beliefs",
                      "Career advice",
                      "Parenting wisdom",
                      "Spiritual insights",
                      "Health & wellbeing",
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setLegacyGoal((prev) =>
                            prev ? `${prev}, ${tag}` : tag,
                          )
                        }
                        className="text-xs px-3 py-1 rounded-full border border-[#1a2332]/20 text-[#1a2332]/70 hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border-2 border-gray-200 text-[#1a2332]/60 font-medium rounded-xl hover:border-gray-300 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-bold rounded-xl hover:from-[#e5c55a] hover:to-[#d4af37] transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner /> Saving...
                    </>
                  ) : (
                    "Complete Profile →"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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
);

export default ProfileCompletionModal;
