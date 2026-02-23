import React, { useState } from "react";

interface CallInfoModalProps {
  isOpen: boolean;
  callCode: string;
  phoneNumber: string;
  scheduledCount: number;
  onClose: () => void;
}

const CallInfoModal: React.FC<CallInfoModalProps> = ({
  isOpen,
  callCode,
  phoneNumber,
  scheduledCount,
  onClose,
}) => {
  const [codeCopied, setCodeCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = async (
    text: string,
    setCopied: (v: boolean) => void,
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0d1520]/95 backdrop-blur-lg" />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#d4af37] via-[#e5c55a] to-[#c9a227]" />

        <div className="p-8">
          {/* Success icon */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#d4af37] rounded-full flex items-center justify-center text-xs">
                📞
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-serif text-[#1a2332] text-center mb-1">
            You're All Set!
          </h3>
          <p className="text-sm text-[#1a2332]/55 text-center mb-6">
            {scheduledCount} session{scheduledCount !== 1 ? "s" : ""} scheduled.
            Save the details below — you'll need them to connect with Veda.
          </p>

          {/* Call details card */}
          <div className="bg-[#1a2332] rounded-2xl p-5 mb-5 space-y-4">
            {/* Phone number */}
            <div>
              <p className="text-[#d4af37]/70 text-xs font-medium tracking-wider mb-1.5">
                VEDA PHONE NUMBER
              </p>
              <div className="flex items-center justify-between">
                <p className="text-white text-xl font-mono font-bold tracking-widest">
                  {phoneNumber}
                </p>
                <button
                  onClick={() => copyToClipboard(phoneNumber, setPhoneCopied)}
                  className="ml-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {phoneCopied ? (
                    <>
                      <svg
                        className="w-3 h-3 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="border-t border-white/10" />

            {/* Call code */}
            <div>
              <p className="text-[#d4af37]/70 text-xs font-medium tracking-wider mb-1.5">
                YOUR PERSONAL CALL CODE
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#d4af37] text-2xl font-mono font-bold tracking-widest">
                    {callCode}
                  </p>
                  <p className="text-white/40 text-[10px] mt-0.5">
                    Enter this code when prompted during the call
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(callCode, setCodeCopied)}
                  className="ml-3 px-3 py-1.5 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {codeCopied ? (
                    <>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
            <p className="text-xs font-bold text-amber-900 mb-2">
              📝 Write these down!
            </p>
            <ol className="space-y-1.5 text-xs text-amber-800">
              <li className="flex gap-2">
                <span className="font-bold w-4">1.</span>Call{" "}
                <strong>{phoneNumber}</strong> during your scheduled time
                window.
              </li>
              <li className="flex gap-2">
                <span className="font-bold w-4">2.</span>When prompted, enter
                your call code: <strong>{callCode}</strong>
              </li>
              <li className="flex gap-2">
                <span className="font-bold w-4">3.</span>Your Veda AI session
                will begin automatically.
              </li>
              <li className="flex gap-2">
                <span className="font-bold w-4">4.</span>Only calls with valid
                codes linked to your profile will be recorded.
              </li>
            </ol>
          </div>

          {/* Also visible in dashboard note */}
          <div className="flex items-center gap-2 text-xs text-[#1a2332]/50 mb-6">
            <svg
              className="w-4 h-4 flex-shrink-0 text-[#d4af37]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            These details are also saved to your dashboard under each scheduled
            session.
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#1a2332] text-[#d4af37] font-bold rounded-xl hover:bg-[#2a3342] transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallInfoModal;
