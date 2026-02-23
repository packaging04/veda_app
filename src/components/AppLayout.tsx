import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Header from "../components/veda/Header.tsx";
import AuthModal from "../components/veda/AuthModal.tsx";
import Dashboard from "../components/veda/Dashboard.tsx";
import Pricing from "../components/veda/Pricing.tsx";

// ─── View types ────────────────────────────────────────────────────────────────
type AppView = "landing" | "dashboard";

// ─── ConsultationModal (Request a Demo) ───────────────────────────────────────
const ConsultationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!email || !name) return;
    // In production: send to a form endpoint / Supabase table
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0d1520]/95 backdrop-blur-lg"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#d4af37] via-[#e5c55a] to-[#c9a227]" />
        <div className="p-8">
          {!submitted ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#d4af37]/10 rounded-xl flex items-center justify-center text-2xl">
                  🎬
                </div>
                <div>
                  <h3 className="text-xl font-serif text-[#1a2332]">
                    Request a Demo
                  </h3>
                  <p className="text-sm text-[#1a2332]/50">
                    We'll reach out to schedule a live walkthrough
                  </p>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-[#1a2332]/60 tracking-wider block mb-1.5">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-[#f5f1e8] rounded-xl text-[#1a2332] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1a2332]/60 tracking-wider block mb-1.5">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-[#f5f1e8] rounded-xl text-[#1a2332] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1a2332]/60 tracking-wider block mb-1.5">
                    TELL US ABOUT YOUR INTEREST
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Who would you like to preserve wisdom for?"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#f5f1e8] rounded-xl text-[#1a2332] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 resize-none"
                  />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!email || !name}
                className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-bold rounded-xl hover:from-[#e5c55a] hover:to-[#d4af37] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Request Demo →
              </button>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-serif text-[#1a2332] mb-2">
                Request Received!
              </h3>
              <p className="text-sm text-[#1a2332]/60 mb-6">
                Thanks, {name}! We'll be in touch at {email} shortly to schedule
                your live demo.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#1a2332] text-[#d4af37] font-bold rounded-xl hover:bg-[#2a3342] transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// ─── Main AppLayout ────────────────────────────────────────────────────────────
interface AppLayoutProps {
  /** Pass in your existing landing page sections as children */
  children?: React.ReactNode;
  /** Optional: sections ref map for scroll navigation */
  sectionRefs?: Record<string, React.RefObject<HTMLElement>>;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, sectionRefs }) => {
  const [view, setView] = useState<AppView>("landing");
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Modal states
  const [showAuth, setShowAuth] = useState(false);
  const [authInitialPlan, setAuthInitialPlan] = useState<string | undefined>(
    undefined,
  );
  const [showDemo, setShowDemo] = useState(false);

  // ─── Auth listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoadingAuth(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const handleNavigate = (section: string) => {
    if (view === "dashboard") {
      setView("landing");
      // slight delay to let landing render before scrolling
      setTimeout(() => scrollToSection(section), 100);
    } else {
      scrollToSection(section);
    }
  };

  const scrollToSection = (section: string) => {
    if (sectionRefs?.[section]?.current) {
      sectionRefs[section].current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    // fallback: find by id
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // ─── Auth callbacks ─────────────────────────────────────────────────────────
  const handleAuthSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
    setShowAuth(false);
    setView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setView("landing");
  };

  // ─── Plan selection from Pricing section ────────────────────────────────────
  const handleSelectPlan = (planId: string) => {
    if (user) {
      // Already logged in — go to dashboard (could trigger upgrade flow)
      setView("dashboard");
    } else {
      setAuthInitialPlan(planId);
      setShowAuth(true);
    }
  };

  // ─── Loading screen ─────────────────────────────────────────────────────────
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#1a2332] flex items-center justify-center">
        <div className="text-center">
          <svg
            width="56"
            height="56"
            viewBox="0 0 48 48"
            className="text-[#d4af37] mx-auto mb-4 animate-pulse"
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
          <p className="text-[#d4af37]/60 text-sm tracking-wider font-serif">
            VEDA
          </p>
        </div>
      </div>
    );
  }

  // ─── Dashboard view ─────────────────────────────────────────────────────────
  if (view === "dashboard" && user) {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
        onBack={() => setView("landing")}
      />
    );
  }

  // ─── Landing view ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <Header
        onNavigate={handleNavigate}
        onRequestDemo={() => setShowDemo(true)}
        onOpenAuth={() => {
          setAuthInitialPlan(undefined);
          setShowAuth(true);
        }}
        user={user}
        onOpenDashboard={() => setView("dashboard")}
      />

      {/* Landing page content */}
      <main>
        {children}

        {/* If no children provided, render Pricing as a fallback section */}
        {!children && (
          <div className="pt-20">
            <Pricing
              onSelectPlan={handleSelectPlan}
              onRequestDemo={() => setShowDemo(true)}
            />
          </div>
        )}
      </main>

      {/* ─── Modals ─────────────────────────────────────────────────────────── */}
      {showAuth && (
        <AuthModal
          isOpen={showAuth}
          initialPlan={authInitialPlan}
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {showDemo && (
        <ConsultationModal
          isOpen={showDemo}
          onClose={() => setShowDemo(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
