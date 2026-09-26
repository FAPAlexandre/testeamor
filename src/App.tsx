/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsCounter } from './components/StatsCounter';
import { TimelineSection } from './components/TimelineSection';
import { GallerySection } from './components/GallerySection';
import { LoveMessagesSection } from './components/LoveMessagesSection';
import { WifeProfileCard } from './components/WifeProfileCard';
import { BackgroundMusic } from './components/BackgroundMusic';
import { FloatingHearts } from './components/FloatingHearts';
import { Footer } from './components/Footer';
import { AdminModal } from './components/admin/AdminModal';
import { FullAppData } from './types';
import { loadAppData, saveAppData } from './services/storage';
import { calculateRelationshipDuration } from './utils/date';

export default function App() {
  const [appData, setAppData] = useState<FullAppData>(() => loadAppData());
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('admin_authenticated_session') === 'true';
  });

  // Music state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showAutoplayBanner, setShowAutoplayBanner] = useState(true);

  // Floating hearts particle animation state
  const [floatingHearts, setFloatingHearts] = useState(
    appData.settings.floatingHeartsEnabled ?? true
  );

  // Synchronize document title with couple name
  useEffect(() => {
    if (appData.couple.coupleDisplayName) {
      document.title = `${appData.couple.coupleDisplayName} · Nossa História de Amor`;
    }
  }, [appData.couple.coupleDisplayName]);

  // Handle data updates from admin
  const handleSaveData = (newData: FullAppData) => {
    setAppData(newData);
    saveAppData(newData);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('admin_authenticated_session', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('admin_authenticated_session');
  };

  const handleToggleMusic = () => {
    setIsMusicPlaying((prev) => !prev);
    setShowAutoplayBanner(false);
  };

  const handleScrollToExplore = () => {
    const el = document.getElementById('historia');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const duration = calculateRelationshipDuration(
    appData.couple.relationshipStartDate
  );

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-stone-800 font-sans selection:bg-rose-200 selection:text-rose-900 relative">
      {/* Subtle floating heart particles */}
      <FloatingHearts enabled={floatingHearts} />

      {/* Top Navigation */}
      <Navbar
        coupleName={appData.couple.coupleDisplayName || 'Nossa História'}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onToggleMusicPlay={handleToggleMusic}
        isMusicPlaying={isMusicPlaying}
      />

      {/* Main Content Flow */}
      <main>
        {/* 1. Hero with Real-time Duration Counter */}
        <Hero
          couple={appData.couple}
          onExploreClick={handleScrollToExplore}
        />

        {/* 2. Stats Overview Counter */}
        <StatsCounter
          totalDays={duration.totalDays}
          totalPhotos={appData.photos.length}
          totalMoments={appData.timeline.length}
          totalMessages={appData.messages.length}
        />

        {/* 3. Chronological Timeline */}
        <TimelineSection
          timeline={appData.timeline}
          onOpenPhoto={(img, title) => {
            // Scroll to gallery or preview
            const gal = document.getElementById('galeria');
            if (gal) gal.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 4. Photo Gallery with Lightbox */}
        <GallerySection photos={appData.photos} />

        {/* 5. Love Messages & Letters */}
        <LoveMessagesSection
          messages={appData.messages}
          partnerName={appData.couple.partnerName}
        />

        {/* 6. Spotlight for the Wife */}
        <WifeProfileCard couple={appData.couple} />
      </main>

      {/* Background Music YouTube Player & Floating Controller */}
      <BackgroundMusic
        music={appData.music}
        isPlaying={isMusicPlaying}
        onTogglePlay={handleToggleMusic}
        showAutoplayBanner={showAutoplayBanner}
        onDismissAutoplayBanner={() => setShowAutoplayBanner(false)}
      />

      {/* Footer */}
      <Footer
        coupleName={appData.couple.coupleDisplayName}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        floatingHeartsEnabled={floatingHearts}
        onToggleFloatingHearts={() => setFloatingHearts(!floatingHearts)}
      />

      {/* Administrative Control Panel */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        appData={appData}
        onSaveData={handleSaveData}
        isLoggedIn={isAdminLoggedIn}
        onLoginSuccess={handleAdminLoginSuccess}
        onLogout={handleAdminLogout}
      />
    </div>
  );
}
