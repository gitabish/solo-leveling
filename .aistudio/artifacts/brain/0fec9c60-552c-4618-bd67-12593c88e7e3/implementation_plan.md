# Custom Popup Sound Effects Module

A dedicated sound effects folder structure and audio loader allowing players to customize popup and notification sounds (e.g., `popup.mp3` / `ding.mp3`) with seamless Web Audio fallback.

### User Review & Critical Decisions

> [!IMPORTANT]
> Based on your answers:
> - **Sound Effect Category**: Popup and notification dings (`playSystemDing`).
> - **Storage Strategy**: Dedicated audio directory `src/audio/sfx/` with static mirroring in `public/audio/sfx/`, plus in-app upload capability in Settings.

- **Confirmed Decision 1**: Create a dedicated sound effects directory at `src/audio/sfx/` specifically for popup and alert sound effects.
- **Confirmed Decision 2**: If no custom file is present, the app smoothly falls back to the existing synthesized Web Audio sci-fi chime without throwing any errors.
- **Confirmed Decision 3**: Provide both a folder drop workflow (`src/audio/sfx/popup.mp3`) and an in-app file uploader under Settings > Acoustic Resonance.

---

## 1. Overview & Core Concept

Currently, theme music is housed in `src/audio/theme/`, while UI sound effects are synthesized in real-time via Web Audio oscillators in `lib/sound.ts`. This feature separates sound effects into a dedicated `src/audio/sfx/` folder so players can replace popup and notification dings with custom audio files (e.g. anime system chime, bell, or digital notification ping) simply by dropping files into the folder or uploading through the UI.

---

## 2. User Experience & Visual Design

- **Folder Workflow**:
  - The developer or user can place an audio file named `popup.mp3` (or `.wav`, `.ogg`, `.m4a`) directly into `src/audio/sfx/`.
  - A descriptive `README.md` in `src/audio/sfx/` documents the exact naming conventions and supported formats.
- **In-App Management in Settings**:
  - In **Settings** > **Acoustic Resonance (System SFX)**, a dedicated file uploader button (`[ UPLOAD POPUP SFX ]`) and a `[ TEST POPUP SOUND ]` preview button will be added.
  - Shows current sound status: `Default (Synthesized Chime)` or `Custom File (popup.mp3)`.
- **Playback Behavior**:
  - When any modal, qualification prompt, or quest notification appears, the system will play the custom `popup.mp3` with sub-10ms latency using preloaded audio buffers.
  - If the file is missing or fails to load, it automatically falls back to the synthesized Web Audio chime with zero disruption.

---

## 3. Key Product Decisions & Trade-Offs

- **Dedicated SFX Folder (`src/audio/sfx/`)**:
  - *Chosen Approach*: Keep `src/audio/theme/` (music only) and `src/audio/sfx/` (sound effects only) strictly separated.
  - *Why*: Eliminates naming confusion and prevents theme music playlists from accidentally picking up short sound effect clips.
- **Preloaded AudioBuffer / Dual Playback Engine**:
  - *Chosen Approach*: Preload the audio file into memory so rapid clicks and multiple notifications don't suffer network latency or delay.
  - *Why*: Popup sound effects require instantaneous response times (<10ms).
- **Graceful Web Audio Fallback**:
  - *Chosen Approach*: If `src/audio/sfx/popup.mp3` is deleted or empty, the app never goes silent—it retains the crisp sci-fi synthesizer chime.

---

## 4. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────┐
│                   SYSTEM APP ARCHITECTURE               │
└────────────────────────────────────────────────────────┘
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
┌────────────────────────┐           ┌────────────────────────┐
│  src/audio/theme/      │           │  src/audio/sfx/        │
│  (Background Music)    │           │  (Sound Effects)       │
│  - 01-solo-leveling.mp3│           │  - popup.mp3           │
│  - README.md           │           │  - README.md           │
└────────────────────────┘           └────────────────────────┘
       ▲                                       ▲
       │                                       │
┌──────────────┐                     ┌────────────────────────┐
│  useTheme-   │                     │  lib/sound.ts          │
│  Music hook  │                     │  (Hybrid Player:       │
│  & Manager   │                     │   Custom SFX + WebAudio│
└──────────────┘                     │   fallback engine)     │
                                     └────────────────────────┘
                                               │
                                 ┌─────────────┴─────────────┐
                                 ▼                           ▼
                     ┌───────────────────────┐   ┌───────────────────────┐
                     │ Modals & Notifications│   │ Settings Tab          │
                     │ (Triggers popup ding) │   │ (Upload & Test SFX)   │
                     └───────────────────────┘   └───────────────────────┘
```

### File & API Changes
1. **Directory**: `src/audio/sfx/` & `public/audio/sfx/`
   - Create `src/audio/sfx/README.md` describing file placement: `popup.mp3` for popup and notification sounds.
2. **API Endpoint**: `app/api/sfx/upload/route.ts`
   - Handles saving custom popup sound effects to `src/audio/sfx/popup.mp3` and mirroring to `public/audio/sfx/popup.mp3`.
3. **Sound Engine (`lib/sound.ts`)**:
   - Check and preload `/audio/sfx/popup.mp3`.
   - Update `playSystemDing()` to play the custom audio element if available, falling back seamlessly to synthesized tones if not.
4. **Settings UI (`components/SettingsTab.tsx`)**:
   - Add "Popup Sound Effect" controls with preview test button and file upload option.
