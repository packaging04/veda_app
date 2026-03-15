import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ── Only this email can access the admin panel ────────────────────────────────
// Update this to your actual Veda admin email
const ADMIN_EMAIL = "yhemi06@gmail.com";

type DemoRequest = {
  id: string;
  name?: string; // legacy column — old rows only have this
  first_name?: string; // new column — nullable for old rows
  last_name?: string;
  email: string;
  phone?: string;
  relationship?: string;
  elder_name?: string;
  message?: string;
  plan?: string;
  status: "pending" | "approved" | "rejected";
  approved_at?: string;
  created_at: string;
};

const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Login form (for admin to sign in)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_e, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) fetchRequests();
  }, [user, filter]);

  const fetchRequests = async () => {
    setLoadingData(true);
    let query = supabase
      .from("demo_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") query = query.eq("status", filter);

    const { data, error } = await query;
    if (!error) setRequests(data || []);
    setLoadingData(false);
  };

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = async (req: DemoRequest) => {
    setProcessing(req.id);
    try {
      // 1. Mark as approved
      const { error: updateErr } = await supabase
        .from("demo_requests")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
        })
        .eq("id", req.id);

      if (updateErr) throw updateErr;

      // 2. Send magic link invite — user gets an email to sign in/create account
      //    signInWithOtp creates the user if they don't exist yet
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: req.email,
        options: {
          emailRedirectTo: window.location.origin,
          // Pass name so it's available in auth.users metadata
          data: { first_name: req.first_name, last_name: req.last_name || "" },
        },
      });

      if (otpErr) {
        // Non-fatal — approval still went through, just couldn't send magic link
        showToast(
          `✅ Approved! (Magic link failed: ${otpErr.message} — share signup link manually)`,
          "error",
        );
      } else {
        showToast(`✅ Approved & invite sent to ${req.email}`);
      }

      fetchRequests();
    } catch (err: any) {
      showToast(`Error: ${err.message}`, "error");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (req: DemoRequest) => {
    if (
      !confirm(
        `Reject request from ${req.first_name || req.name || req.email}?`,
      )
    )
      return;
    setProcessing(req.id);
    try {
      await supabase
        .from("demo_requests")
        .update({ status: "rejected" })
        .eq("id", req.id);
      showToast(`Rejected request from ${req.email}`);
      fetchRequests();
    } catch (err: any) {
      showToast(`Error: ${err.message}`, "error");
    } finally {
      setProcessing(null);
    }
  };

  const handleResendInvite = async (req: DemoRequest) => {
    setProcessing(req.id + "-resend");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: req.email,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      showToast(`📧 Invite re-sent to ${req.email}`);
    } catch (err: any) {
      showToast(`Failed to resend: ${err.message}`, "error");
    } finally {
      setProcessing(null);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
      if (data.user?.email !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
        throw new Error("This account does not have admin access.");
      }
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // ── States ──────────────────────────────────────────────────────────────────

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#1a2332] flex items-center justify-center">
        <div className="text-[#d4af37] animate-pulse font-serif text-2xl">
          VEDA
        </div>
      </div>
    );
  }

  // Not logged in — show admin login form
  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a2332] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#d4af37] via-[#e5c55a] to-[#c9a227]" />
          <div className="p-8">
            <div className="text-center mb-6">
              <p className="text-xs font-bold text-[#1a2332]/40 tracking-widest mb-2">
                VEDA ADMIN
              </p>
              <h2 className="text-xl font-serif text-[#1a2332]">
                Admin Sign In
              </h2>
            </div>
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {loginError}
              </div>
            )}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Admin email"
                required
                className="w-full px-4 py-3 bg-[#f5f1e8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
              />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 bg-[#f5f1e8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
              />
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-[#1a2332] text-[#d4af37] font-bold rounded-xl hover:bg-[#2a3342] transition-colors disabled:opacity-50"
              >
                {loginLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <p className="text-center text-xs text-[#1a2332]/30 mt-4">
              <a href="/" className="hover:underline">
                ← Back to site
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Logged in but not admin
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#1a2332] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-serif text-[#1a2332] mb-2">
            Access Denied
          </h2>
          <p className="text-sm text-[#1a2332]/60 mb-6">
            This panel is restricted to the Veda admin account.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
            >
              Sign Out
            </button>
            <a
              href="/"
              className="flex-1 py-2 bg-[#1a2332] text-[#d4af37] font-bold rounded-xl text-sm text-center hover:bg-[#2a3342]"
            >
              Back to Site
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Admin panel ──────────────────────────────────────────────────────────────
  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-[#1a2332] shadow-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            <span className="font-serif text-[#d4af37] text-lg tracking-wider">
              VEDA
            </span>
            <span className="text-white/30 text-sm">/ Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-xs text-[#d4af37]/60 hover:text-[#d4af37]"
            >
              ← Back to site
            </a>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-xs text-[#d4af37] hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-serif text-[#1a2332]">Demo Requests</h1>
          <p className="text-sm text-[#1a2332]/50 mt-0.5">
            Review and approve access requests. Approving sends a magic link to
            the user's email.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {(["all", "pending", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-xl p-4 text-left transition-all border ${
                filter === s
                  ? "bg-[#1a2332] border-[#1a2332] text-white"
                  : "bg-white border-gray-100 text-[#1a2332] hover:border-[#d4af37]/40"
              }`}
            >
              <div
                className={`text-2xl font-serif font-bold ${
                  filter === s ? "text-[#d4af37]" : "text-[#1a2332]"
                }`}
              >
                {s === "all"
                  ? requests.length
                  : requests.filter((r) => r.status === s).length}
              </div>
              <div
                className={`text-xs capitalize mt-0.5 ${filter === s ? "text-white/60" : "text-[#1a2332]/50"}`}
              >
                {s}
              </div>
            </button>
          ))}
        </div>

        {/* Requests list */}
        {loadingData ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.filter((r) => filter === "all" || r.status === filter)
            .length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-[#1a2332]/50 font-medium">
              No {filter === "all" ? "" : filter} requests
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests
              .filter((r) => filter === "all" || r.status === filter)
              .map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Request header */}
                  <div
                    className="p-5 flex items-start justify-between cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === req.id ? null : req.id)
                    }
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1a2332] flex items-center justify-center text-[#d4af37] font-bold text-sm flex-shrink-0">
                        {(req.first_name || req.name || "?")[0].toUpperCase()}
                        {req.last_name?.[0]?.toUpperCase() || ""}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-[#1a2332]">
                            {req.first_name || req.name || req.email}{" "}
                            {req.last_name || ""}
                          </p>
                          <StatusBadge status={req.status} />
                        </div>
                        <p className="text-sm text-[#1a2332]/60">{req.email}</p>
                        {req.phone && (
                          <p className="text-xs text-[#1a2332]/40">
                            {req.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-[#1a2332]/40">
                        {new Date(req.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <svg
                        className={`w-4 h-4 text-[#1a2332]/30 transition-transform ${expandedId === req.id ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedId === req.id && (
                    <div className="px-5 pb-5 border-t border-gray-50">
                      <div className="pt-4 grid sm:grid-cols-2 gap-4 mb-4">
                        {req.relationship && (
                          <Detail
                            label="Requesting for"
                            value={req.relationship}
                          />
                        )}
                        {req.elder_name && (
                          <Detail
                            label="Person's name"
                            value={req.elder_name}
                          />
                        )}
                        {req.plan && (
                          <Detail label="Plan interest" value={req.plan} />
                        )}
                        {req.approved_at && (
                          <Detail
                            label="Approved on"
                            value={new Date(req.approved_at).toLocaleString()}
                          />
                        )}
                      </div>
                      {req.message && (
                        <div className="bg-[#f5f1e8] rounded-xl p-4 mb-4">
                          <p className="text-xs font-semibold text-[#1a2332]/50 mb-1">
                            MESSAGE
                          </p>
                          <p className="text-sm text-[#1a2332]/80 leading-relaxed">
                            {req.message}
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2 flex-wrap">
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(req)}
                              disabled={processing === req.id}
                              className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl text-sm hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {processing === req.id ? (
                                <>
                                  <Spinner /> Processing...
                                </>
                              ) : (
                                <>✓ Approve & Send Invite</>
                              )}
                            </button>
                            <button
                              onClick={() => handleReject(req)}
                              disabled={!!processing}
                              className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}
                        {req.status === "approved" && (
                          <button
                            onClick={() => handleResendInvite(req)}
                            disabled={processing === req.id + "-resend"}
                            className="px-4 py-2 bg-[#d4af37]/15 text-[#1a2332] font-bold rounded-xl text-sm hover:bg-[#d4af37]/25 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {processing === req.id + "-resend" ? (
                              <>
                                <Spinner /> Sending...
                              </>
                            ) : (
                              <>📧 Resend Invite</>
                            )}
                          </button>
                        )}
                        {req.status === "rejected" && (
                          <button
                            onClick={() => handleApprove(req)}
                            disabled={processing === req.id}
                            className="px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded-xl text-sm hover:bg-blue-100 transition-colors disabled:opacity-50"
                          >
                            ↩ Reverse & Approve
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-600",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
};

const Detail: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-xs font-semibold text-[#1a2332]/40 tracking-wide mb-0.5">
      {label.toUpperCase()}
    </p>
    <p className="text-sm text-[#1a2332] capitalize">{value}</p>
  </div>
);

const Spinner = () => (
  <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
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

export default AdminPanel;
