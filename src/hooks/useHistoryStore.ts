import { create } from 'zustand';

interface HistoryState<T> {
  past: T[];
  present: T | null;
  future: T[];
}

interface HistoryStore<T> {
  history: HistoryState<T>;
  maxHistory: number;
  pushState: (state: T) => void;
  undo: () => void;
  redo: () => void;
  reset: (initialState: T) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  setMaxHistory: (max: number) => void;
}

export const createHistoryStore = <T>(initialState: T, maxHistorySize = 50) => 
  create<HistoryStore<T>>((set, get) => ({
    history: {
      past: [],
      present: initialState,
      future: []
    },
    maxHistory: maxHistorySize,

    pushState: (newState: T) => set(state => ({
      history: {
        past: [...state.history.past, state.history.present!].slice(-state.maxHistory),
        present: newState,
        future: []
      }
    })),

    undo: () => set(state => {
      const { past, present, future } = state.history;
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);

      return {
        history: {
          past: newPast,
          present: previous,
          future: [present!, ...future]
        }
      };
    }),

    redo: () => set(state => {
      const { past, present, future } = state.history;
      if (future.length === 0) return state;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        history: {
          past: [...past, present!],
          present: next,
          future: newFuture
        }
      };
    }),

    reset: (initialState: T) => set({
      history: {
        past: [],
        present: initialState,
        future: []
      }
    }),

    canUndo: () => get().history.past.length > 0,
    canRedo: () => get().history.future.length > 0,
    setMaxHistory: (max: number) => set({ maxHistory: max })
  }));