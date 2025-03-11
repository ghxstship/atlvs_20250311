import { useState, useCallback } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseUndoRedoOptions<T> {
  initialState: T;
  maxHistory?: number;
  onStateChange?: (state: T) => void;
}

export function useUndoRedo<T>({
  initialState,
  maxHistory = 50,
  onStateChange
}: UseUndoRedoOptions<T>) {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: []
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const setState = useCallback((newState: T) => {
    setHistory(prev => {
      const newPast = [...prev.past, prev.present].slice(-maxHistory);
      return {
        past: newPast,
        present: newState,
        future: []
      };
    });
    onStateChange?.(newState);
  }, [maxHistory, onStateChange]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);

      onStateChange?.(previous);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, [onStateChange]);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      onStateChange?.(next);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, [onStateChange]);

  const reset = useCallback(() => {
    setHistory({
      past: [],
      present: initialState,
      future: []
    });
    onStateChange?.(initialState);
  }, [initialState, onStateChange]);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    history: {
      past: history.past,
      present: history.present,
      future: history.future
    }
  };
}