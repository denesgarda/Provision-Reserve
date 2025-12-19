import { AnyEvent, Event } from '../types/events';

/**
 * Represents an undo/redo action
 */
export interface UndoRedoAction {
  readonly event: AnyEvent;
  readonly undoFn: () => Promise<void> | void;
  readonly redoFn: () => Promise<void> | void;
  readonly description: string;
}

/**
 * Event Store manages the history of events and provides undo/redo functionality
 */
export class EventStore {
  private events: AnyEvent[] = [];
  private undoStack: UndoRedoAction[] = [];
  private redoStack: UndoRedoAction[] = [];
  private listeners: Set<(event: AnyEvent) => void> = new Set();

  /**
   * Record an event with undo/redo capabilities
   */
  async recordEvent(action: UndoRedoAction): Promise<void> {
    // Execute the action
    await action.redoFn();

    // Add to undo stack
    this.undoStack.push(action);

    // Clear redo stack when new action is performed
    this.redoStack = [];

    // Store the event
    this.events.push(action.event);

    // Notify listeners
    this.listeners.forEach(listener => listener(action.event));
  }

  /**
   * Record a read-only event (no undo/redo)
   */
  recordReadOnlyEvent(event: AnyEvent): void {
    this.events.push(event);
    this.listeners.forEach(listener => listener(event));
  }

  /**
   * Undo the last action
   */
  async undo(): Promise<boolean> {
    const action = this.undoStack.pop();
    if (!action) {
      return false; // Nothing to undo
    }

    try {
      await action.undoFn();
      this.redoStack.push(action);

      // Notify listeners about the undo operation
      this.listeners.forEach(listener => listener(action.event));

      return true;
    } catch (error) {
      // If undo fails, put the action back on the undo stack
      this.undoStack.push(action);
      throw error;
    }
  }

  /**
   * Redo the last undone action
   */
  async redo(): Promise<boolean> {
    const action = this.redoStack.pop();
    if (!action) {
      return false; // Nothing to redo
    }

    try {
      await action.redoFn();
      this.undoStack.push(action);

      // Notify listeners about the redo operation
      this.listeners.forEach(listener => listener(action.event));

      return true;
    } catch (error) {
      // If redo fails, put the action back on the redo stack
      this.redoStack.push(action);
      throw error;
    }
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * Get the description of the next undo action
   */
  getUndoDescription(): string | null {
    const action = this.undoStack[this.undoStack.length - 1];
    return action ? action.description : null;
  }

  /**
   * Get the description of the next redo action
   */
  getRedoDescription(): string | null {
    const action = this.redoStack[this.redoStack.length - 1];
    return action ? action.description : null;
  }

  /**
   * Get all events in chronological order
   */
  getEvents(): readonly AnyEvent[] {
    return [...this.events];
  }

  /**
   * Get events filtered by type
   */
  getEventsByType(type: string): readonly AnyEvent[] {
    return this.events.filter(event => event.type === type);
  }

  /**
   * Get events within a time range
   */
  getEventsInRange(startTime: Date, endTime: Date): readonly AnyEvent[] {
    return this.events.filter(
      event => event.timestamp >= startTime && event.timestamp <= endTime
    );
  }

  /**
   * Clear all events and undo/redo history
   */
  clear(): void {
    this.events = [];
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Add an event listener
   */
  addEventListener(listener: (event: AnyEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Remove an event listener
   */
  removeEventListener(listener: (event: AnyEvent) => void): void {
    this.listeners.delete(listener);
  }

  /**
   * Get current state for debugging/serialization
   */
  getState() {
    return {
      eventCount: this.events.length,
      undoStackSize: this.undoStack.length,
      redoStackSize: this.redoStack.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      nextUndo: this.getUndoDescription(),
      nextRedo: this.getRedoDescription()
    };
  }
}

// Global event store instance
export const eventStore = new EventStore();
