'use client';

import React, { useState } from 'react';
import { useSystem } from '@/lib/systemContext';
import { SystemWindow } from './SystemWindow';
import { SystemButton } from './SystemButton';
import {
  Volume2,
  VolumeX,
  Music,
  Bell,
  Play,
  Smartphone,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useThemeMusic } from '@/src/audio/useThemeMusic';
import { themeMusic } from '@/src/audio/themeMusic';
import { sound } from '@/lib/sound';

export function SettingsTab() {
  const music = useThemeMusic();
  const [hasCustomSfx, setHasCustomSfx] = useState(() => sound.hasCustomPopup());

  React.useEffect(() => {
    sound.checkAndInitCustomSfx().then((exists) => {
      setHasCustomSfx(exists);
    });
  }, []);
  const {
    state,
    updateSettings,
    updatePlayerName,
    resetProgress,
    addExp,
    triggerPenaltyTest,
    simulateNextDay,
    showNotification,
  } = useSystem();

  const [nameInput, setNameInput] = useState(state.playerName);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetConfirmCount, setResetConfirmCount] = useState(0);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updatePlayerName(nameInput.trim());
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `system_player_save_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('System backup data successfully exported.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.rank && parsed.level) {
          localStorage.setItem('SOLO_LEVELING_SYSTEM_STATE_V1', JSON.stringify(parsed));
          window.location.reload();
        } else {
          showNotification('Invalid System backup payload structure.');
        }
      } catch (err) {
        showNotification('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetClick = () => {
    if (resetConfirmCount === 0) {
      setResetConfirmCount(1);
    } else {
      resetProgress();
      setResetConfirmOpen(false);
      setResetConfirmCount(0);
    }
  };

  return (
    <div className="space-y-4 pb-20 select-none font-cyber">
      {/* Configuration Window */}
      <SystemWindow title="SYSTEM PREFERENCES" variant="blue">
        <div className="space-y-4 text-xs">
          {/* Player Name Change */}
          <form onSubmit={handleSaveName} className="space-y-2">
            <label className="text-[#7FA6C9] uppercase text-xs tracking-wider">Designation (Player Name)</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Hunter Designation"
                className="flex-1 bg-[#03060D] border border-[#2F8CFF]/50 px-3.5 h-10 text-sm leading-normal text-[#E8F4FF] rounded-xs focus:outline-none focus:border-[#7DF9FF] focus:ring-1 focus:ring-[#7DF9FF]/40 font-cyber box-border"
              />
              <SystemButton type="submit" variant="primary" size="md" className="h-10 shrink-0">
                UPDATE
              </SystemButton>
            </div>
          </form>

          {/* Unit System */}
          <div className="flex items-center justify-between border-t border-[#2F8CFF]/20 pt-3">
            <div>
              <div className="text-[#E8F4FF] font-bold">Measurement Units</div>
              <div className="text-[10px] text-[#7FA6C9]">Distance and body weight units</div>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => updateSettings({ units: 'metric' })}
                className={`px-3 py-1 text-xs rounded-xs border font-cyber ${
                  state.settings.units === 'metric'
                    ? 'bg-[#2F8CFF]/30 border-[#7DF9FF] text-[#7DF9FF]'
                    : 'bg-[#07101F] border-[#2F8CFF]/30 text-[#7FA6C9]'
                }`}
              >
                METRIC (KM)
              </button>
              <button
                onClick={() => updateSettings({ units: 'imperial' })}
                className={`px-3 py-1 text-xs rounded-xs border font-cyber ${
                  state.settings.units === 'imperial'
                    ? 'bg-[#2F8CFF]/30 border-[#7DF9FF] text-[#7DF9FF]'
                    : 'bg-[#07101F] border-[#2F8CFF]/30 text-[#7FA6C9]'
                }`}
              >
                IMPERIAL (MI)
              </button>
            </div>
          </div>

          {/* Sound Effects SFX */}
          <div className="border-t border-[#2F8CFF]/20 pt-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#E8F4FF] font-bold">Acoustic Resonance (System SFX)</div>
                <div className="text-[10px] text-[#7FA6C9]">UI popups, alerts & level-up fanfares</div>
              </div>
              <button
                onClick={() => updateSettings({ soundEnabled: !state.settings.soundEnabled })}
                className={`px-3 py-1 text-xs rounded-xs border font-cyber flex items-center gap-1.5 cursor-pointer ${
                  state.settings.soundEnabled
                    ? 'bg-[#2F8CFF]/30 border-[#7DF9FF] text-[#7DF9FF]'
                    : 'bg-[#07101F] border-[#2F8CFF]/30 text-[#7FA6C9]'
                }`}
              >
                {state.settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                {state.settings.soundEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            {/* Custom Popup Sound Manager */}
            <div className="p-2.5 rounded-xs bg-[#051021] border border-[#2F8CFF]/30 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#7FA6C9] flex items-center gap-1.5">
                  <Bell className="w-3 h-3 text-[#7DF9FF]" />
                  Popup & Alert Ding Sound:
                </span>
                <span className={hasCustomSfx ? 'text-[#3DFFA2] font-bold' : 'text-[#7DF9FF]'}>
                  {hasCustomSfx ? 'Custom (src/audio/sfx/popup.mp3)' : 'Default (Synthesizer)'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#2F8CFF]/15">
                <button
                  type="button"
                  onClick={() => sound.playSystemDing()}
                  className="px-2.5 py-1 text-[10px] rounded-xs bg-[#07101F] hover:bg-[#2F8CFF]/20 border border-[#2F8CFF]/40 text-[#7DF9FF] font-cyber flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Play className="w-2.5 h-2.5" />
                  TEST DING
                </button>

                <label className="px-2.5 py-1 text-[10px] rounded-xs bg-[#2F8CFF]/20 hover:bg-[#2F8CFF]/40 border border-[#2F8CFF]/60 hover:border-[#7DF9FF] text-[#7DF9FF] font-cyber cursor-pointer flex items-center gap-1 transition-all">
                  <Upload className="w-2.5 h-2.5" />
                  UPLOAD POPUP SFX (.MP3)
                  <input
                    type="file"
                    accept="audio/*,.mp3,.wav,.ogg,.m4a"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append('file', file);
                      try {
                        const res = await fetch('/api/sfx/upload', {
                          method: 'POST',
                          body: formData,
                        });
                        if (res.ok) {
                          await sound.reloadCustomSfx();
                          setHasCustomSfx(true);
                          sound.playSystemDing();
                          showNotification('Custom popup sound saved to src/audio/sfx/popup.mp3!');
                        } else {
                          showNotification('Failed to save sound effect file.');
                        }
                      } catch {
                        showNotification('Error uploading sound effect.');
                      }
                    }}
                  />
                </label>
              </div>
              <div className="text-[9px] text-[#7FA6C9]/80">
                You can also drop files directly into <code className="text-[#7DF9FF]">src/audio/sfx/popup.mp3</code>
              </div>
            </div>
          </div>

          {/* Theme Background Music */}
          <div className="border-t border-[#2F8CFF]/20 pt-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#E8F4FF] font-bold flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#7DF9FF]" />
                  Background Theme Music
                </div>
                <div className="text-[10px] text-[#7FA6C9]">
                  Auto-playlist from <code className="text-[#7DF9FF]">src/audio/theme/</code>
                </div>
              </div>
              <button
                onClick={music.togglePlay}
                className={`px-3 py-1 text-xs rounded-xs border font-cyber flex items-center gap-1.5 cursor-pointer ${
                  music.isPlaying
                    ? 'bg-[#2F8CFF]/30 border-[#7DF9FF] text-[#7DF9FF]'
                    : 'bg-[#07101F] border-[#2F8CFF]/30 text-[#7FA6C9]'
                }`}
              >
                {music.isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                {music.isPlaying ? 'PLAYING' : 'OFF'}
              </button>
            </div>

            {/* Strict 30-40% volume slider */}
            <div className="p-2.5 rounded-xs bg-[#051021] border border-[#2F8CFF]/30 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#7FA6C9]">Music Volume (Hard-clamped: 30% – 40%):</span>
                <span className="text-[#7DF9FF] font-bold">
                  {Math.round(music.volume * 100)}%
                  {music.isDucked && <span className="text-[#FFC857] text-[10px] ml-1">(Ducked)</span>}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#7FA6C9]">30%</span>
                <input
                  type="range"
                  min="30"
                  max="40"
                  step="1"
                  value={Math.round(music.volume * 100)}
                  disabled={!music.enabled}
                  onChange={(e) => music.setVolume(parseInt(e.target.value, 10) / 100)}
                  className="flex-1 accent-[#7DF9FF] cursor-pointer disabled:opacity-40"
                />
                <span className="text-[10px] text-[#7FA6C9]">40%</span>
              </div>
              {music.currentTrack && (
                <div className="text-[10px] text-[#7FA6C9] flex items-center justify-between pt-1 border-t border-[#2F8CFF]/15">
                  <span>Current Track:</span>
                  <span className="text-[#E8F4FF] font-semibold truncate max-w-[180px]">
                    {music.currentTrack}
                  </span>
                </div>
              )}

              {/* Upload or Replace Theme Track */}
              <div className="pt-2 border-t border-[#2F8CFF]/20 flex items-center justify-between">
                <span className="text-[10px] text-[#7FA6C9]">Upload Custom Theme:</span>
                <label className="px-2.5 py-1 rounded-xs bg-[#2F8CFF]/20 hover:bg-[#2F8CFF]/40 border border-[#2F8CFF]/60 hover:border-[#7DF9FF] text-[#7DF9FF] text-[10px] font-cyber cursor-pointer flex items-center gap-1 transition-all">
                  <Upload className="w-3 h-3" />
                  UPLOAD SONG (.MP3)
                  <input
                    type="file"
                    accept="audio/*,.mp3,.wav,.ogg,.m4a"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append('file', file);
                      try {
                        const res = await fetch('/api/theme-music/upload', {
                          method: 'POST',
                          body: formData,
                        });
                        if (res.ok) {
                          const data = await res.json();
                          await themeMusic.fetchPlaylist();
                          themeMusic.unlockAndPlay();
                          showNotification(`Theme track updated: [ ${data.filename} ]. Playing now.`);
                        } else {
                          showNotification('Failed to upload audio file.');
                        }
                      } catch {
                        showNotification('Error uploading audio track.');
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#2F8CFF]/20 pt-3">
            <div>
              <div className="text-[#E8F4FF] font-bold">Tactile Vibration (Haptics)</div>
              <div className="text-[10px] text-[#7FA6C9]">Mobile physical pulse feedback</div>
            </div>
            <button
              onClick={() => updateSettings({ hapticEnabled: !state.settings.hapticEnabled })}
              className={`px-3 py-1 text-xs rounded-xs border font-cyber flex items-center gap-1.5 ${
                state.settings.hapticEnabled
                  ? 'bg-[#2F8CFF]/30 border-[#7DF9FF] text-[#7DF9FF]'
                  : 'bg-[#07101F] border-[#2F8CFF]/30 text-[#7FA6C9]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              {state.settings.hapticEnabled ? 'ENABLED' : 'OFF'}
            </button>
          </div>

          {/* Theme Resonance Aura */}
          <div className="flex items-center justify-between border-t border-[#2F8CFF]/20 pt-3">
            <div>
              <div className="text-[#E8F4FF] font-bold">Aura Spectral Tone</div>
              <div className="text-[10px] text-[#7FA6C9]">System interface radiance</div>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => updateSettings({ themeAura: 'blue' })}
                className={`px-2.5 py-1 text-xs rounded-xs border ${
                  state.settings.themeAura === 'blue'
                    ? 'bg-[#2F8CFF]/30 border-[#7DF9FF] text-[#7DF9FF]'
                    : 'bg-[#07101F] border-[#2F8CFF]/30 text-[#7FA6C9]'
                }`}
              >
                AZURE
              </button>
              <button
                onClick={() => updateSettings({ themeAura: 'violet' })}
                className={`px-2.5 py-1 text-xs rounded-xs border ${
                  state.settings.themeAura === 'violet'
                    ? 'bg-[#8B5CFF]/30 border-[#D8B4FE] text-[#D8B4FE]'
                    : 'bg-[#07101F] border-[#2F8CFF]/30 text-[#7FA6C9]'
                }`}
              >
                VIOLET
              </button>
            </div>
          </div>
        </div>
      </SystemWindow>

      {/* Backup and Data Window */}
      <SystemWindow title="DATA & SYNCHRONIZATION" variant="blue">
        <div className="space-y-3 text-xs">
          <p className="text-[11px] text-[#7FA6C9]">
            All biological and progression telemetry is strictly persisted within your device local storage.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <SystemButton
              variant="outline"
              size="md"
              onClick={handleExportJSON}
              className="flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              EXPORT JSON
            </SystemButton>

            <label className="flex items-center justify-center gap-1.5 px-4 py-2 border border-[#2F8CFF]/60 hover:border-[#7DF9FF] rounded-xs bg-transparent text-[#E8F4FF] cursor-pointer text-xs font-cyber font-semibold uppercase">
              <Upload className="w-3.5 h-3.5" />
              IMPORT JSON
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>

          <div className="pt-2 border-t border-[#2F8CFF]/20">
            <SystemButton
              variant="danger"
              size="md"
              onClick={() => {
                setResetConfirmOpen(true);
                setResetConfirmCount(0);
              }}
              className="w-full flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              RESET SYSTEM PROGRESS
            </SystemButton>
          </div>
        </div>
      </SystemWindow>

      {/* Developer & Simulation Controls */}
      <SystemWindow title="SYSTEM TESTING MATRIX" variant="violet">
        <div className="space-y-3 text-xs">
          <p className="text-[11px] text-[#D8B4FE]">
            Diagnostic utilities to simulate long-term progression, level-ups, daily resets, and penalty survival mechanics:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addExp(50)}
              className="p-2 rounded-xs bg-[#1F0A3D] border border-[#8B5CFF]/50 text-[#D8B4FE] hover:bg-[#341166] text-left cursor-pointer"
            >
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FFC857]" /> +50 EXP
              </div>
              <div className="text-[9px] text-[#D8B4FE]/70">Simulate quest EXP</div>
            </button>

            <button
              onClick={() => addExp(200)}
              className="p-2 rounded-xs bg-[#1F0A3D] border border-[#8B5CFF]/50 text-[#D8B4FE] hover:bg-[#341166] text-left cursor-pointer"
            >
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FFC857]" /> +200 EXP (Level Up)
              </div>
              <div className="text-[9px] text-[#D8B4FE]/70">Trigger level up fanfare</div>
            </button>

            <button
              onClick={simulateNextDay}
              className="p-2 rounded-xs bg-[#1F0A3D] border border-[#8B5CFF]/50 text-[#D8B4FE] hover:bg-[#341166] text-left cursor-pointer"
            >
              <div className="font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#7DF9FF]" /> Next 24h Day
              </div>
              <div className="text-[9px] text-[#D8B4FE]/70">Generates fresh quest</div>
            </button>

            <button
              onClick={triggerPenaltyTest}
              className="p-2 rounded-xs bg-[#2F0B13] border border-[#FF3B4E]/50 text-[#FF9EAA] hover:bg-[#4D1220] text-left cursor-pointer"
            >
              <div className="font-bold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-[#FF3B4E]" /> Trigger Penalty Zone
              </div>
              <div className="text-[9px] text-[#FF9EAA]/70">Test desert survival zone</div>
            </button>
          </div>
        </div>
      </SystemWindow>

      {/* About line */}
      <div className="p-3 text-center text-[10px] text-[#7FA6C9]/70 space-y-1">
        <p>Fan-made, not affiliated with the Solo Leveling IP owners.</p>
        <p className="text-[#2F8CFF]/50">SYSTEM VERSION 1.0.0 • SYSTEM DIRECTIVE ACTIVE</p>
      </div>

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-xs">
            <SystemWindow title="DATA DESTRUCTION WARNING" variant="danger">
              <div className="space-y-4 text-center">
                <AlertTriangle className="w-10 h-10 text-[#FF3B4E] mx-auto animate-pulse" />
                <div className="text-xs text-[#FFE8EA] leading-relaxed">
                  {resetConfirmCount === 0
                    ? 'Are you certain you wish to wipe all Player progress, level, ability points, and titles?'
                    : 'FINAL CONFIRMATION: This action is permanent and cannot be undone. Re-initialize System?'}
                </div>

                <div className="flex gap-2 pt-2">
                  <SystemButton
                    variant="danger"
                    size="md"
                    onClick={handleResetClick}
                    className="flex-1"
                  >
                    {resetConfirmCount === 0 ? 'CONFIRM RESET' : 'ERASE ALL DATA'}
                  </SystemButton>
                  <SystemButton
                    variant="subtle"
                    size="md"
                    onClick={() => {
                      setResetConfirmOpen(false);
                      setResetConfirmCount(0);
                    }}
                    className="flex-1"
                  >
                    CANCEL
                  </SystemButton>
                </div>
              </div>
            </SystemWindow>
          </div>
        </div>
      )}
    </div>
  );
}
