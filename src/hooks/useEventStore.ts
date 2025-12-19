import { useState, useEffect, useCallback } from 'react';
import { eventStore, UndoRedoAction } from '../utils/eventStore';
import { AnyEvent } from '../types/events';

/**
 * Hook for accessing event store functionality
 */
export function useEventStore() {
  const [canUndo, setCanUndo] = useState(eventStore.canUndo());
  const [canRedo, setCanRedo] = useState(eventStore.canRedo());
  const [undoDescription, setUndoDescription] = useState<string | null>(eventStore.getUndoDescription());
  const [redoDescription, setRedoDescription] = useState<string | null>(eventStore.getRedoDescription());

  // Update state when event store changes
  const updateState = useCallback(() => {
    setCanUndo(eventStore.canUndo());
    setCanRedo(eventStore.canRedo());
    setUndoDescription(eventStore.getUndoDescription());
    setRedoDescription(eventStore.getRedoDescription());
  }, []);

  // Listen for event store changes
  useEffect(() => {
    const unsubscribe = eventStore.addEventListener(updateState);
    return unsubscribe;
  }, [updateState]);

  const recordEvent = useCallback(async (action: UndoRedoAction) => {
    await eventStore.recordEvent(action);
  }, []);

  const recordReadOnlyEvent = useCallback((event: AnyEvent) => {
    eventStore.recordReadOnlyEvent(event);
  }, []);

  const undo = useCallback(async () => {
    return await eventStore.undo();
  }, []);

  const redo = useCallback(async () => {
    return await eventStore.redo();
  }, []);

  const clear = useCallback(() => {
    eventStore.clear();
  }, []);

  const getEvents = useCallback(() => {
    return eventStore.getEvents();
  }, []);

  const getState = useCallback(() => {
    return eventStore.getState();
  }, []);

  return {
    // Actions
    recordEvent,
    recordReadOnlyEvent,
    undo,
    redo,
    clear,
    getEvents,
    getState,

    // State
    canUndo,
    canRedo,
    undoDescription,
    redoDescription
  };
}

/**
 * Hook for toolbar undo/redo buttons
 */
export function useToolbarUndoRedo() {
  const { canUndo, canRedo, undoDescription, redoDescription, undo, redo } = useEventStore();

  const handleUndo = useCallback(async () => {
    try {
      const success = await undo();
      if (!success) {
        console.warn('Nothing to undo');
      }
    } catch (error) {
      console.error('Undo failed:', error);
      // You might want to show a toast notification here
    }
  }, [undo]);

  const handleRedo = useCallback(async () => {
    try {
      const success = await redo();
      if (!success) {
        console.warn('Nothing to redo');
      }
    } catch (error) {
      console.error('Redo failed:', error);
      // You might want to show a toast notification here
    }
  }, [redo]);

  return {
    canUndo,
    canRedo,
    undoDescription,
    redoDescription,
    handleUndo,
    handleRedo
  };
}
