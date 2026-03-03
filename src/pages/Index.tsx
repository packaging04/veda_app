
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import VedaLandingPage from './LandingPage.tsx';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <VedaLandingPage />
    </AppProvider>
  );
};

export default Index;
