'use client';

import { useSyncExternalStore } from 'react';
import { themeMusic, MusicState, MUSIC_DEFAULT } from './themeMusic';

const SERVER_MUSIC_STATE: MusicState = {
  isPlaying: false,
  enabled: true,
  volume: MUSIC_DEFAULT,
  currentTrack: null,
  playlist: [],
  isDucked: false,
};

const subscribe = (callback: () => void) => themeMusic.subscribe(callback);
const getSnapshot = () => themeMusic.getState();
const getServerSnapshot = () => SERVER_MUSIC_STATE;

export function useThemeMusic() {
  const musicState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const togglePlay = () => {
    themeMusic.togglePlay();
  };

  const toggleEnabled = () => {
    themeMusic.setEnabled(!musicState.enabled);
  };

  const setVolume = (vol: number) => {
    themeMusic.setVolume(vol);
  };

  const setDucked = (ducked: boolean) => {
    themeMusic.setDucked(ducked);
  };

  const triggerUserInteraction = () => {
    themeMusic.triggerUserInteraction();
  };

  return {
    ...musicState,
    togglePlay,
    toggleEnabled,
    setVolume,
    setDucked,
    triggerUserInteraction,
  };
}
