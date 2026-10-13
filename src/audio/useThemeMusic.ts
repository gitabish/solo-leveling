'use client';

import { useState, useEffect } from 'react';
import { themeMusic, MusicState } from './themeMusic';

export function useThemeMusic() {
  const [musicState, setMusicState] = useState<MusicState>(() => themeMusic.getState());

  useEffect(() => {
    const unsubscribe = themeMusic.subscribe((state) => {
      setMusicState(state);
    });
    return unsubscribe;
  }, []);

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
