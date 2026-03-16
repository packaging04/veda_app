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
    desc: "Business leader or entrepreneur",
  },
  {
    id: "alzheimers",
    label: "Early Alzheimer's",
    icon: "🧠",
    desc: "Preserving while clarity is present",
  },
  {
    id: "elder",
    label: "Elder / Patriarch",
    icon: "🌿",
    desc: "Lifetime of stories to share",
  },
  {
    id: "professional",
    label: "Professional / Expert",
    icon: "⚕️",
    desc: "Doctor, lawyer, teacher, or expert",
  },
  {
    id: "parent",
    label: "Parent / Grandparent",
    icon: "👨‍👩‍👧",
    desc: "Preserving family history",
  },
  {
    id: "other",
    label: "Other",
    icon: "✨",
    desc: "I have a unique story to tell",
  },
];

const LEGACY_TAGS = [
  "Life lessons",
  "Business wisdom",
  "Family history",
  "Values & beliefs",
  "Career advice",
  "Parenting wisdom",
  "Spiritual insights",
  "Health & wellbeing",
];

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  isOpen,
  userId,
  firstName,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [userType, setUserType] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [occupation, setOccupation] = useState("");
  const [legacyGoal, setLegacyGoal] = useState("");
  const [notifyMethod, setNotifyMethod] = useState("email");
  const [timezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  );
  const [profileForOther, setProfileForOther] = useState(false);
  const [otherName, setOtherName] = useState("");
  const [otherRelationship, setOtherRelationship] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // upsert instead of update — creates the row if it was deleted from the DB
      // update() silently does nothing if the row doesn't exist; upsert() always writes
      const { error } = await supabase.from("profiles").upsert(
        {
          id: userId,
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
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

      if (error) {
        console.error("Profile upsert error:", error.message);
      }
      onComplete();
    } catch (err) {
      console.error("Profile save failed:", err);
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0d1520]/90 backdrop-blur-md" />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[92vh]">
        {/* ── Gold bar ── */}
        <div className="h-1 bg-gradient-to-r from-[#d4af37] via-[#e5c55a] to-[#c9a227] rounded-t-2xl flex-shrink-0" />

        {/* ── Header (fixed) ── */}
        <div className="px-6 pt-4 pb-3 flex-shrink-0 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#1a2332]/40 font-medium">
              Step {step} of 3 — Profile Setup
            </p>
            <button
              onClick={onComplete}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Skip for now"
            >
              <svg
                className="w-4 h-4"
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
          </div>
          {/* Progress bar */}
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
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-serif text-[#1a2332] mb-0.5">
                Welcome, {firstName}!
              </h3>
              <p className="text-sm text-[#1a2332]/55 mb-4">
                Tell us about yourself so we can tailor your sessions.
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {USER_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setUserType(type.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      userType === type.id
                        ? "border-[#d4af37] bg-[#d4af37]/5"
                        : "border-gray-200 hover:border-[#d4af37]/50"
                    }`}
                  >
                    <div className="text-xl mb-1">{type.icon}</div>
                    <div className="text-xs font-bold text-[#1a2332] leading-snug">
                      {type.label}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                      {type.desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Profile for someone else */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
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
                      They will need to call us directly — we don't do outbound
                      calls.
                    </p>
                  </div>
                </label>
                {profileForOther && (
                  <div className="mt-2 space-y-2">
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
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-serif text-[#1a2332] mb-0.5">
                Contact & Availability
              </h3>
              <p className="text-sm text-[#1a2332]/55 mb-4">
                Help us personalise your experience. All fields are optional.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1a2332]/60 tracking-wide mb-1.5">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a2332]/60 tracking-wide mb-1.5">
                    DATE OF BIRTH
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a2332]/60 tracking-wide mb-1.5">
                    OCCUPATION / TITLE
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Retired teacher, CEO of Acme Inc."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a2332]/60 tracking-wide mb-1.5">
                    PREFERRED NOTIFICATIONS
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["email", "sms"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setNotifyMethod(method)}
                        className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                          notifyMethod === method
                            ? "border-[#d4af37] bg-[#d4af37]/5 text-[#1a2332]"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {method === "email" ? "📧 Email" : "📱 SMS"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-serif text-[#1a2332] mb-0.5">
                Your Legacy Vision
              </h3>
              <p className="text-sm text-[#1a2332]/55 mb-4">
                What do you most want to preserve for future generations?
              </p>

              <div className="space-y-3">
                <textarea
                  value={legacyGoal}
                  onChange={(e) => setLegacyGoal(e.target.value)}
                  rows={3}
                  placeholder="e.g. I want my grandchildren to know my life story, my values, and the lessons I've learned..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                />

                <div className="bg-[#f5f1e8] rounded-xl p-3">
                  <p className="text-xs font-bold text-[#1a2332] mb-2">
                    🎯 Quick pick
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {LEGACY_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setLegacyGoal((prev) =>
                            prev ? `${prev}, ${tag}` : tag,
                          )
                        }
                        className="text-xs px-2.5 py-1 rounded-full border border-[#1a2332]/20 text-[#1a2332]/70 hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer buttons (fixed) ── */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          {step === 1 && (
            <button
              disabled={!userType}
              onClick={() => setStep(2)}
              className="w-full py-3 bg-[#1a2332] text-[#d4af37] font-bold rounded-xl hover:bg-[#2a3342] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          )}
          {step === 2 && (
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
          )}
          {step === 3 && (
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
