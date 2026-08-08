import { create } from 'zustand';
import { sound } from '@/lib/sound';

export type MissionStatus =
  | 'BOOTING'
  | 'ALERT'
  | 'DISPATCHED'
  | 'AIRBORNE'
  | 'IN FLIGHT'
  | 'INSPECTING'
  | 'AI ANALYZING'
  | 'GLOBAL VIEW'
  | 'REVIEWING'
  | 'HARDWARE SCAN'
  | 'DEBRIEFING'
  | 'MISSION COMPLETE';

export type CursorMode =
  | 'DEFAULT'
  | 'SCAN'
  | 'TRACK'
  | 'ANALYZE'
  | 'OPEN DOSSIER'
  | 'ACCEPT MISSION';

interface MissionState {
  currentScene: number;
  progress: number; // 0 to 1
  status: MissionStatus;
  cursorMode: CursorMode;
  isAudioMuted: boolean;
  battery: number;
  altitude: number;
  speed: number;
  missionTime: number; // seconds
  scrollVelocity: number;
  
  setCurrentScene: (scene: number) => void;
  setProgress: (progress: number) => void;
  setStatus: (status: MissionStatus) => void;
  setCursorMode: (mode: CursorMode) => void;
  toggleAudio: () => void;
  setTelemetry: (data: Partial<{ battery: number; altitude: number; speed: number }>) => void;
  setScrollVelocity: (vel: number) => void;
  tickTimer: () => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  currentScene: 1,
  progress: 0,
  status: 'BOOTING',
  cursorMode: 'DEFAULT',
  isAudioMuted: true,
  battery: 100,
  altitude: 0,
  speed: 0,
  missionTime: 0,
  scrollVelocity: 0,

  setCurrentScene: (scene) => set({ currentScene: scene }),
  setProgress: (progress) => set({ progress }),
  setStatus: (status) => set({ status }),
  setCursorMode: (cursorMode) => set({ cursorMode }),
  toggleAudio: () =>
    set((state) => {
      const nextMuted = !state.isAudioMuted;
      sound.setMuted(nextMuted);
      return { isAudioMuted: nextMuted };
    }),
  setTelemetry: (data) => set((state) => ({ ...state, ...data })),
  setScrollVelocity: (scrollVelocity) => set({ scrollVelocity }),
  tickTimer: () => set((state) => ({ missionTime: state.missionTime + 1 })),
}));
