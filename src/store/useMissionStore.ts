import { create } from 'zustand';

export type MissionStatus =
  | 'BOOTING'
  | 'ALERT'
  | 'AIRBORNE'
  | 'INSPECTING'
  | 'AI ANALYZING'
  | 'GLOBAL VIEW'
  | 'DEBRIEFING'
  | 'MISSION COMPLETE'
  | string;

export interface MissionTelemetry {
  battery: number;
  altitude: number; // meters
  speed: number;    // km/h
}

export type CursorMode = 'DEFAULT' | 'TRACK' | 'SCAN' | 'ANALYZE' | 'OPEN DOSSIER' | 'ACCEPT MISSION';

interface MissionState {
  progress: number; // 0.0 to 1.0
  status: MissionStatus;
  activeStatus: MissionStatus;
  currentScene: number;
  battery: number;
  altitude: number;
  speed: number;
  missionTime: number;
  isAudioMuted: boolean;
  telemetry: MissionTelemetry;
  cursorMode: CursorMode;
  setProgress: (p: number) => void;
  setStatus: (s: MissionStatus) => void;
  setTelemetry: (t: Partial<MissionTelemetry>) => void;
  setCursorMode: (mode: CursorMode) => void;
  setScrollVelocity: (v: number) => void;
  tickTimer: () => void;
  toggleAudio: () => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  progress: 0,
  status: 'BOOTING',
  activeStatus: 'CH 01 // THE ESSENCE',
  currentScene: 1,
  battery: 100,
  altitude: 0,
  speed: 0,
  missionTime: 0,
  isAudioMuted: true,
  telemetry: {
    battery: 100,
    altitude: 0,
    speed: 0,
  },
  cursorMode: 'DEFAULT',
  setProgress: (p) => set({ progress: p }),
  setStatus: (s) => set({ status: s, activeStatus: s }),
  setTelemetry: (t) =>
    set((state) => ({
      telemetry: { ...state.telemetry, ...t },
      battery: t.battery !== undefined ? t.battery : state.battery,
      altitude: t.altitude !== undefined ? t.altitude : state.altitude,
      speed: t.speed !== undefined ? t.speed : state.speed,
    })),
  setCursorMode: (mode) => set({ cursorMode: mode }),
  setScrollVelocity: () => {},
  tickTimer: () => set((state) => ({ missionTime: state.missionTime + 1 })),
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
}));
