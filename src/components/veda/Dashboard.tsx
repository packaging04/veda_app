import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import LovedOnes from "@/components/veda/LovedOnes";
import ScheduleCallModal from "@/components/modals/schedule-call-modal";
import ToastContainer, { useToast } from "@/components/ui/toast-container";
import { LovedOne } from "@/lib/types";

interface DashboardProps {
  user: any;
  onLogout: () => void;
  onBack: () => void;
}


const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onBack }) => {
  const [profile, setProfile] = useState<any>(null);
  const [lovedOnes, setLovedOnes] = useState<LovedOne[]>([]);
  const [calls, setCalls] = useState<any[]>([]);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedLovedOne, setSelectedLovedOne] = useState<LovedOne | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const { toasts, removeToast, success, error } = useToast();

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

      const { data: lovedData } = await supabase
        .from("loved_ones")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setLovedOnes(lovedData || []);

      const { data: callsData } = await supabase
        .from("scheduled_calls")
        .select("*, loved_ones(name)")
        .eq("user_id", user.id)
        .order("scheduled_date", { ascending: true });
      setCalls(callsData || []);

      const { data: recordingsData } = await supabase
        .from("recordings")
        .select("*, loved_ones(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setRecordings(recordingsData || []);
    } catch (err: any) {
      error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const handleScheduleCall = (lovedOne: LovedOne) => {
    if (!lovedOne.phone) {
      error(
        "Please add a phone number for this loved one before scheduling a call"
      );
      return;
    }
    setSelectedLovedOne(lovedOne);
    setShowScheduleModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <header className="bg-[#1a2332] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-[#d4af37] hover:text-[#e5c55a]"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div className="flex items-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 48 48"
                className="text-[#d4af37]"
              >
                <path
                  d="M8 12 L24 38 L40 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="ml-2 text-lg font-serif tracking-wider text-[#d4af37]">
                VEDA
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#f5f1e8]/70">
              {profile?.first_name || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-[#d4af37] hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-[#1a2332]">
            Welcome back, {profile?.first_name || "Friend"}
          </h1>
          <p className="text-[#1a2332]/60">
            Manage your family's legacy preservation journey
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#1a2332]/10">
          {["overview", "loved-ones", "calls", "recordings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-sm font-medium capitalize ${
                activeTab === tab
                  ? "text-[#d4af37] border-b-2 border-[#d4af37]"
                  : "text-[#1a2332]/60 hover:text-[#1a2332]"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-[#d4af37] border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid md:grid-cols-3 gap-6">
                <StatCard
                  icon={
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  }
                  value={lovedOnes.length}
                  label="Loved Ones"
                />
                <StatCard
                  icon={
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  value={calls.filter((c) => c.status === "scheduled").length}
                  label="Upcoming Calls"
                />
                <StatCard
                  icon={
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  }
                  value={recordings.length}
                  label="Recordings"
                />
                <div className="md:col-span-3 bg-[#1a2332] p-6 rounded-lg text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#d4af37] text-sm mb-1">
                        Subscription Status
                      </p>
                      <h3 className="text-xl font-serif">
                        {profile?.subscription_plan === "none"
                          ? "No Active Plan"
                          : profile?.subscription_plan}
                      </h3>
                      <p className="text-[#f5f1e8]/60 text-sm mt-1">
                        {profile?.subscription_status === "active"
                          ? "Your subscription is active"
                          : "Upgrade to start your legacy journey"}
                      </p>
                    </div>
                    <button className="px-6 py-3 bg-[#d4af37] text-[#1a2332] font-semibold rounded-sm hover:bg-[#e5c55a]">
                      {profile?.subscription_plan === "none"
                        ? "Choose a Plan"
                        : "Manage Plan"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loved Ones Tab */}
            {activeTab === "loved-ones" && (
              <LovedOnes
                lovedOnes={lovedOnes}
                userId={user.id}
                onUpdate={fetchData}
                onScheduleCall={handleScheduleCall}
                onSuccess={success}
                onError={error}
              />
            )}

            {/* Calls Tab */}
            {activeTab === "calls" && (
              <div>
                <h2 className="text-xl font-serif text-[#1a2332] mb-6">
                  Scheduled Calls
                </h2>
                {calls.length === 0 ? (
                  <div className="bg-white p-12 rounded-lg text-center">
                    <p className="text-[#1a2332]/60">No calls scheduled yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {calls.map((call) => (
                      <div
                        key={call.id}
                        className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium text-[#1a2332]">
                            {call.loved_ones?.name}
                          </h3>
                          <p className="text-[#1a2332]/60 text-sm">
                            {new Date(call.scheduled_date).toLocaleString()} •{" "}
                            {call.duration_minutes} mins
                          </p>
                          {call.notes && (
                            <p className="text-[#1a2332]/50 text-xs mt-1 italic">
                              {call.notes}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            call.status === "scheduled"
                              ? "bg-[#d4af37]/20 text-[#d4af37]"
                              : call.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {call.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recordings Tab */}
            {activeTab === "recordings" && (
              <div>
                <h2 className="text-xl font-serif text-[#1a2332] mb-6">
                  Wisdom Recordings
                </h2>
                {recordings.length === 0 ? (
                  <div className="bg-white p-12 rounded-lg text-center">
                    <p className="text-[#1a2332]/60">
                      No recordings yet. Complete calls to build your wisdom
                      library.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {recordings.map((rec) => (
                      <div
                        key={rec.id}
                        className="bg-white p-6 rounded-lg shadow-sm"
                      >
                        <h3 className="font-medium text-[#1a2332]">
                          {rec.title}
                        </h3>
                        <p className="text-[#1a2332]/60 text-sm">
                          {rec.loved_ones?.name} •{" "}
                          {rec.duration_seconds
                            ? `${Math.floor(rec.duration_seconds / 60)} min`
                            : "Duration unknown"}
                        </p>
                        <button className="mt-4 text-[#d4af37] text-sm font-medium hover:underline">
                          Play Recording
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Schedule Call Modal */}
      {showScheduleModal && selectedLovedOne && (
        <ScheduleCallModal
          isOpen={showScheduleModal}
          lovedOne={selectedLovedOne}
          userId={user.id}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedLovedOne(null);
          }}
          onSuccess={(message) => {
            success(message);
            fetchData();
          }}
          onError={error}
        />
      )}
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: number;
  label: string;
}> = ({ icon, value, label }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="text-[#d4af37] mb-2">{icon}</div>
    <h3 className="text-2xl font-serif text-[#1a2332]">{value}</h3>
    <p className="text-[#1a2332]/60 text-sm">{label}</p>
  </div>
);

export default Dashboard;
