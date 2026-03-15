import React from "react";
import AppLayout from "@/components/AppLayout";
import { AppProvider } from "@/contexts/AppContext";
import VedaLandingPage from "./LandingPage.tsx";

// AppLayout manages all auth state internally:
//   - Checks session on mount via supabase.auth.getSession()
//   - Listens to onAuthStateChange (handles magic links too)
//   - Shows Dashboard when logged in, landing when not
//   - Exposes Login button in Header at all times
//   - Opens ConsultationModal for demo requests
//
// VedaLandingPage is passed as children — rendered inside the landing view.

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppLayout>
        <VedaLandingPage />
      </AppLayout>
    </AppProvider>
  );
};

export default Index;
