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
import { AuraParticles } from '@/components/AuraParticles';
import { useThemeMusic } from '@/src/audio/useThemeMusic';

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('status');
  const {
    state,
    isHydrated,
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

  if (!isHydrated) {
    return (
      <div className="relative min-h-screen anime-system-bg overflow-x-hidden flex flex-col justify-between">
        <AuraParticles />
        <header className="relative w-full border-b border-[var(--line-soft)] bg-[var(--bg-1)]/90 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 z-30">
          <div className="max-w-xl md:max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xs border border-[var(--line-soft)] bg-[var(--bg-0)] flex items-center justify-center font-head font-bold text-xs text-[var(--glow-hi)]">
                E
              </div>
              <div className="flex flex-col">
                <span className="font-head text-xs sm:text-sm font-bold tracking-wider text-white">
                  SYSTEM
                </span>
                <span className="text-[10px] font-head text-[#9fc4e0]">INITIALIZING</span>
              </div>
            </div>
          </div>
        </header>
        <main className="relative z-20 flex-1 flex flex-col items-center justify-center p-4">
          <div className="border border-[var(--line)] bg-[var(--bg-1)]/90 px-6 py-5 rounded-xs shadow-[0_0_24px_rgba(47,155,255,0.3)] text-center space-y-2 max-w-sm w-full">
            <div className="font-head text-sm text-[var(--glow-hi)] tracking-widest animate-pulse font-bold">
              [ SYNCHRONIZING SYSTEM ]
            </div>
            <div className="text-[10px] font-head text-[#9fc4e0] tracking-wider">
              CONNECTING TO PLAYER REGISTRY
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen anime-system-bg text-[#f4faff] overflow-x-hidden flex flex-col justify-between font-body">
      {/* Background Anime Particles & Atmosphere */}
      <AuraParticles />

      {/* Top Header */}
      <Header />

      {/* Main Content Area: Centered Responsive Column */}
      <main className="relative z-20 flex-1 w-full max-w-xl md:max-w-2xl mx-auto px-3 sm:px-4 pt-3 pb-24">
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
