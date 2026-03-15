import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Header from "../components/veda/Header.tsx";
import AuthModal from "../components/veda/AuthModal.tsx";
import Dashboard from "../components/veda/Dashboard.tsx";
import Pricing from "../components/veda/Pricing.tsx";
import ConsultationModal from "../components/veda/ConsultationModal.tsx";

type AppView = "landing" | "dashboard";

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [view, setView] = useState<AppView>("landing");

  const [showAuth, setShowAuth] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [authInitialPlan, setAuthInitialPlan] = useState<string | undefined>();

  const sectionRefs = useRef<Record<string, React.RefObject<HTMLElement>>>({});

  // ── Auth init ────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Check current session (handles magic link tokens too — detectSessionInUrl: true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      // If already logged in, go straight to dashboard
      if (session?.user) setView("dashboard");
      setLoadingAuth(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);
        // Magic link sign-in: auto-redirect to dashboard
        if (newUser && _event === "SIGNED_IN") setView("dashboard");
        if (_event === "SIGNED_OUT") setView("landing");
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ── Navigation ───────────────────────────────────────────────────────────────
  const handleNavigate = (section: string) => {
    if (view === "dashboard") {
      setView("landing");
      setTimeout(() => scrollToSection(section), 100);
    } else {
      scrollToSection(section);
    }
  };

  const scrollToSection = (section: string) => {
    if (sectionRefs.current?.[section]?.current) {
      sectionRefs.current[section].current?.scrollIntoView({
        behavior: "smooth",
      });
      return;
    }
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // ── Auth callbacks ───────────────────────────────────────────────────────────
  const handleAuthSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
    setShowAuth(false);
    setView("dashboard");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView("landing");
  };

  // ── Plan selection from Pricing section ─────────────────────────────────────
  const handleSelectPlan = (planId: string) => {
    if (user) {
      setView("dashboard");
    } else {
      setAuthInitialPlan(planId);
      setShowAuth(true);
    }
  };

  // ── Loading screen ───────────────────────────────────────────────────────────
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
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-[#d4af37]/60 text-sm tracking-widest font-medium">
            VEDA
          </p>
        </div>
      </div>
    );
  }

  // ── Dashboard view ───────────────────────────────────────────────────────────
  if (view === "dashboard" && user) {
    return (
      <>
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onBack={() => setView("landing")}
          onUpgrade={() => setShowUpgrade(true)}
        />
        {showUpgrade && (
          <AuthModal
            isOpen={showUpgrade}
            initialMode="upgrade"
            onClose={() => setShowUpgrade(false)}
            onSuccess={(updatedUser) => {
              setUser(updatedUser);
              setShowUpgrade(false);
            }}
          />
        )}
      </>
    );
  }

  // ── Landing view ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
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

      <main>
        {children}

        {!children && (
          <div className="pt-20">
            <Pricing
              onSelectPlan={handleSelectPlan}
              onRequestDemo={() => setShowDemo(true)}
            />
          </div>
        )}
      </main>

      {/* ─── Modals ───────────────────────────────────────────────────────────── */}
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
