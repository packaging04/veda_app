import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from './veda/Header';
import Hero from './veda/Hero';
import TrustBadges from './veda/TrustBadges';
import HowItWorks from './veda/HowItWorks';
import LegacyBox from './veda/LegacyBox';
import ForFamilies from './veda/ForFamilies';
import Technology from './veda/Technology';
import Testimonials from './veda/Testimonials';
import Pricing from './veda/Pricing';
import GiftSection from './veda/GiftSection';
import FAQ from './veda/FAQ';
import FinalCTA from './veda/FinalCTA';
import Footer from './veda/Footer';
import ConsultationModal from './veda/ConsultationModal';
import VideoModal from './veda/VideoModal';
import ComparisonSection from './veda/ComparisonSection';
import AuthModal from './veda/AuthModal';
import Dashboard from './veda/Dashboard';

const AppLayout: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();
  const [user, setUser] = useState<any>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleNavigate = (section: string) => scrollToSection(section);
  const handleBookConsultation = () => { setSelectedPlan(undefined); setIsModalOpen(true); };
  const handleSelectPlan = (plan: string) => { setSelectedPlan(plan); setIsModalOpen(true); };
  const handleLearnMore = () => setIsVideoModalOpen(true);
  const handleAuthSuccess = () => setShowDashboard(true);

  if (showDashboard && user) {
    return <Dashboard user={user} onLogout={() => { setUser(null); setShowDashboard(false); }} onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <Header onNavigate={handleNavigate} onBookConsultation={handleBookConsultation} onOpenAuth={() => setIsAuthModalOpen(true)} user={user} onOpenDashboard={() => setShowDashboard(true)} />
      <main>
        <Hero onBookConsultation={handleBookConsultation} onLearnMore={handleLearnMore} />
        <TrustBadges />
        <HowItWorks />
        <LegacyBox onBookConsultation={handleBookConsultation} />
        <ForFamilies />
        <div id="technology"><Technology /></div>
        <ComparisonSection />
        <Testimonials />
        <Pricing onSelectPlan={handleSelectPlan} />
        <GiftSection onBookConsultation={handleBookConsultation} />
        <div id="faq"><FAQ /></div>
        <FinalCTA onBookConsultation={handleBookConsultation} />
      </main>
      <Footer onNavigate={handleNavigate} onBookConsultation={handleBookConsultation} />
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedPlan={selectedPlan} />
      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleAuthSuccess} />
    </div>
  );
};

export default AppLayout;
