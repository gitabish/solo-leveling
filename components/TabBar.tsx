'use client';

import React from 'react';
import { User, Swords, Target, Package, Settings } from 'lucide-react';
import { sound } from '@/lib/sound';

export type TabType = 'status' | 'quests' | 'trial' | 'rewards' | 'settings';

interface TabBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  hasQuestClaimable?: boolean;
}

export function TabBar({ activeTab, onChangeTab, hasQuestClaimable = false }: TabBarProps) {
  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'status', label: 'STATUS', icon: User },
    { id: 'quests', label: 'QUESTS', icon: Swords },
    { id: 'trial', label: 'TRIAL', icon: Target },
    { id: 'rewards', label: 'REWARDS', icon: Package },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  const handleTabClick = (tabId: TabType) => {
    if (activeTab !== tabId) {
      sound.playClick();
      onChangeTab(tabId);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#03060D]/95 backdrop-blur-md border-t border-[#2F8CFF]/30 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto grid grid-cols-5 h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 transition-all select-none ${
                isActive
                  ? 'text-[#7DF9FF]'
                  : 'text-[#7FA6C9] hover:text-[#E8F4FF] opacity-70 hover:opacity-100'
              }`}
            >
              {/* Active Tab Glowing Top Indicator */}
              {isActive && (
                <div className="absolute top-0 left-2 right-2 h-[2px] bg-[#7DF9FF] shadow-[0_0_8px_#7DF9FF]" />
              )}

              {/* Notification badge for claimable quests */}
              {tab.id === 'quests' && hasQuestClaimable && (
                <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-[#3DFFA2] shadow-[0_0_6px_#3DFFA2] animate-ping" />
              )}

              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'drop-shadow-[0_0_6px_#7DF9FF]' : ''}`} />
              <span className="font-cyber text-[9px] tracking-wider font-semibold">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
