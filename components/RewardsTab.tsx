'use client';

import React, { useState } from 'react';
import { useSystem } from '@/lib/systemContext';
import { SystemWindow } from './SystemWindow';
import { SystemButton } from './SystemButton';
import { InventoryItem, Title } from '@/lib/types';
import {
  Package,
  FlaskConical,
  Shield,
  Zap,
  RefreshCw,
  Award,
  Sparkles,
  Check,
  Sword,
  Crown,
} from 'lucide-react';

export function RewardsTab() {
  const { state, consumeInventoryItem, equipTitle, chooseJob } = useSystem();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const rarityColors = {
    normal: { text: 'text-[#E8F4FF]', border: 'border-[#7FA6C9]/40', bg: 'bg-[#0A162B]' },
    rare: { text: 'text-[#3FA9FF]', border: 'border-[#2F8CFF]', bg: 'bg-[#0B234D]' },
    epic: { text: 'text-[#D8B4FE]', border: 'border-[#8B5CFF]', bg: 'bg-[#210D3D]' },
    legendary: { text: 'text-[#FFC857]', border: 'border-[#FFC857]', bg: 'bg-[#33220A]' },
  };

  const itemIcons: Record<string, React.ElementType> = {
    FlaskConical,
    Shield,
    Zap,
    RefreshCw,
  };

  const jobsList = [
    { title: 'Fighter', desc: 'Specialized in raw strength and devastating physical output.', minLvl: 40 },
    { title: 'Agile Assassin', desc: 'Excels in swift reflexes, rapid cadences, and agility.', minLvl: 40 },
    { title: 'Endurance Hunter', desc: 'Immense stamina and vital durability under immense strain.', minLvl: 40 },
    { title: 'Shadow Sovereign', desc: 'Monarch of death and shadows. Commands supreme authority.', minLvl: 70 },
  ];

  return (
    <div className="space-y-4 pb-20 select-none font-body">
      {/* Inventory Slots Window */}
      <SystemWindow title="INVENTORY STORAGE">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-[#7FA6C9]">
            <span>STORED ARTIFACTS & POTIONS</span>
            <span className="text-[#7DF9FF]">
              {state.inventory.reduce((acc, i) => acc + i.quantity, 0)} Items Total
            </span>
          </div>

          {/* Grid slots (Anime inventory grid) */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
            {state.inventory.map((item) => {
              const rStyle = rarityColors[item.rarity] || rarityColors.normal;
              const Icon = itemIcons[item.icon] || Package;
              const isSelected = selectedItem?.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`relative aspect-square flex flex-col items-center justify-center p-2 rounded-xs border transition-all cursor-pointer ${
                    rStyle.bg
                  } ${isSelected ? 'border-[#7DF9FF] shadow-[0_0_12px_#7DF9FF]' : rStyle.border}`}
                >
                  <Icon className={`w-6 h-6 ${rStyle.text}`} />
                  <span className="text-[9px] truncate max-w-full text-[#E8F4FF] mt-1 text-center">
                    {item.name.split(' ')[0]}
                  </span>

                  {/* Quantity Badge */}
                  <span className="absolute top-1 right-1 px-1 rounded-xs bg-[#03060D]/90 text-[9px] font-bold text-[#7DF9FF]">
                    x{item.quantity}
                  </span>
                </button>
              );
            })}

            {/* Empty slots placeholders */}
            {Array.from({ length: Math.max(0, 10 - state.inventory.length) }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="aspect-square rounded-xs border border-[#2F8CFF]/15 bg-[#050D1C]/40 flex items-center justify-center text-[#7FA6C9]/20"
              >
                <Package className="w-5 h-5 opacity-20" />
              </div>
            ))}
          </div>

          {/* Selected Item Details */}
          {selectedItem && (
            <div className="mt-4 p-3 rounded-xs bg-[#071329] border border-[#2F8CFF]/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`text-sm font-bold ${rarityColors[selectedItem.rarity].text}`}>
                    {selectedItem.name}
                  </h4>
                  <span className="text-[10px] text-[#7FA6C9] uppercase">
                    Rarity: {selectedItem.rarity}
                  </span>
                </div>
                <span className="text-xs text-[#7DF9FF] font-bold">
                  Remaining: {selectedItem.quantity}
                </span>
              </div>

              <p className="text-xs text-[#E8F4FF]/90 leading-relaxed">
                {selectedItem.description}
              </p>

              <div className="pt-2 flex justify-end">
                <SystemButton
                  variant="primary"
                  size="md"
                  disabled={selectedItem.quantity <= 0}
                  onClick={() => {
                    consumeInventoryItem(selectedItem.id);
                    // refresh selected
                    const updated = state.inventory.find((i) => i.id === selectedItem.id);
                    if (updated && updated.quantity <= 1) {
                      setSelectedItem(null);
                    }
                  }}
                  className="w-full sm:w-auto"
                >
                  {selectedItem.quantity > 0 ? 'USE ITEM' : 'DEPLETED'}
                </SystemButton>
              </div>
            </div>
          )}
        </div>
      </SystemWindow>

      {/* Earned Titles Showcase */}
      <SystemWindow title="ACQUIRED TITLES" variant="blue">
        <div className="space-y-3">
          <p className="text-xs text-[#7FA6C9] leading-relaxed">
            Honorary designations bestowed by the System upon achieving momentous milestones.
          </p>

          <div className="space-y-2">
            {state.titles.map((title) => {
              const isActive = state.activeTitle === title.name;

              return (
                <div
                  key={title.id}
                  className={`p-3 rounded-xs border transition-all ${
                    title.unlocked
                      ? isActive
                        ? 'bg-[#1D1808]/80 border-[#FFC857] shadow-[0_0_10px_rgba(255,200,87,0.3)]'
                        : 'bg-[#071329]/70 border-[#2F8CFF]/40'
                      : 'bg-[#040914]/50 border-[#2F8CFF]/15 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold flex items-center gap-1.5 ${
                        title.unlocked ? (isActive ? 'text-[#FFC857]' : 'text-[#7DF9FF]') : 'text-[#7FA6C9]'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      [ {title.name} ]
                    </span>

                    {title.unlocked ? (
                      isActive ? (
                        <span className="text-[10px] text-[#FFC857] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> EQUIPPED
                        </span>
                      ) : (
                        <button
                          onClick={() => equipTitle(title.name)}
                          className="text-[10px] text-[#7DF9FF] hover:underline cursor-pointer"
                        >
                          EQUIP TITLE
                        </button>
                      )
                    ) : (
                      <span className="text-[10px] text-[#7FA6C9]">LOCKED</span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#7FA6C9]">{title.description}</p>
                  <div className="text-[10px] text-[#3DFFA2] mt-1">Effect: {title.effect}</div>
                </div>
              );
            })}
          </div>
        </div>
      </SystemWindow>

      {/* Job Change Window */}
      <SystemWindow
        title="JOB ADVANCEMENT"
        variant={state.job !== 'None' ? 'violet' : 'blue'}
      >
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#7FA6C9]">CURRENT VOCATION:</span>
            <span className="text-sm font-bold text-[#D8B4FE]">
              {state.job === 'None' ? 'None (Unassigned)' : `[ ${state.job} ]`}
            </span>
          </div>

          <p className="text-[11px] text-[#7FA6C9] leading-relaxed">
            Attaining Level 40 unlocks specialized Class Pathways. Job acceptance resonates through the System, infusing your aura with Monarch Violet.
          </p>

          <div className="space-y-2 pt-1">
            {jobsList.map((job) => {
              const isSelected = state.job === job.title;
              const isEligible = state.level >= job.minLvl;

              return (
                <div
                  key={job.title}
                  className={`p-2.5 rounded-xs border flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#2A0E4E] border-[#8B5CFF] text-[#E8D8FF]'
                      : 'bg-[#07101F]/80 border-[#2F8CFF]/20 text-[#7FA6C9]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#E8F4FF]">{job.title}</span>
                      <span className="text-[10px] text-[#7DF9FF]">Lvl {job.minLvl}+</span>
                    </div>
                    <p className="text-[10px] text-[#7FA6C9] max-w-[220px]">{job.desc}</p>
                  </div>

                  <div>
                    {isSelected ? (
                      <span className="text-[10px] font-bold text-[#D8B4FE]">ACTIVE</span>
                    ) : (
                      <button
                        disabled={!isEligible}
                        onClick={() => chooseJob(job.title)}
                        className={`text-[10px] px-2 py-1 rounded-xs border font-cyber transition-all ${
                          isEligible
                            ? 'bg-[#8B5CFF]/25 border-[#8B5CFF] text-[#D8B4FE] hover:bg-[#8B5CFF]/50 cursor-pointer'
                            : 'bg-transparent border-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isEligible ? 'ACCEPT JOB' : `LVL ${job.minLvl}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SystemWindow>
    </div>
  );
}
