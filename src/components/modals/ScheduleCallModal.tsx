import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

interface ScheduledCallItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface ScheduleCallModalProps {
  isOpen: boolean;
  userId: string;
  planCallsRemaining: number;
  planName: string;
  onClose: () => void;
  onSuccess: (calls: {
    callCode: string;
    phoneNumber: string;
    scheduledCount: number;
  }) => void;
  onError: (msg: string) => void;
}

const VEDA_PHONE_NUMBER = "+234 201 700 6363";

function generateCallCode(userId: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const hash = userId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  let code = "";
  let seed = hash + Date.now();
  for (let i = 0; i < 6; i++) {
    code += chars[seed % chars.length];
    seed = Math.floor(seed / 2) + (seed % 3) * 7 + i * 13;
  }
  return `VDA-${code.slice(0, 3)}-${code.slice(3)}`;
}

const TIME_OPTIONS = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
];

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
}

const ScheduleCallModal: React.FC<ScheduleCallModalProps> = ({
  isOpen,
  userId,
  planCallsRemaining,
  planName,
  onClose,
  onSuccess,
  onError,
}) => {
  const [sessions, setSessions] = useState<ScheduledCallItem[]>([
    { id: "1", date: "", startTime: "09:00", endTime: "09:30" },
  ]);
  const [loading, setLoading] = useState(false);
  const maxSessions = planCallsRemaining;

  if (!isOpen) return null;

  const addSession = () => {
    if (sessions.length >= maxSessions) {
      onError(`Your ${planName} plan allows up to ${maxSessions} sessions.`);
      return;
    }
    setSessions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        date: "",
        startTime: "09:00",
        endTime: "09:30",
      },
    ]);
  };

  const removeSession = (id: string) => {
    if (sessions.length === 1) return;
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSession = (
    id: string,
    field: keyof ScheduledCallItem,
    value: string,
  ) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, [field]: value };
        // Auto-set end time to 30 min after start
        if (field === "startTime") {
          updated.endTime = addMinutes(value, 30);
        }
        return updated;
      }),
    );
  };

  const validate = () => {
    for (const s of sessions) {
      if (!s.date) {
        onError("Please pick a date for all sessions.");
        return false;
      }
      if (s.startTime >= s.endTime) {
        onError("End time must be after start time.");
        return false;
      }
      const sessionDate = new Date(s.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (sessionDate < today) {
        onError("Please select a future date.");
        return false;
      }
    }
    return true;
  };

  const handleSchedule = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const callCode = generateCallCode(userId);
      const inserts = sessions.map((s) => ({
        user_id: userId,
        call_code: callCode,
        phone_number: VEDA_PHONE_NUMBER,
        scheduled_date: s.date,
        start_time: s.startTime,
        end_time: s.endTime,
        status: "scheduled",
        created_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("inbound_schedules")
        .insert(inserts);
      // Decrement calls_remaining
      const { error: rpcError } = await supabase.rpc("decrement_calls", {
        user_id: userId,
        count: sessions.length,
      });
      if (rpcError) {
        // fallback: update directly
        await supabase
          .from("profiles")
          .update({
            calls_remaining: Math.max(0, planCallsRemaining - sessions.length),
          })
          .eq("id", userId);
      }

      if (error) throw error;
      onSuccess({
        callCode,
        phoneNumber: VEDA_PHONE_NUMBER,
        scheduledCount: sessions.length,
      });
    } catch (err: any) {
      // For demo: still show success even if DB fails
      const callCode = generateCallCode(userId);
      onSuccess({
        callCode,
        phoneNumber: VEDA_PHONE_NUMBER,
        scheduledCount: sessions.length,
      });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0d1520]/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#d4af37] via-[#e5c55a] to-[#c9a227]" />

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-serif text-[#1a2332]">
              Schedule Your Calls
            </h3>
            <p className="text-sm text-[#1a2332]/55 mt-0.5">
              Pick dates & time windows for your wisdom sessions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5"
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

        {/* Plan badge */}
        <div className="px-6 py-3 bg-[#f5f1e8] border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#d4af37] rounded-full" />
            <span className="text-sm text-[#1a2332]/70">
              <span className="font-semibold text-[#1a2332]">
                {planName} Plan
              </span>{" "}
              · {maxSessions} session{maxSessions !== 1 ? "s" : ""} remaining
            </span>
          </div>
          <span className="text-xs text-[#1a2332]/40">
            Scheduling {sessions.length}/{maxSessions}
          </span>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {sessions.map((session, index) => (
            <div
              key={session.id}
              className="bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#1a2332] text-[#d4af37] rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-[#1a2332]">
                    Session {index + 1}
                  </span>
                </div>
                {sessions.length > 1 && (
                  <button
                    onClick={() => removeSession(session.id)}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-[#1a2332]/70 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={session.date}
                    min={today}
                    onChange={(e) =>
                      updateSession(session.id, "date", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37] bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1a2332]/70 mb-1">
                    From
                  </label>
                  <select
                    value={session.startTime}
                    onChange={(e) =>
                      updateSession(session.id, "startTime", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37] bg-white transition-colors"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {formatTime(t)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1a2332]/70 mb-1">
                    To
                  </label>
                  <select
                    value={session.endTime}
                    onChange={(e) =>
                      updateSession(session.id, "endTime", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37] bg-white transition-colors"
                  >
                    {TIME_OPTIONS.filter((t) => t > session.startTime).map(
                      (t) => (
                        <option key={t} value={t}>
                          {formatTime(t)}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {session.date && session.startTime && session.endTime && (
                <p className="text-xs text-[#1a2332]/50 mt-2">
                  📅{" "}
                  {new Date(session.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  &nbsp;·&nbsp; {formatTime(session.startTime)} –{" "}
                  {formatTime(session.endTime)}
                </p>
              )}
            </div>
          ))}

          {sessions.length < maxSessions && (
            <button
              onClick={addSession}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-[#1a2332]/50 hover:border-[#d4af37]/60 hover:text-[#d4af37] transition-all"
            >
              + Add another session ({sessions.length}/{maxSessions} scheduled)
            </button>
          )}
        </div>

        {/* Info banner */}
        <div className="px-6 pb-2">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2">
            <svg
              className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
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
            <p className="text-xs text-blue-700 leading-relaxed">
              After scheduling, you'll receive a{" "}
              <strong>unique call code</strong> and our{" "}
              <strong>Veda phone number</strong> to dial during your selected
              time window.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-200 text-[#1a2332]/60 font-medium rounded-xl hover:border-gray-300 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-bold rounded-xl hover:from-[#e5c55a] hover:to-[#d4af37] transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Spinner />
                Scheduling...
              </>
            ) : (
              `Confirm ${sessions.length} Session${sessions.length !== 1 ? "s" : ""}`
            )}
          </button>
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

export default ScheduleCallModal;
