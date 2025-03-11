import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import UndoRedoToolbar from './UndoRedoToolbar';

interface UndoRedoContextValue<T> {
  state: T;
  setState: (state: T) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const UndoRedoContext = createContext<UndoRedoContextValue<any> | null>(null);

interface UndoRedoProviderProps<T> {
  initialState: T;
  maxHistory?: number;
  onStateChange?: (state: T) => void;
  children: React.ReactNode;
  showToolbar?: boolean;
  toolbarClassName?: string;
}

export function UndoRedoProvider<T>({
  initialState,
  maxHistory,
  onStateChange,
  children,
  showToolbar = true,
  toolbarClassName
}: UndoRedoProviderProps<T>) {
  const {
    state,
    setState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo
  } = useUndoRedo({
    initialState,
    maxHistory,
    onStateChange
  });

  useKeyboardShortcuts([
    { key: 'z', ctrlKey: true, handler: undo },
    { key: 'y', ctrlKey: true, handler: redo },
    { key: 'z', ctrlKey: true, shiftKey: true, handler: redo }
  ]);

  const contextValue = {
    state,
    setState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo
  };

  return (
    <UndoRedoContext.Provider value={contextValue}>
      {showToolbar && (
        <UndoRedoToolbar
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          className={toolbarClassName}
        />
      )}
      {children}
    </UndoRedoContext.Provider>
  );
}

export function useUndoRedoContext<T>() {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error('useUndoRedoContext must be used within an UndoRedoProvider');
  }
  return context as UndoRedoContextValue<T>;
}