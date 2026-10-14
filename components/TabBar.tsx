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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-1)]/95 backdrop-blur-md border-t border-[var(--line-soft)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-xl md:max-w-2xl mx-auto grid grid-cols-5 h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 transition-all select-none cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-[#9fc4e0] hover:text-[#f4faff] opacity-70 hover:opacity-100'
              }`}
            >
              {/* Notification badge for claimable quests */}
              {tab.id === 'quests' && hasQuestClaimable && (
                <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-[var(--ok)] shadow-[0_0_6px_var(--ok)] animate-ping" />
              )}

              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isActive
                    ? 'drop-shadow-[0_0_8px_var(--glow-hi)] text-white'
                    : 'text-[#9fc4e0]'
                }`}
              />
              <span className="font-head text-[9px] tracking-[0.16em] font-bold">
                {tab.label}
              </span>

              {/* Active Tab Glowing Bottom Underline */}
              {isActive && (
                <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-[var(--glow-hi)] shadow-[0_0_10px_var(--glow)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
