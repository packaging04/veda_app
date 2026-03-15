import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ScheduleCallModal from "../modals/ScheduleCallModal.tsx";
import CallInfoModal from "./CallInfoModal";
import ProfileCompletionModal from "./ProfileCompletionModal";
import { PLANS } from "./AuthModal";

interface DashboardProps {
  user: any;
  onLogout: () => void;
  onBack: () => void;
  onUpgrade?: () => void;
}

const VEDA_PHONE_NUMBER = "+2342017001158";

const Dashboard: React.FC<DashboardProps> = ({
  user,
  onLogout,
  onBack,
  onUpgrade,
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "calls" | "recordings"
  >("overview");
  const [loading, setLoading] = useState(true);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCallInfo, setShowCallInfo] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [callInfoData, setCallInfoData] = useState<{
    callCode: string;
    phoneNumber: string;
    scheduledCount: number;
  } | null>(null);

  const [toasts, setToasts] = useState<
    { id: string; msg: string; type: "success" | "error" }[]
  >([]);

  const toast = (msg: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000,
    );
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      const { data: schedulesData } = await supabase
        .from("inbound_schedules")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_date", { ascending: true });
      setSchedules(schedulesData || []);

      const { data: recordingsData } = await supabase
        .from("call_recordings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setRecordings(recordingsData || []);
    } catch (e) {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const plan =
    PLANS.find((p) => p.id === profile?.subscription_plan) || PLANS[0];
  const profileComplete = profile?.profile_completed;
  const callsRemaining = profile?.calls_remaining ?? 0;
  const isPaidPlan =
    profile?.subscription_plan &&
    profile.subscription_plan !== "free" &&
    profile.subscription_plan !== "none";

  const upcomingCalls = schedules.filter(
    (s) => s.status === "scheduled" && !isSessionPast(s),
  );
  const pastScheduledCalls = schedules.filter(
    (s) => s.status === "scheduled" && isSessionPast(s),
  );
  const completedCalls = schedules.filter((s) => s.status === "completed");

  return (
    <div className="min-h-screen bg-[#f5f1e8] font-sans">
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 pointer-events-auto animate-slide-in ${
              t.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {t.type === "success" ? "✓" : "✕"} {t.msg}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="bg-[#1a2332] sticky top-0 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-1.5 text-[#d4af37]/60 hover:text-[#d4af37] transition-colors rounded-lg hover:bg-white/5"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 48 48"
                className="text-[#d4af37]"
              >
                <path
                  d="M8 12 L24 38 L40 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-lg font-serif tracking-wider text-[#d4af37]">
                VEDA
              </span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/10" />
            <span className="hidden sm:block text-sm text-white/50">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-white/50">Signed in as</p>
              <p className="text-sm text-white font-medium">
                {profile?.first_name || user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-[#d4af37] hover:underline px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome banner */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-[#1a2332]">
            Good to see you, {profile?.first_name || "Friend"} 👋
          </h1>
          <p className="text-[#1a2332]/55 mt-1">
            Your wisdom preservation dashboard
          </p>
        </div>

        {/* Profile incomplete banner */}
        {!profileComplete && (
          <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                📝
              </div>
              <div>
                <p className="font-bold text-amber-900">
                  Complete your profile to unlock scheduling
                </p>
                <p className="text-sm text-amber-700 mt-0.5">
                  Answer a few quick questions so we can personalize your wisdom
                  sessions.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex-shrink-0 px-4 py-2 bg-amber-500 text-white font-bold rounded-xl text-sm hover:bg-amber-600 transition-colors"
            >
              Complete Now →
            </button>
          </div>
        )}

        {/* Plan upgrade banner for free users */}
        {profile?.subscription_plan === "free" && profileComplete && (
          <div className="mb-6 bg-[#1a2332] border border-[#d4af37]/30 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white">You're on the Free plan</p>
              <p className="text-sm text-white/60 mt-0.5">
                Call {VEDA_PHONE_NUMBER} to hear the Veda AI. Upgrade to start
                real wisdom sessions with your personal call code.
              </p>
            </div>
            <button
              onClick={onUpgrade}
              className="flex-shrink-0 px-4 py-2 bg-[#d4af37] text-[#1a2332] font-bold rounded-xl text-sm hover:bg-[#e5c55a] transition-colors"
            >
              Upgrade Plan
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm w-fit border border-gray-100">
          {(["overview", "calls", "recordings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-[#1a2332] text-[#d4af37] shadow"
                  : "text-[#1a2332]/60 hover:text-[#1a2332]"
              }`}
            >
              {tab === "calls"
                ? "Scheduled Calls"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <StatCard
                    icon="📅"
                    value={upcomingCalls.length}
                    label="Upcoming Sessions"
                    color="blue"
                  />
                  <StatCard
                    icon="✅"
                    value={completedCalls.length}
                    label="Completed Sessions"
                    color="green"
                  />
                  <StatCard
                    icon="🎙️"
                    value={recordings.length}
                    label="Recordings Saved"
                    color="gold"
                  />
                </div>
                {pastScheduledCalls.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <p className="font-semibold text-amber-900 text-sm">
                          {pastScheduledCalls.length} session window
                          {pastScheduledCalls.length > 1
                            ? "s have"
                            : " has"}{" "}
                          elapsed
                        </p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          These sessions passed without a call. Schedule new
                          ones if you still need them.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("calls")}
                      className="flex-shrink-0 text-xs font-bold text-amber-800 hover:underline"
                    >
                      View →
                    </button>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Plan info */}
                  <div className="bg-[#1a2332] rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-[#d4af37]/70 font-medium tracking-widest">
                        CURRENT PLAN
                      </span>
                      <span className="text-xs px-2 py-1 bg-[#d4af37]/20 text-[#d4af37] rounded-full font-medium capitalize">
                        {profile?.subscription_plan || "Free"}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif text-[#d4af37] mb-1">
                      {plan?.name || "Free"}
                    </h3>
                    <p className="text-white/50 text-sm mb-4">
                      {plan?.price || "$0"}/month
                    </p>
                    <div className="bg-white/5 rounded-xl p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">
                          Sessions remaining
                        </span>
                        <span className="text-xl font-bold text-[#d4af37]">
                          {callsRemaining}
                        </span>
                      </div>
                      {isPaidPlan && (
                        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#d4af37] rounded-full transition-all"
                            style={{
                              width: `${Math.max(5, (callsRemaining / (plan?.calls || 1)) * 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {profile?.subscription_plan !== "premium" && (
                      <button
                        onClick={onUpgrade}
                        className="w-full py-2 text-xs font-bold text-[#d4af37] border border-[#d4af37]/30 rounded-xl hover:bg-[#d4af37]/10 transition-colors"
                      >
                        Upgrade Plan ↗
                      </button>
                    )}
                  </div>

                  {/* Schedule CTA */}
                  <div
                    className={`rounded-2xl p-6 flex flex-col justify-between ${
                      profileComplete && isPaidPlan
                        ? "bg-gradient-to-br from-[#d4af37] to-[#c9a227] text-[#1a2332]"
                        : "bg-white border-2 border-dashed border-gray-200"
                    }`}
                  >
                    <div>
                      <div className="text-3xl mb-3">
                        {profileComplete && isPaidPlan ? "📞" : "🔒"}
                      </div>
                      <h3
                        className={`text-lg font-serif mb-2 ${profileComplete && isPaidPlan ? "text-[#1a2332]" : "text-[#1a2332]/60"}`}
                      >
                        {profileComplete && isPaidPlan
                          ? "Ready to schedule your next session?"
                          : "Schedule a Call"}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed mb-4 ${profileComplete && isPaidPlan ? "text-[#1a2332]/70" : "text-[#1a2332]/40"}`}
                      >
                        {!profileComplete
                          ? "Complete your profile first to unlock call scheduling."
                          : !isPaidPlan
                            ? "Upgrade to a paid plan to schedule personal wisdom sessions."
                            : `You have ${callsRemaining} session${callsRemaining !== 1 ? "s" : ""} available. Pick a time and we'll give you your call code.`}
                      </p>
                    </div>
                    <button
                      disabled={
                        !profileComplete || !isPaidPlan || callsRemaining === 0
                      }
                      onClick={() => setShowScheduleModal(true)}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                        profileComplete && isPaidPlan && callsRemaining > 0
                          ? "bg-[#1a2332] text-[#d4af37] hover:bg-[#2a3342] shadow-lg"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {callsRemaining === 0 && isPaidPlan
                        ? "No sessions remaining"
                        : "Schedule a Call →"}
                    </button>
                  </div>
                </div>

                {/* Free plan number */}
                {profile?.subscription_plan === "free" && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="font-medium text-[#1a2332] mb-0.5">
                        Generic Veda Number (Free Plan)
                      </p>
                      <p className="text-xs text-[#1a2332]/50">
                        Call this number to hear our AI — no personal session,
                        no recording.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-[#1a2332] text-lg">
                        {VEDA_PHONE_NUMBER}
                      </p>
                      <p className="text-xs text-[#1a2332]/40">
                        No code required
                      </p>
                    </div>
                  </div>
                )}

                {upcomingCalls.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-serif text-[#1a2332]">
                        Upcoming Sessions
                      </h3>
                      <button
                        onClick={() => setActiveTab("calls")}
                        className="text-xs text-[#d4af37] hover:underline"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="space-y-2">
                      {upcomingCalls.slice(0, 3).map((s) => (
                        <SessionItem key={s.id} session={s} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CALLS TAB */}
            {activeTab === "calls" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-serif text-[#1a2332]">
                    Scheduled Sessions
                  </h2>
                  {profileComplete && isPaidPlan && callsRemaining > 0 && (
                    <button
                      onClick={() => setShowScheduleModal(true)}
                      className="px-4 py-2 bg-[#d4af37] text-[#1a2332] font-bold rounded-xl text-sm hover:bg-[#e5c55a] transition-colors shadow"
                    >
                      + Schedule a Call
                    </button>
                  )}
                </div>
                {schedules.length === 0 ? (
                  <EmptyState
                    icon="📅"
                    title="No sessions scheduled yet"
                    desc="Schedule a call to receive your personal call code and Veda phone number."
                    action={
                      profileComplete && isPaidPlan
                        ? () => setShowScheduleModal(true)
                        : undefined
                    }
                    actionLabel="Schedule your first session"
                  />
                ) : (
                  <div className="space-y-3">
                    {upcomingCalls.length > 0 && (
                      <>
                        <p className="text-xs font-bold text-[#1a2332]/40 uppercase tracking-widest mb-2">
                          Upcoming
                        </p>
                        {upcomingCalls.map((s) => (
                          <SessionCard key={s.id} session={s} />
                        ))}
                      </>
                    )}
                    {completedCalls.length > 0 && (
                      <>
                        <p className="text-xs font-bold text-[#1a2332]/40 uppercase tracking-widest mt-4 mb-2">
                          Completed
                        </p>
                        {completedCalls.map((s) => (
                          <SessionCard key={s.id} session={s} />
                        ))}
                      </>
                    )}
                    {pastScheduledCalls.length > 0 && (
                      <>
                        <p className="text-xs font-bold text-amber-500/70 uppercase tracking-widest mt-4 mb-2">
                          Past (window elapsed)
                        </p>
                        {pastScheduledCalls.map((s) => (
                          <SessionCard key={s.id} session={s} isPast />
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* RECORDINGS TAB */}
            {activeTab === "recordings" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-serif text-[#1a2332]">
                      Wisdom Recordings
                    </h2>
                    <p className="text-sm text-[#1a2332]/50 mt-0.5">
                      Each recording is securely saved after a verified session.
                    </p>
                  </div>
                </div>
                {recordings.length === 0 ? (
                  <EmptyState
                    icon="🎙️"
                    title="No recordings yet"
                    desc="When you complete a call with your personal code, a recording entry will appear here."
                  />
                ) : (
                  <div className="space-y-4">
                    {recordings.map((rec) => (
                      <RecordingCard key={rec.id} rec={rec} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      {showProfileModal && (
        <ProfileCompletionModal
          isOpen={showProfileModal}
          userId={user.id}
          firstName={profile?.first_name || ""}
          onComplete={() => {
            setShowProfileModal(false);
            fetchData();
            toast("Profile completed! You can now schedule calls.");
          }}
        />
      )}

      {showScheduleModal && (
        <ScheduleCallModal
          isOpen={showScheduleModal}
          userId={user.id}
          planCallsRemaining={callsRemaining}
          planName={plan?.name || "Standard"}
          onClose={() => setShowScheduleModal(false)}
          onSuccess={(data: {
            callCode: string;
            phoneNumber: string;
            scheduledCount: number;
          }) => {
            setShowScheduleModal(false);
            setCallInfoData(data);
            setShowCallInfo(true);
            fetchData();
          }}
          onError={(msg: string) => toast(msg, "error")}
        />
      )}

      {showCallInfo && callInfoData && (
        <CallInfoModal
          isOpen={showCallInfo}
          callCode={callInfoData.callCode}
          phoneNumber={callInfoData.phoneNumber}
          scheduledCount={callInfoData.scheduledCount}
          onClose={() => {
            setShowCallInfo(false);
            setActiveTab("calls");
          }}
        />
      )}
    </div>
  );
};

// Sub-components

const StatCard: React.FC<{
  icon: string;
  value: number;
  label: string;
  color: string;
}> = ({ icon, value, label, color }) => {
  const colors: Record<string, string> = {
    blue: "from-blue-50 to-blue-100/50 border-blue-100",
    green: "from-green-50 to-green-100/50 border-green-100",
    gold: "from-amber-50 to-amber-100/50 border-amber-100",
  };
  return (
    <div
      className={`bg-gradient-to-br ${colors[color] || colors.blue} border rounded-2xl p-5`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-serif font-bold text-[#1a2332]">
        {value}
      </div>
      <div className="text-sm text-[#1a2332]/55 mt-0.5">{label}</div>
    </div>
  );
};

const SessionItem: React.FC<{ session: any }> = ({ session }) => {
  const past = isSessionPast(session) && session.status === "scheduled";
  return (
    <div
      className={`rounded-xl px-4 py-3 border flex items-center justify-between shadow-sm ${past ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-gray-100"}`}
    >
      <div>
        <p
          className={`text-sm font-medium ${past ? "text-[#1a2332]/50 line-through" : "text-[#1a2332]"}`}
        >
          {new Date(session.scheduled_date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
        <p className="text-xs text-[#1a2332]/50">
          {formatTime12(session.start_time)} – {formatTime12(session.end_time)}
          {past && " · elapsed"}
        </p>
      </div>
      <span
        className={`font-mono text-xs font-bold px-2 py-1 rounded-lg ${past ? "text-[#1a2332]/30 bg-gray-100" : "text-[#d4af37] bg-[#d4af37]/10"}`}
      >
        {session.call_code}
      </span>
    </div>
  );
};

const SessionCard: React.FC<{ session: any; isPast?: boolean }> = ({
  session,
  isPast = false,
}) => (
  <div
    className={`rounded-2xl p-5 border shadow-sm ${isPast ? "bg-gray-50 border-gray-200 opacity-70" : "bg-white border-gray-100"}`}
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`w-2 h-2 rounded-full ${
              isPast
                ? "bg-amber-400"
                : session.status === "scheduled"
                  ? "bg-amber-400"
                  : "bg-green-500"
            }`}
          />
          <span className="text-xs font-medium text-[#1a2332]/60 capitalize">
            {isPast ? "window elapsed" : session.status}
          </span>
        </div>
        <p
          className={`font-medium ${isPast ? "text-[#1a2332]/50 line-through" : "text-[#1a2332]"}`}
        >
          {new Date(session.scheduled_date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-sm text-[#1a2332]/60">
          {formatTime12(session.start_time)} – {formatTime12(session.end_time)}
        </p>
      </div>
      <span
        className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${
          isPast
            ? "text-[#1a2332]/30 bg-gray-100 border-gray-200"
            : "text-[#d4af37] bg-[#d4af37]/10 border-[#d4af37]/20"
        }`}
      >
        {session.call_code}
      </span>
    </div>
    {!isPast && (
      <div className="bg-[#f5f1e8] rounded-xl p-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-[#1a2332]/50 font-medium">
            Dial this number during your window
          </p>
          <p className="font-mono font-bold text-[#1a2332]">
            {session.phone_number || "+2342017001158"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#1a2332]/50 font-medium">Your PIN</p>
          <p className="font-mono font-bold text-[#d4af37] text-lg">
            {session.call_code}
          </p>
        </div>
      </div>
    )}
    {isPast && (
      <div className="bg-amber-50 rounded-xl p-3">
        <p className="text-xs text-amber-700">
          ⏰ This time window has passed. The call code above is no longer
          valid. Schedule a new session to get a fresh one.
        </p>
      </div>
    )}
  </div>
);

const EmptyState: React.FC<{
  icon: string;
  title: string;
  desc: string;
  action?: () => void;
  actionLabel?: string;
}> = ({ icon, title, desc, action, actionLabel }) => (
  <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="font-serif text-[#1a2332] mb-2">{title}</h3>
    <p className="text-sm text-[#1a2332]/50 max-w-sm mx-auto mb-4">{desc}</p>
    {action && (
      <button
        onClick={action}
        className="text-sm text-[#d4af37] font-semibold hover:underline"
      >
        {actionLabel} →
      </button>
    )}
  </div>
);

const RecordingCard: React.FC<{ rec: any }> = ({ rec }) => {
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [audioError, setAudioError] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const duration = rec.duration_seconds
    ? `${Math.floor(rec.duration_seconds / 60)}:${String(rec.duration_seconds % 60).padStart(2, "0")}`
    : null;

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => setAudioError(true));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Hidden real <audio> element — no download, browser handles CORS */}
      {rec.recording_url && (
        <audio
          ref={audioRef}
          src={rec.recording_url}
          preload="metadata"
          controlsList="nodownload"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setProgress(0);
          }}
          onError={() => setAudioError(true)}
          onTimeUpdate={() => {
            const audio = audioRef.current;
            if (audio && audio.duration) {
              setProgress((audio.currentTime / audio.duration) * 100);
            }
          }}
          style={{ display: "none" }}
        />
      )}

      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#d4af37]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-[#d4af37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[#1a2332] text-sm">
                {rec.session_title || "Wisdom Session"}
              </p>
              <p className="text-xs text-[#1a2332]/50 mt-0.5">
                {new Date(rec.created_at).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {" · "}
                {new Date(rec.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {duration && ` · ${duration}`}
              </p>
            </div>
          </div>
          <span className="flex-shrink-0 text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
            ✓ Saved
          </span>
        </div>

        {/* Audio player */}
        {rec.recording_url && !audioError ? (
          <div className="mt-4 bg-[#1a2332] rounded-xl px-4 py-3 flex items-center gap-3">
            <button
              onClick={handlePlay}
              className="w-9 h-9 rounded-full bg-[#d4af37] flex items-center justify-center flex-shrink-0 hover:bg-[#e5c55a] transition-colors"
            >
              {playing ? (
                <svg
                  className="w-4 h-4 text-[#1a2332]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-[#1a2332] ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={(e) => {
                const audio = audioRef.current;
                if (!audio || !audio.duration) return;
                const rect = (
                  e.currentTarget as HTMLElement
                ).getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                audio.currentTime = pct * audio.duration;
              }}
            >
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d4af37] rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-white/40 flex-shrink-0 w-12 text-right">
              {playing ? "●" : duration || "Play"}
            </span>
          </div>
        ) : (
          <div className="mt-4 bg-[#f5f1e8] rounded-xl px-4 py-3">
            <p className="text-xs text-[#1a2332]/50">
              {audioError
                ? "⚠️ Audio unavailable — recording is archived securely."
                : "🎙️ Recording securely archived in your Veda legacy vault."}
            </p>
          </div>
        )}
      </div>

      {/* Transcript */}
      {rec.transcript && (
        <div className="border-t border-gray-50 px-5 py-4">
          <p className="text-xs font-semibold text-[#1a2332]/40 tracking-wide mb-2">
            TRANSCRIPT
          </p>
          <p className="text-sm text-[#1a2332]/70 leading-relaxed line-clamp-4">
            {rec.transcript}
          </p>
        </div>
      )}
    </div>
  );
};

// Returns true if the session's end time has already passed
function isSessionPast(s: any): boolean {
  if (!s.scheduled_date) return false;
  const endTime = s.end_time || s.start_time || "23:59";
  const [year, month, day] = s.scheduled_date.split("-").map(Number);
  const [hour, minute] = endTime.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute) < new Date();
}

function formatTime12(t: string): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}

export default Dashboard;
