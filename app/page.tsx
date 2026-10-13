'use client';

import React, { useState } from 'react';
import { SystemProvider, useSystem } from '@/lib/systemContext';
import { Header } from '@/components/Header';
import { TabBar, TabType } from '@/components/TabBar';
import { StatusTab } from '@/components/StatusTab';
import { QuestsTab } from '@/components/QuestsTab';
import { TrialTab } from '@/components/TrialTab';
import { RewardsTab } from '@/components/RewardsTab';
import { SettingsTab } from '@/components/SettingsTab';
import { OnboardingModal } from '@/components/OnboardingModal';
import { PenaltyScreen } from '@/components/PenaltyScreen';
import { LevelUpOverlay } from '@/components/LevelUpOverlay';
import { RankUpOverlay } from '@/components/RankUpOverlay';
import { NotificationModal } from '@/components/NotificationModal';
import { useThemeMusic } from '@/src/audio/useThemeMusic';

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('status');
  const {
    state,
    levelUpModal,
    rankUpModal,
    closeLevelUpModal,
    closeRankUpModal,
    notificationMessage,
    closeNotification,
  } = useSystem();

  const { setDucked } = useThemeMusic();

  // Auto-ducking: Lower music to 30% during level-up, rank-up, or notification overlays
  React.useEffect(() => {
    const isOverlayOpen = !!levelUpModal || !!rankUpModal || !!notificationMessage;
    setDucked(isOverlayOpen);
  }, [levelUpModal, rankUpModal, notificationMessage, setDucked]);

  const isQuestClaimable = state.dailyQuest.isCompleted && !state.dailyQuest.isClaimed;

  return (
    <div className="relative min-h-screen bg-[#03060D] text-[#E8F4FF] overflow-x-hidden flex flex-col justify-between">
      {/* Anime Scanline & Cyber Background */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-30 z-0" />
      <div className="fixed inset-0 scanlines pointer-events-none z-10" />

      {/* Top Header */}
      <Header />

      {/* Main Content Area: Centered Mobile-First Column */}
      <main className="relative z-20 flex-1 w-full max-w-md mx-auto px-3 sm:px-4 pt-3 pb-8">
        {activeTab === 'status' && <StatusTab />}
        {activeTab === 'quests' && <QuestsTab />}
        {activeTab === 'trial' && <TrialTab />}
        {activeTab === 'rewards' && <RewardsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      {/* Bottom Navigation Tab Bar */}
      <TabBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        hasQuestClaimable={isQuestClaimable}
      />

      {/* Overlays */}
      <OnboardingModal />
      <PenaltyScreen />
      <LevelUpOverlay info={levelUpModal} onClose={closeLevelUpModal} />
      <RankUpOverlay info={rankUpModal} onClose={closeRankUpModal} />
      <NotificationModal message={notificationMessage} onClose={closeNotification} />
    </div>
  );
}

export default function Page() {
  return (
    <SystemProvider>
      <MainApp />
    </SystemProvider>
  );
}
